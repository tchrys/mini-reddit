const express = require('express');
const ImprovRep = require('../../Infrastructure/PostgreSQL/Repository/ImprovementRepository.js');
const ServerError = require('../Models/ServerError.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');
const ResponseFilter = require('../Filters/ResponseFilter.js');
const UtilConverter = require('../Models/UtilConverter.js');

const Router = express.Router();

Router.post('/', AuthorizationFilter.authorizeAll(), async (req, res) => {
    const improv = await ImprovRep.addAsync(parseInt(req.user.userId), req.body.improvementType, req.body.request);
    ResponseFilter.setResponseDetails(res, 201, UtilConverter.improvementReqDbToJson(improv), req.originalUrl);
});

Router.get('/', AuthorizationFilter.authorizeAll(), async (req, res) => {
    const improvs = await ImprovRep.getAllAsync();
    ResponseFilter.setResponseDetails(res, 200, improvs.map(improv => UtilConverter.improvementReqDbToJson(improv)));
});

Router.get('/:id', AuthorizationFilter.authorizeAll(), async (req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }
    const improv = await ImprovRep.getByIdAsync(id);
    if (!improv) {
        throw new ServerError(`Improvement with id ${id} does not exist!`, 404);
    }
    ResponseFilter.setResponseDetails(res, 200, UtilConverter.improvementReqDbToJson(improv));
});

Router.delete('/:id', AuthorizationFilter.authorizeNotUsers(), async (req, res) => {
    const { id } = req.params;
    const improv = await ImprovRep.deleteByIdAsync(parseInt(id));
    if (!improv) {
        throw new ServerError(`Improvement with id ${id} does not exist!`, 404);
    }
    ResponseFilter.setResponseDetails(res, 204, "Entity deleted succesfully");
});

module.exports = Router;