const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';

const botInfo = {
    token: "bot1532789842:AAGBBaRy--GeFoKhthkFgXCCzVEtzz9xx2g"
}

const articles = {

    "status": "ok",
    "totalResults": 11462,
    "articles": [
        {
            "source": {
                "id": "bbc-news",
                "name": "BBC News"
            },
            "author": "https://www.facebook.com/bbcnews",
            "title": "Storm Filomena: Spain sees 'exceptional' snowfall",
            "description": "More than half the country is on red alert with more snow expected to fall on Saturday.",
            "url": "https://www.bbc.co.uk/news/world-europe-55586751",
            "urlToImage": "https://ichef.bbci.co.uk/news/1024/branded_news/0546/production/_116405310_hi065113789.jpg",
            "publishedAt": "2021-01-09T08:14:51Z",
            "content": "Storm Filomena has blanketed parts of Spain in heavy snow, with half of the country on red alert for more on Saturday. \r\nMadrid, one of the worst affected areas, is set to see up to 20cm (eight inche… [+1189 chars]"
        }]
}

let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context) => {
    try {
        // const ret = await axios(url);
        //let news = await findNews()
        let formatedNews = formatNews(articles.articles)
        try{
            await sendChatMessage(1415671867, formatedNews)
        }
        catch (err){
            console.log(err.response)
        }
        response = {
            'statusCode': 200,
            'body': "asdjksdafjkfsdajksafd"
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};


async function findNews(){
    let url = "https://newsapi.org/v2/everything?q=spain"
    let token = "4ad1c1ebe9f544a180c0dbcd34ded6e0"

    let req = {
        url: url,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }

    return await axios(req)
}

function formatNews(news){
    let message = ""
    
    news.forEach(article => {
        message += `${article.title}`
    })
    return message
}

async function sendChatMessage(chatId, message){
    let token = botInfo["token"]
    let telegramUrl=`https://api.telegram.org/${token}/sendMessage`
    let jsonBody = {
        chat_id: chatId,
        text: message
    }

    let req = {
        url: telegramUrl,
        data: JSON.stringify(jsonBody),
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }

    return await axios(req)
}
