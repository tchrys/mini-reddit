const express = require('express');

const AnswerRepository = require('../../Infrastructure/PostgreSQL/Repository/AnswersRepository.js');
const ServerError = require('../Models/ServerError.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');
const ResponseFilter = require('../Filters/ResponseFilter.js');
const UtilConverter = require('../Models/UtilConverter.js');


const Router = express.Router();

Router.post('/', AuthorizationFilter.authorizeAll(), async (req, res) => {
    const answer = await AnswerRepository.addAsync(req.body.text, parseInt(req.body.questionId));
    ResponseFilter.setResponseDetails(res, 201, UtilConverter.answerDbResToJson(answer), req.originalUrl);
});

Router.get('/:id', AuthorizationFilter.authorizeAll(), async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }
    const answer = await AnswerRepository.getByIdAsync(id, parseInt(req.user.userId));
    if (!answer) {
        throw new ServerError(`Answer with id ${id} does not exist!`, 404);
    }
    ResponseFilter.setResponseDetails(res, 200, UtilConverter.answerDbResToJson(answer));
});

Router.put('/:id', AuthorizationFilter.authorizeAll(), async (req, res) => {
    const answer = await AnswerRepository.updateByIdAsync(parseInt(req.body.id), req.body.text, parseInt(req.user.userId));
    if (!answer) {
        throw new ServerError(`Answer with id ${id} does not exist!`, 404);
    }
    ResponseFilter.setResponseDetails(res, 200, UtilConverter.answerDbResToJson(answer));
});

Router.delete('/:id', AuthorizationFilter.authorizeNotUsers(), async (req, res) => {
    const { id } = req.params;
    const answer = await AnswerRepository.deleteByIdAsync(parseInt(id));
    if (!answer) {
        throw new ServerError(`Answer with id ${id} does not exist!`, 404);
    }
    ResponseFilter.setResponseDetails(res, 204, "Entity deleted succesfully");
});

Router.get('/question/:id',AuthorizationFilter.authorizeAll(), async (req, res) => {
   let { id } = req.params;
   id = parseInt(id);
   const orderBy = req.query.orderBy;
   let answer = undefined;
   if (orderBy === 'date') {
       answer = await AnswerRepository.getByQuestionIdOrderByDate(id, parseInt(req.user.userId));
   } else if (orderBy === 'votes') {
       answer = await AnswerRepository.getByQuestionIdOrderByVotes(id, parseInt(req.user.userId));
   }
   if (!answer) {
       throw new ServerError(`Question with id ${id} does not exist!`, 404);
   }
   ResponseFilter.setResponseDetails(res, 200, answer.map(ans => UtilConverter.answerDbResToJson(ans)));
});

module.exports = Router;