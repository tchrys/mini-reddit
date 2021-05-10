const express = require('express');

const AnswersVotesRepository = require('../../Infrastructure/PostgreSQL/Repository/AnswersVotesRepository.js');
const QuestionsVotesRepository = require('../../Infrastructure/PostgreSQL/Repository/QuestionsVotesRepository.js');
const QuestionsTagsRepo = require('../../Infrastructure/PostgreSQL/Repository/QuestionsTagsRepository.js');
const ServerError = require('../Models/ServerError.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');
const ResponseFilter = require('../Filters/ResponseFilter.js');
const UtilConverter = require('../Models/UtilConverter.js');

const Router = express.Router();

// vote ans quest
// delete vote ans quest
// get votes ans quest

Router.post('/answer/:id', AuthorizationFilter.authorizeRoles(RoleConstants.USER), async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    const user_id = parseInt(req.user.userId);
    const answer = await AnswersVotesRepository.addAsync(id, user_id);
    ResponseFilter.setResponseDetails(res, 201, UtilConverter.answerDbResToJson(answer), req.originalUrl);
});

Router.post('/question/:id', AuthorizationFilter.authorizeRoles(RoleConstants.USER), async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    const user_id = parseInt(req.user.userId);
    const question = await QuestionsVotesRepository.addAsync(id, user_id);
    question.tags = await QuestionsTagsRepo.getByQuestionIdAsync(question.id);
    ResponseFilter.setResponseDetails(res, 201, UtilConverter.questionDbResToJson(question), req.originalUrl);
});

// Router.get('/answer/:id', AuthorizationFilter.authorizeAll(), async (req, res) => {
//     let { id } = req.params;
//     id = parseInt(id);
//     const noVotes = await AnswersVotesRepository.getAnswerVotesAsync(id);
//     if (!noVotes) {
//         throw new ServerError(`Answer with id ${id} does not exist!`, 404);
//     }
//     ResponseFilter.setResponseDetails(res, 200, {answerId: id, votes: noVotes});
// });
//
// Router.get('/question/:id', AuthorizationFilter.authorizeAll(), async (req, res) => {
//     let { id } = req.params;
//     id = parseInt(id);
//     const noVotes = await QuestionsVotesRepository.getQuestionVotesAsync(id);
//     if (!noVotes) {
//         throw new ServerError(`Question with id ${id} does not exist!`, 404);
//     }
//     ResponseFilter.setResponseDetails(res, 200, {questionId: id, votes: noVotes});
// });


Router.delete('/answer/:id', AuthorizationFilter.authorizeRoles(RoleConstants.USER), async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    const userId = parseInt(req.user.userId);
    const answer = await AnswersVotesRepository.deleteByIdAsync(id, userId);
    if (!answer) {
        throw new ServerError(`Answer with id ${id} does not exist!`, 404);
    }
    ResponseFilter.setResponseDetails(res, 200, UtilConverter.answerDbResToJson(answer));
});

Router.delete('/question/:id', AuthorizationFilter.authorizeRoles(RoleConstants.USER), async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    const userId = parseInt(req.user.userId);
    const question = await QuestionsVotesRepository.deleteByIdAsync(id, userId);
    if (!question) {
        throw new ServerError(`Question with id ${id} does not exist!`, 404);
    }
    question.tags = await QuestionsTagsRepo.getByQuestionIdAsync(question.id);
    ResponseFilter.setResponseDetails(res, 200, UtilConverter.questionDbResToJson(question));
});



module.exports = Router;