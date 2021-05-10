const {
    queryAsync
} = require('..');

const getAllAsync = async() => {
    console.info ('Getting all users from database');
    
    return await queryAsync('SELECT id, username, role_id FROM users');
};

const getUserById = async(userId) => {
    const users = await queryAsync('SELECT u.id as id, r.value as role FROM users u join roles r on r.id = u.role_id where u.id = $1', [userId]);
    return users[0];
}

const addAsync = async (username, password, email) => {
    console.info(`Adding user ${username}`);

    const users = await queryAsync('INSERT INTO users (username, password, role_id, is_active, email) VALUES ($1, $2, 3, false, $3) RETURNING id, username, role_id, email', [username, password, email]);
    return users[0];
};

const activateAccount = async(userId) => {
    const users = await queryAsync('UPDATE users SET is_active = true WHERE id = $1 RETURNING *', [userId]);
    return users[0];
}

const getByUsernameWithRoleAsync = async (username) => {
    console.info(`Getting user with username ${username}`);
    
    const users = await queryAsync(`SELECT u.id, u.password, u.is_active, 
                                u.username, r.value as role,
                                r.id as role_id FROM users u 
                                JOIN roles r ON r.id = u.role_id
                                WHERE u.username = $1`, [username]);
    return users[0];
};

const changeUserRole = async (userId, roleId) => {
    const users = await queryAsync('UPDATE users SET role_id = $1 WHERE id = $2 RETURNING id, username, role_id', [roleId, userId]);
    return users[0];
}

const deleteUser = async(userId) => {
    await queryAsync('DELETE from improvement_request where user_id = $1', [userId]);
    await queryAsync('DELETE from questions_users where user_id = $1', [userId]);
    await queryAsync('DELETE from answers_users where user_id = $1', [userId]);
    const users = await queryAsync('DELETE FROM users where id = $1 returning *', [userId]);
    return users[0];
}

const addSupport = async (username, password, email) => {
    const users = await queryAsync('INSERT INTO users (username, password, role_id, is_active, email) VALUES ($1, $2, 3, true, $3) RETURNING id, username, role_id', [username, password, email]);
    return users[0];
};

const getUserActivityLastNDays = async(days, userId) => {
    const activity = [];
    for (let i = 0; i < days; ++i) {
        let dayActivity = await queryAsync(`select
\t(
\t\t(select count(*) from questions_users qu where qu.user_id = $1
\t\tand qu.vote_date between now()::date - (1 + $2) and now()::date - $2) +
\t(
\t\tselect count(*) from answers_users au where au.user_id = $1
\t\tand au.vote_date between now()::date - (1 + $2) and now()::date - $2)\t\t
\t) as likes, now()::date - $2 as date; `, [userId, i]);
        activity.push(dayActivity[0]);
    }
    return activity;
}

const getQuestionLikesLastDays = async (days) => {
    const activity = [];
    for (let i = 0; i < days; ++i) {
        let dayActivity = await queryAsync(`select
\t(
\t\t(select count(*) from questions_users qu where
\t\t qu.vote_date between now()::date - (1 + $1) and now()::date - $1)\t\t
\t) as likes, now()::date - $1 as date`, [i]);
        activity.push(dayActivity[0]);
    }
    return activity;
}

const getAnswerLikesLastDays = async(days) => {
    const activity = [];
    for (let i = 0; i < days; ++i) {
        let dayActivity = await queryAsync(`select
\t(
\t\t(select count(*) from answers_users au where
\t\t au.vote_date between now()::date - (1 + $1) and now()::date - $1)\t\t
\t) as likes, now()::date - $1 as date`, [i]);
        activity.push(dayActivity[0]);
    }
    return activity;
}



module.exports = {
    getAllAsync,
    getUserById,
    addAsync,
    activateAccount,
    getByUsernameWithRoleAsync,
    changeUserRole,
    deleteUser,
    addSupport,
    getUserActivityLastNDays,
    getQuestionLikesLastDays,
    getAnswerLikesLastDays
}