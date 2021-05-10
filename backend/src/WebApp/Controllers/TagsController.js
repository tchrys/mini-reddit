const express = require('express');
const TagsRepo = require('../../Infrastructure/PostgreSQL/Repository/TagsRepository.js');
const QuestionTagsRepo = require('../../Infrastructure/PostgreSQL/Repository/QuestionsTagsRepository.js');
const ServerError = require('../Models/ServerError.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');
const ResponseFilter = require('../Filters/ResponseFilter.js');
const UtilConverter = require('../Models/UtilConverter.js');

const Router = express.Router();

// Router.post('/', AuthorizationFilter.authorizeAll(), async (req, res) => {
//     const tag = await TagsRepo.addAsync(req.body.name);
//     ResponseFilter.setResponseDetails(res, 201, tag, req.originalUrl);
// });

Router.get('/', AuthorizationFilter.authorizeAll(), async (req, res) => {
    const tags = await TagsRepo.getAllAsync();
    ResponseFilter.setResponseDetails(res, 200, tags);
});

Router.get('/contains', AuthorizationFilter.authorizeAll(), async (req, res) => {
    let search = req.query.search;
    const tags = await TagsRepo.getByNameContains(search);
    ResponseFilter.setResponseDetails(res, 200, tags);
});

Router.get('/match', AuthorizationFilter.authorizeAll(), async (req, res) => {
   let search = req.query.search;
   const tag = await TagsRepo.getByName(search);
   ResponseFilter.setResponseDetails(res, 200, tag);
});

// Router.get('/:id', AuthorizationFilter.authorizeAll(), async (req, res) => {
//     let { id } = req.params;
//     id = parseInt(id);
//     if (!id || id < 1) {
//         throw new ServerError("Id should be a positive integer", 400);
//     }
//     const tag = await TagsRepo.getByIdAsync(id);
//     if (!tag) {
//         throw new ServerError(`Tag with id ${id} does not exist!`, 404);
//     }
//     ResponseFilter.setResponseDetails(res, 200, tag);
// });

Router.delete('/:id', AuthorizationFilter.authorizeAll(), async (req, res) => {
    const { id } = req.params;
    const tag = await TagsRepo.deleteByIdAsync(parseInt(id));
    if (!tag) {
        throw new ServerError(`Tag with id ${id} does not exist!`, 404);
    }
    ResponseFilter.setResponseDetails(res, 204, "Entity deleted succesfully");
});

Router.get('/question/:id', AuthorizationFilter.authorizeAll(), async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    const tags = await QuestionTagsRepo.getByQuestionIdAsync(id);
    if (!tags) {
        throw new ServerError(`Question with id ${id} does not exist!`, 404);
    }
    ResponseFilter.setResponseDetails(res, 200, tags);
});

Router.get('/appearances', AuthorizationFilter.authorizeAll(), async (req, res) => {
   const tags = await QuestionTagsRepo.getTagsByAppearance();
   ResponseFilter.setResponseDetails(res, 200, tags);
});


module.exports = Router;