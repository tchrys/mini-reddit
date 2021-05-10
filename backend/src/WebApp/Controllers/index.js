const Router = require('express')();

const CategoriesController = require('./CategoriesController.js');
const UsersController = require('./UsersController.js');
const RolesController = require('./RolesControllers');
const TopicsController = require('./TopicsController.js');
const AnswersController = require('./AnswersController.js');
const VotesController = require('./VotesController.js');
const QuestionsController = require('./QuestionsController.js');
const ImprovementController = require('./ImprovementController');
const TrendsController = require('./TrendsController.js');
const TagsController = require('./TagsController');
const { authorizeAndExtractTokenAsync } = require('../Filters/JWTFilter.js');

Router.use('/categories', authorizeAndExtractTokenAsync, CategoriesController);
Router.use('/topics', authorizeAndExtractTokenAsync, TopicsController);
Router.use('/questions', authorizeAndExtractTokenAsync, QuestionsController);
Router.use('/answers', authorizeAndExtractTokenAsync, AnswersController);
Router.use('/votes', authorizeAndExtractTokenAsync, VotesController);
Router.use('/tags', authorizeAndExtractTokenAsync, TagsController);
Router.use('/improvements', authorizeAndExtractTokenAsync, ImprovementController);
Router.use('/roles', authorizeAndExtractTokenAsync, RolesController);
Router.use('/trends', authorizeAndExtractTokenAsync, TrendsController);
Router.use('/users', UsersController);

module.exports = Router;