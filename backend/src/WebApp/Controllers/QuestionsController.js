const express = require('express');

const QuestionsRepository = require('../../Infrastructure/PostgreSQL/Repository/QuestionsRepository.js');
const TagsRepo = require('../../Infrastructure/PostgreSQL/Repository/TagsRepository.js');
const QuestionTagsRepo = require('../../Infrastructure/PostgreSQL/Repository/QuestionsTagsRepository.js');
const ServerError = require('../Models/ServerError.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');
const ResponseFilter = require('../Filters/ResponseFilter.js');
const UtilConverter = require('../Models/UtilConverter.js');


const Router = express.Router();

Router.post('/', AuthorizationFilter.authorizeAll(), async (req, res) => {
    const question = await QuestionsRepository.addAsync(req.body.text, parseInt(req.body.topicId));
    const tags = [];
    for (const tag of req.body.questionTags) {
        let tagDb = await TagsRepo.addAsync(tag);
        tags.push(tagDb);
    }
    for (const tag of tags) {
       await QuestionTagsRepo.addAsync(question.id, tag.id);
    }
    question.tags = await QuestionTagsRepo.getByQuestionIdAsync(question.id);
    ResponseFilter.setResponseDetails(res, 201, UtilConverter.questionDbResToJson(question), req.originalUrl);
});

Router.get('/last', AuthorizationFilter.authorizeAll(), async (req, res) => {
   const questions = await QuestionsRepository.getQuestionsLastDay(parseInt(req.user.userId));
   for (const q of questions) {
       q.tags = await QuestionTagsRepo.getByQuestionIdAsync(q.id);
   }
   ResponseFilter.setResponseDetails(res, 200, questions.map(q => UtilConverter.questionDbResToJson(q)), req.originalUrl);
});

Router.get('/:id', AuthorizationFilter.authorizeAll(), async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }
    const question = await QuestionsRepository.getByIdAsync(id, parseInt(req.user.userId));
    if (!question) {
        throw new ServerError(`Question with id ${id} does not exist!`, 404);
    }
    question.tags = await QuestionTagsRepo.getByQuestionIdAsync(question.id);
    ResponseFilter.setResponseDetails(res, 200, UtilConverter.questionDbResToJson(question));
});

Router.put('/:id', AuthorizationFilter.authorizeAll(), async (req, res) => {
    const question = await QuestionsRepository.updateByIdAsync(parseInt(req.body.id), req.body.text, parseInt(req.user.userId));
    if (!question) {
        throw new ServerError(`Answer with id ${id} does not exist!`, 404);
    }
    question.tags = await QuestionTagsRepo.getByQuestionIdAsync(question.id);
    ResponseFilter.setResponseDetails(res, 200, UtilConverter.questionDbResToJson(question));
});

Router.delete('/:id', AuthorizationFilter.authorizeNotUsers(), async (req, res) => {
    const { id } = req.params;
    const question = await QuestionsRepository.deleteByIdAsync(parseInt(id));
    if (!question) {
        throw new ServerError(`Question with id ${id} does not exist!`, 404);
    }
    ResponseFilter.setResponseDetails(res, 204, "Entity deleted succesfully");
});

Router.get('/topic/:id',AuthorizationFilter.authorizeAll(), async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    const orderBy = req.query.orderBy;
    let questions = undefined;
    if (orderBy === 'date') {
        questions = await QuestionsRepository.getQuestionsByTopicIdOrderByDate(id, parseInt(req.user.userId));
    } else if (orderBy === 'votes') {
        questions = await QuestionsRepository.getQuestionsByTopicIdOrderByVotes(id, parseInt(req.user.userId));
    }
    if (!questions) {
        throw new ServerError(`Topic with id ${id} does not exist!`, 404);
    }
    for (const q of questions) {
        q.tags = await QuestionTagsRepo.getByQuestionIdAsync(q.id);
    }
    ResponseFilter.setResponseDetails(res, 200, questions.map(q => UtilConverter.questionDbResToJson(q)));
});

Router.get('/tag/:id', AuthorizationFilter.authorizeAll(), async (req, res) => {
   let { id } = req.params;
   id = parseInt(id);
   const orderBy = req.query.orderBy;
   let questions = undefined;
   if (orderBy === 'date') {
       questions = await QuestionsRepository.getQuestionsByTagIdOrderByDate(id, parseInt(req.user.userId));
   } else if (orderBy === 'votes') {
       questions = await QuestionsRepository.getQuestionsByTagIdOrderByVotes(id, parseInt(req.user.userId));
   }
   if (!questions) {
       throw new ServerError(`Tag with id ${id} does not exist!`, 404);
   }
   for (const q of questions) {
       q.tags = await QuestionTagsRepo.getByQuestionIdAsync(q.id);
   }
   ResponseFilter.setResponseDetails(res, 200, questions.map(q => UtilConverter.questionDbResToJson(q)));
});

module.exports = Router;