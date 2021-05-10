const express = require('express');

const CategoriesRepository = require('../../Infrastructure/PostgreSQL/Repository/CategoriesRepository.js');
const ServerError = require('../Models/ServerError.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');
const ResponseFilter = require('../Filters/ResponseFilter.js');


const Router = express.Router();

Router.post('/', AuthorizationFilter.authorizeNotUsers(), async (req, res) => {
    const category = await CategoriesRepository.addAsync(req.body.name);
    ResponseFilter.setResponseDetails(res, 201, {...category}, req.originalUrl);
});

Router.get('/', AuthorizationFilter.authorizeAll(), async (req, res) => {
    const categories = await CategoriesRepository.getAllAsync();
    ResponseFilter.setResponseDetails(res, 200, categories.map(category => JSON.parse(JSON.stringify(category))));
});

Router.get('/:id', AuthorizationFilter.authorizeAll(), async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }
    const category = await CategoriesRepository.getByIdAsync(id);
    if (!category) {
        throw new ServerError(`Category with id ${id} does not exist!`, 404);
    }
    ResponseFilter.setResponseDetails(res, 200, {...category});
});

Router.put('/:id', AuthorizationFilter.authorizeNotUsers(), async (req, res) => {
    const category = await CategoriesRepository.updateByIdAsync(parseInt(req.body.id), req.body.name);
    if (!category) {
        throw new ServerError(`Category with id ${id} does not exist!`, 404);
    }
    ResponseFilter.setResponseDetails(res, 200, {...category});
});

Router.delete('/:id', AuthorizationFilter.authorizeNotUsers(), async (req, res) => {
    const { id } = req.params;
    const category = await CategoriesRepository.deleteByIdAsync(parseInt(id));
    if (!category) {
        throw new ServerError(`Category with id ${id} does not exist!`, 404);
    }
    ResponseFilter.setResponseDetails(res, 204, "Entity deleted succesfully");
});

module.exports = Router;