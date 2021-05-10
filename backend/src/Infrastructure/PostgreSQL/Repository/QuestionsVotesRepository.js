const {
    queryAsync
} = require('..');

const addAsync = async (question_id, user_id) => {
    const queryText = 'INSERT INTO questions_users (question_id, user_id, vote_date) VALUES ($1, $2, $3) RETURNING *'
    await queryAsync(queryText, [question_id, user_id, new Date()]);
    const question =  await queryAsync('UPDATE questions SET votes = votes + 1 WHERE id = $1 RETURNING *', [question_id]);
    question[0].voted = true;
    return question[0];
};

// const getByQuestionIdAsync = async (id) => {
//     return await queryAsync('SELECT * FROM questions_users WHERE question_id = $1', [id]);
// };

const getQuestionVotesAsync = async(question_id) => {
    return await queryAsync('SELECT COUNT(*) FROM questions_users WHERE question_id = $1', [question_id]);
}

const deleteByIdAsync = async (question_id, user_id) => {
    const queryText = 'DELETE FROM questions_users WHERE question_id = $1 AND user_id = $2 RETURNING *'
    const res = await queryAsync(queryText, [question_id, user_id]);
    if (!res) {
        return undefined;
    }
    const question = await queryAsync('UPDATE questions SET votes = votes - 1 WHERE id = $1 RETURNING *', [question_id]);
    question[0].voted = false;
    return question[0];
};

module.exports = {
    addAsync,
    // getByQuestionIdAsync,
    getQuestionVotesAsync,
    deleteByIdAsync
}