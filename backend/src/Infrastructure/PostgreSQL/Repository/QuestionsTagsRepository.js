const {
    queryAsync
} = require('..');

const addAsync = async (question_id, tag_id) => {
    const queryText = 'INSERT INTO questions_tags (question_id, tag_id) VALUES ($1, $2) RETURNING *'
    const res = await queryAsync(queryText, [question_id, tag_id]);
    return res[0];
};

const getByQuestionIdAsync = async (question_id) => {
    return await queryAsync('SELECT t.id, t.name FROM tags t, questions_tags qt WHERE qt.question_id = $1 AND t.id = qt.tag_id', [question_id]);
};

const getTagsByAppearance = async () => {
    return await queryAsync('SELECT tag_id as id, (SELECT name from tags where id = tag_id) as name, COUNT(question_id) as appearances FROM questions_tags GROUP BY tag_id ORDER BY 3 DESC');
}

// const deleteByIdAsync = async (question_id, tag_id) => {
//     const queryText = 'DELETE FROM question_tags WHERE question_id = $1 AND tag_id = $2 RETURNING *'
//     const res = await queryAsync(queryText, [question_id, tag_id]);
//     return res[0];
//
// };

module.exports = {
    addAsync,
    getByQuestionIdAsync,
    getTagsByAppearance,
    // deleteByIdAsync
}