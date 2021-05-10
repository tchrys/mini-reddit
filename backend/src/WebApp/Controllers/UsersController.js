const express = require('express');

const UsersManager = require('../../WebCore/Managers/UsersManager.js');
const UsersRepository = require('../../Infrastructure/PostgreSQL/Repository/UsersRepository.js');

const {
    UserBody,
    UserRegisterResponse,
    UserLoginResponse
} = require ('../Models/Users.js');
const ResponseFilter = require('../Filters/ResponseFilter.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');
const { authorizeAndExtractTokenAsync } = require('../Filters/JWTFilter.js');

const Router = express.Router();

Router.post('/register', async (req, res) => {

    const userBody = new UserBody(req.body);
    console.log(userBody);
    const user = await UsersManager.registerAsync(userBody.Username, userBody.Password, userBody.email);
    console.log(user);

    ResponseFilter.setResponseDetails(res, 201, new UserRegisterResponse(user));
});

Router.post('/login', async (req, res) => {

    const userBody = new UserBody(req.body);
    const userDto = await UsersManager.authenticateAsync(userBody.Username, userBody.Password);
    const user = new UserLoginResponse(userDto.Token, userDto.Role);

    ResponseFilter.setResponseDetails(res, 200, user);
});

Router.get('/activate/:token', async(req,res) => {
   let { token } = req.params;
   await UsersManager.activateAccount(token);
   ResponseFilter.setResponseDetails(res, 201);
});



Router.get('/', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeOnlyAdmin(), async (req, res) => {

    const users = await UsersRepository.getAllAsync();

    ResponseFilter.setResponseDetails(res, 200, users.map(user => new UserRegisterResponse(user)));
});

Router.get('/my-role', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeAll(), async(req, res) => {
    const user = await UsersRepository.getUserById(parseInt(req.user.userId));
    ResponseFilter.setResponseDetails(res, 200, user);
});


Router.put('/:userId/role/:roleId', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeOnlyAdmin(), async (req, res) => {
    let {
        userId,
        roleId
    } = req.params;

    userId = parseInt(userId);
    roleId = parseInt(roleId);

    const user = await UsersRepository.changeUserRole(userId, roleId);
    ResponseFilter.setResponseDetails(res, 200, new UserRegisterResponse(user));
});

Router.delete('/:userId', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeOnlyAdmin(), async (req, res) => {
   let { userId } = req.params;
   userId = parseInt(userId);
   const user = await UsersRepository.deleteUser(userId);
   if (!user) {
       throw new ServerError(`User with id ${userId} does not exist`, 404);
   }
   ResponseFilter.setResponseDetails(res, 204, "Entity deleted succesfully");
});

Router.post('/support', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeAll(), async (req, res) => {
    const user = await UsersRepository.addSupport(req.body.username, req.body.password, req.body.email);
    ResponseFilter.setResponseDetails(res, 201, new UserRegisterResponse(user));
});

Router.get('/activity/user', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeAll(), async (req, res) => {
   const userId = parseInt(req.query.user);
   const days = parseInt(req.query.days);
   const activity = await UsersRepository.getUserActivityLastNDays(days, userId);
   ResponseFilter.setResponseDetails(res, 200, activity);
});

Router.get('/activity/overall', authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeAll(), async(req, res) => {
   const days = parseInt(req.query.days);
   const type = req.query.type;
   let activity;
   if (type === 'questions') {
       activity = await UsersRepository.getQuestionLikesLastDays(days);
   } else if (type === 'answers') {
       activity = await UsersRepository.getAnswerLikesLastDays(days);
   }
   ResponseFilter.setResponseDetails(res, 200, activity);
});



module.exports = Router;