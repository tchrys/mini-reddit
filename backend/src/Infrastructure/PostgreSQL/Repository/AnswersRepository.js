const {
    queryAsync
} = require('..');

const addAsync = async (text, question_id) => {
    const queryText = 'INSERT INTO answers (text, question_id, votes, a_date) VALUES ($1, $2, 0, $3) RETURNING *'
    const answers = await queryAsync(queryText, [text, question_id, new Date()]);
    answers[0].voted = false;
    await queryAsync('UPDATE questions set answers = answers + 1 WHERE id = $1', [question_id]);
    return answers[0];
};

const getByIdAsync = async (id, user_id) => {
    const answers = await queryAsync('SELECT a.id, a.text, a.question_id, a.votes, a.a_date, (select exists (select * from answers_users au where au.answer_id = a.id and au.user_id = $2)) as voted FROM answers a WHERE a.id = $1', [id, user_id]);
    return answers[0];
};

const updateByIdAsync = async (id, text, user_id) => {
    const answers =  await queryAsync('UPDATE answers SET text = $1 WHERE id = $2 RETURNING *', [text, id]);
    return getByIdAsync(id, user_id);
};

const deleteByIdAsync = async (id) => {
    await queryAsync('DELETE FROM answers_users where answer_id = $1', [id]);
    const answers = await queryAsync('DELETE FROM answers WHERE id = $1 RETURNING *', [id]);
    await queryAsync('UPDATE questions set answers = answers - 1 WHERE id =$1', [answers[0].question_id]);
    return answers[0];
};

const getByQuestionIdOrderByVotes = async(question_id, user_id) => {
    return await queryAsync('SELECT a.id, a.text, a.question_id, a.votes, a.a_date, (select exists (select * from answers_users au where au.answer_id = a.id and au.user_id = $2)) as voted FROM answers a where a.question_id = $1 order by a.votes desc', [question_id, user_id]);
}

const getByQuestionIdOrderByDate = async(question_id, user_id) => {
  return await queryAsync('SELECT a.id, a.text, a.question_id, a.votes, a.a_date, (select exists (select * from answers_users au where au.answer_id = a.id and au.user_id = $2)) as voted  FROM answers a where a.question_id = $1 order by a.a_date desc', [question_id, user_id]);
};

module.exports = {
    addAsync,
    getByIdAsync,
    updateByIdAsync,
    deleteByIdAsync,
    getByQuestionIdOrderByVotes,
    getByQuestionIdOrderByDate
}