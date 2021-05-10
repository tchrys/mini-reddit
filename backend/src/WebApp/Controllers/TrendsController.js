const express = require('express');

const ServerError = require('../Models/ServerError.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const RoleConstants = require('../Constants/Roles.js');
const ResponseFilter = require('../Filters/ResponseFilter.js');
const UtilConverter = require('../Models/UtilConverter.js');
const googleTrends = require('google-trends-api');
const QuestionTagsRepo = require('../../Infrastructure/PostgreSQL/Repository/QuestionsTagsRepository.js');


const Router = express.Router();

Router.get('/real-time/:key', AuthorizationFilter.authorizeAll(), async (req, res) => {
    // const ll = await googleTrends.autoComplete({keyword: 'Nba'});
    // ResponseFilter.setResponseDetails(res, 200, JSON.parse(ll).default.topics);

    const {key} = req.params;
    const ll = await googleTrends.realTimeTrends({
        geo: 'US',
        category: key,
    });
    ResponseFilter.setResponseDetails(res, 200, JSON.parse(ll).storySummaries.trendingStories
        .map((story) => {
            return {
                article: {
                    articleTitle: story.articles[0].articleTitle,
                    url: story.articles[0].url,
                    source: story.image.imgUrl,
                    time: story.articles[0].time,
                    snippet: story.articles[0].snippet
                }
            };
        }));
});

Router.get('/daily', AuthorizationFilter.authorizeAll(), async (req, res) => {
    const ll = await googleTrends.dailyTrends({trendDate: new Date(), geo: 'US',});
    ResponseFilter.setResponseDetails(res, 200,
        JSON.parse(ll).default.trendingSearchesDays[0].trendingSearches
            .map(value => {
                return {
                    article: {
                        articleTitle: value.articles[0].title,
                        url: value.articles[0].url,
                        source: value.image.imageUrl,
                        time: value.articles[0].timeAgo,
                        snippet: value.articles[0].snippet

                    }
                };
            }
        )
    );
});

Router.get('/interest', AuthorizationFilter.authorizeAll(), async (req, res) => {
    let tags = await QuestionTagsRepo.getTagsByAppearance();
    tags = tags.slice(0, 10);
    result = [];
    let today = new Date();
    let weekBefore = new Date();
    weekBefore.setDate(today.getDate() - 7);
    const reducer = (acc, crtVal) => acc + crtVal;
    for (let tag of tags) {
        let apiAns = await googleTrends.interestOverTime(
            {
                keyword: tag.name,
                startTime: weekBefore,
                endTime: today
            });
        const len = JSON.parse(apiAns).default.timelineData.length;
        apiAns = JSON.parse(apiAns).default.timelineData
            .map((dayRes) => dayRes.value[0])
            .reduce(reducer, 0) / len;
        result.push({id: tag.id, name: tag.name, score: apiAns});
    }
    ResponseFilter.setResponseDetails(res, 200, result);
});


module.exports = Router;