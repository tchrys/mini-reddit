const express = require('express');
const TopicsRepository = require('../../Infrastructure/PostgreSQL/Repository/TopicsRepository.js');
const ServerError = require('../Models/ServerError.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');
const ResponseFilter = require('../Filters/ResponseFilter.js');
const UtilConverter = require('../Models/UtilConverter.js');

const Router = express.Router();

Router.post('/', AuthorizationFilter.authorizeNotUsers(), async (req, res) => {
    const topic = await TopicsRepository.addAsync(req.body.name, parseInt(req.body.categoryId));
    ResponseFilter.setResponseDetails(res, 201, UtilConverter.topicDbResToJson(topic), req.originalUrl);
});

Router.get('/', AuthorizationFilter.authorizeAll(), async (req, res) => {
    const topics = await TopicsRepository.getAllAsync();
    ResponseFilter.setResponseDetails(res, 200, topics.map(topic => UtilConverter.topicDbResToJson(topic)));
});

Router.get('/popularity', AuthorizationFilter.authorizeAll(), async (req, res) => {
   const ans = await TopicsRepository.getPopularTopics();
   ResponseFilter.setResponseDetails(res, 200, ans);
});

Router.get('/:id', AuthorizationFilter.authorizeAll(), async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }
    const topic = await TopicsRepository.getByIdAsync(id);
    if (!topic) {
        throw new ServerError(`Topic with id ${id} does not exist!`, 404);
    }
    ResponseFilter.setResponseDetails(res, 200, UtilConverter.topicDbResToJson(topic));
});

Router.put('/:id', AuthorizationFilter.authorizeNotUsers(), async (req, res) => {
    const topic = await TopicsRepository.updateByIdAsync(parseInt(req.body.id), req.body.name);
    if (!topic) {
        throw new ServerError(`Topic with id ${id} does not exist!`, 404);
    }
    ResponseFilter.setResponseDetails(res, 200, UtilConverter.topicDbResToJson(topic));
});

Router.delete('/:id', AuthorizationFilter.authorizeNotUsers(), async (req, res) => {
    const { id } = req.params;
    const topic = await TopicsRepository.deleteByIdAsync(parseInt(id));
    if (!topic) {
        throw new ServerError(`Topic with id ${id} does not exist!`, 404);
    }
    ResponseFilter.setResponseDetails(res, 204, "Entity deleted succesfully");
});

Router.get('/category/:id', AuthorizationFilter.authorizeAll(), async(req, res) => {
   const { id } = req.params;
   const topics = await TopicsRepository.getAllByCategoryId(parseInt(id));
   if (!topics) {
       throw new ServerError(`Category with id ${id} does not exist!`, 404);
   }
   ResponseFilter.setResponseDetails(res, 200, topics.map(value => UtilConverter.topicDbResToJson(value)));
});

module.exports = Router;