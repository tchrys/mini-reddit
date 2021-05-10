const ServerError = require('../Models/ServerError.js');
const RoleConstants = require('../Constants/Roles.js');

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        for (let i = 0; i < roles.length; i++) {
            // TODO: in functie de implemetare
            // verificati daca req.user contine role sau userRole
            if (req.user.userRole === roles[i]) { // observati cum in req exista obiectul user trimis la middlewareul anterior, de autorizare token
                    return next();
            }
        }
        throw new ServerError('Nu sunteti autorizat sa accesati resursa!', 403);
    }
};

const authorizeAll = () => {
    return authorizeRoles(RoleConstants.USER, RoleConstants.SUPPORT, RoleConstants.ADMIN);
}

const authorizeNotUsers = () => {
    return authorizeRoles(RoleConstants.SUPPORT, RoleConstants.ADMIN);
}

const authorizeOnlyAdmin = () => {
    return authorizeRoles(RoleConstants.ADMIN);
}
 
module.exports = {
    authorizeRoles,
    authorizeAll,
    authorizeNotUsers,
    authorizeOnlyAdmin
}