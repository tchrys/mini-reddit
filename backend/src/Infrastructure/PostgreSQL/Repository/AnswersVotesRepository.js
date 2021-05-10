const {
    queryAsync
} = require('..');

const addAsync = async (answer_id, user_id) => {
    const queryText = 'INSERT INTO answers_users (answer_id, user_id, vote_date) VALUES ($1, $2, $3) RETURNING *'
    await queryAsync(queryText, [answer_id, user_id, new Date()]);
    const answer =  await queryAsync('UPDATE answers SET votes = votes + 1 WHERE id = $1 RETURNING *', [answer_id]);
    answer[0].voted = true;
    return answer[0];
};

// const getByAnswerIdAsync = async (answer_id) => {
//     return await queryAsync('SELECT * FROM answers_users WHERE answer_id = $1', [answer_id]);
// };

const getAnswerVotesAsync = async (answer_id) => {
    return await queryAsync('SELECT COUNT(*) FROM answers_users WHERE answer_id = $1', [answer_id]);
}

const deleteByIdAsync = async (answer_id, user_id) => {
    const queryText = 'DELETE FROM answers_users WHERE answer_id = $1 AND user_id = $2 RETURNING *'
    const res = await queryAsync(queryText, [answer_id, user_id]);
    if (!res) {
        return undefined;
    }
    const answer = await queryAsync('UPDATE answers SET votes = votes - 1 WHERE id = $1 RETURNING *', [answer_id]);
    answer[0].voted = false;
    return answer[0];
};

module.exports = {
    addAsync,
    // getByAnswerIdAsync,
    getAnswerVotesAsync,
    deleteByIdAsync
}