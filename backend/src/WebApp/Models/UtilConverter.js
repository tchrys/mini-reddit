const topicDbResToJson = (topic) => {
    return {id: topic.id, name: topic.name, categoryId: topic.category_id};
}

const answerDbResToJson = (answer) => {
    return {
        id: answer.id,
        text: answer.text,
        questionId: answer.question_id,
        votes: answer.votes,
        answerDate: answer.a_date,
        voted: answer.voted
    };
}

const questionDbResToJson = (question) => {
    return {
        id: question.id,
        text: question.text,
        votes: question.votes,
        topicId: question.topic_id,
        questionDate: question.q_date,
        tags: question.tags,
        voted: question.voted,
        answers: question.answers
    };
}

const improvementReqDbToJson = (improvementReq) => {
    return {
        id: improvementReq.id,
        userId: improvementReq.user_id,
        improvementType: improvementReq.improv_type,
        request: improvementReq.request,
        reqDate:improvementReq.req_date,
        username: improvementReq.username
    };
}

module.exports = {
    topicDbResToJson,
    answerDbResToJson,
    questionDbResToJson,
    improvementReqDbToJson
}