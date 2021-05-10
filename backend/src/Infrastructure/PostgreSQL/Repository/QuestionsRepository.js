const {
    queryAsync
} = require('..');

const addAsync = async (text, topic_id) => {
    const queryText = 'INSERT INTO questions (text, votes, topic_id, q_date) VALUES ($1, 0, $2, $3) RETURNING *'
    const questions = await queryAsync(queryText, [text, topic_id, new Date()]);
    questions[0].voted = false;
    return questions[0];
};

// const getAllAsync = async () => {
//     return await queryAsync('SELECT * FROM questions');
// };

const getQuestionsLastDay = async(userId) => {
    return await queryAsync('SELECT q.id, q.text, q.votes, q.topic_id, q.q_date, q.answers, (select exists (select * from questions_users qu where qu.question_id = q.id and qu.user_id = $1)) as voted FROM questions q where q.q_date > now()::date - 1', [userId]);
}

const getByIdAsync = async (id, userId) => {
    const questions = await queryAsync('SELECT q.id, q.text, q.votes, q.topic_id, q.q_date, q.answers, (select exists (select * from questions_users qu where qu.question_id = q.id and qu.user_id = $2)) as voted FROM questions q WHERE q.id = $1', [id, userId]);
    return questions[0];
};

const updateByIdAsync = async (id, text, user_id) => {
    const questions =  await queryAsync('UPDATE questions SET text = $1 WHERE id = $2 RETURNING *', [text, id]);
    return getByIdAsync(id, user_id);
};

const deleteByIdAsync = async (id) => {
    await queryAsync('DELETE FROM questions_tags where question_id = $1', [id]);
    await queryAsync('DELETE FROM questions_users where question_id = $1', [id]);
    await queryAsync('DELETE FROM answers_users au where exists (select * from answers where question_id = $1 and id = au.answer_id)', [id]);
    await queryAsync('DELETE FROM answers where question_id = $1', [id]);
    const questions = await queryAsync('DELETE FROM questions WHERE id = $1 RETURNING *', [id]);
    return questions[0];

};

const getQuestionsByTopicIdOrderByVotes = async(topic_id, user_id) => {
    return await queryAsync('SELECT q.id, q.text, q.votes, q.topic_id, q.q_date, q.answers,(select exists (select * from questions_users qu where qu.question_id = q.id and qu.user_id = $2)) as voted FROM questions q WHERE q.topic_id = $1 order by q.votes desc', [topic_id, user_id]);
}

const getQuestionsByTopicIdOrderByDate = async(topic_id, user_id) => {
    return await queryAsync('SELECT q.id, q.text, q.votes, q.topic_id, q.q_date, q.answers, (select exists (select * from questions_users qu where qu.question_id = q.id and qu.user_id = $2)) as voted  FROM questions q WHERE q.topic_id = $1 order by q.q_date desc', [topic_id, user_id]);
}

const getQuestionsByTagIdOrderByVotes = async(tag_id, user_id) => {
    return await queryAsync('SELECT q.id, q.text, q.votes, q.topic_id, q.q_date, q.answers, (select exists (select * from questions_users qu where qu.question_id = q.id and qu.user_id = $2)) as voted from questions q JOIN questions_tags qt ON qt.tag_id = $1 AND qt.question_id = q.id order by q.votes desc', [tag_id, user_id]);
}

const getQuestionsByTagIdOrderByDate = async(tag_id, user_id) => {
    return await queryAsync('SELECT q.id, q.text, q.votes, q.topic_id, q.q_date, q.answers, (select exists (select * from questions_users qu where qu.question_id = q.id and qu.user_id = $2)) as voted from questions q JOIN questions_tags qt ON qt.tag_id = $1 AND qt.question_id = q.id order by q.q_date desc', [tag_id, user_id]);
}

module.exports = {
    addAsync,
    // getAllAsync,
    getQuestionsLastDay,
    getByIdAsync,
    updateByIdAsync,
    deleteByIdAsync,
    getQuestionsByTopicIdOrderByVotes,
    getQuestionsByTopicIdOrderByDate,
    getQuestionsByTagIdOrderByVotes,
    getQuestionsByTagIdOrderByDate
}