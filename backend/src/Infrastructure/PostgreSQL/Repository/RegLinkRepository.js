const {
    queryAsync
} = require('..');

const addAsync = async (user_id, link) => {
    const insertText = 'INSERT INTO registration_links (user_id, link, expiry_date) VALUES ($1, $2, $3) RETURNING *';
    const roles = await queryAsync(insertText, [user_id, link, new Date(new Date().getTime() + 15 * 60000)]);

    return roles[0];
};

const getByLinkAsync = async(link) => {
    console.info(`Getting all roles from database`);
    console.log(link);
    const links =  await queryAsync('SELECT * FROM registration_links WHERE link = $1', [link]);

    return links[0];
};

const deleteByIdAsync = async(link) => {
    return await queryAsync('DELETE FROM registration_links WHERE link = $1', [link]);
}

module.exports = {
    addAsync,
    getByLinkAsync,
    deleteByIdAsync
}