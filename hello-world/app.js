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
        },
        {
            "source": {
                "id": null,
                "name": "New York Times"
            },
            "author": "Katherine Rosman",
            "title": "Hilaria Baldwin Talks Spain, Boston, Alec and Instagram",
            "description": "Accused of a “decade long grift where she impersonates a Spanish person,” the entrepreneur (and spouse of Alec Baldwin) talks about being the main character in this last week of 2020.",
            "url": "https://www.nytimes.com/2020/12/30/style/hilaria-baldwin-interview.html",
            "urlToImage": "https://static01.nyt.com/images/2020/12/29/fashion/29HILARIA/29HILARIA-facebookJumbo.jpg",
            "publishedAt": "2020-12-30T10:00:40Z",
            "content": "Ms. Baldwin first visited Spain with her parents when she was a baby, she said, and she went at least yearly thereafter. She declined to explain in detail how frequently they traveled there or how lo… [+1529 chars]"
        },
        {
            "source": {
                "id": "bbc-news",
                "name": "BBC News"
            },
            "author": "https://www.facebook.com/bbcnews",
            "title": "Spain housing: Evictions and broken promises in a pandemic",
            "description": "Spain's prime minister promised nobody would be evicted during the pandemic but activists say thousands have.",
            "url": "https://www.bbc.co.uk/news/55231201",
            "urlToImage": "https://ichef.bbci.co.uk/news/1024/branded_news/15AB6/production/_115985788_photo1.jpg",
            "publishedAt": "2020-12-14T00:12:00Z",
            "content": "By Tim SmithBarcelona\r\nimage captionCecilia's family have been sent an eviction notice and fear what may happen next\r\nEvictions are an unwelcome fact of life in Ciutat Meridiana, one of Barcelona's p… [+5878 chars]"
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
        console.log(event.body || "No body provided")
        const body = JSON.parse(event.body)
        let {text, chat} = body.message
        // const ret = await axios(url);
        try{
            if (text === "/noticias"){
                let news = await findNews()
                // 1415671867
                let formatedNews = formatNews(news.data.articles)
                await sendChatMessage(chat.id, formatedNews)
            }
        }
        catch (err){
            console.log(err.response)
        }
        response = {
            'statusCode': 200,
            'body': "asdjksdafjkfsdajksafd\n"
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
        message += `<strong>Title: </strong>${article.title}\n`
        message += `<a href="${article.url}">Article link</a>\n`
    })
    return message
}

async function sendChatMessage(chatId, message){
    let token = botInfo["token"]
    let telegramUrl=`https://api.telegram.org/${token}/sendMessage`
    let jsonBody = {
        chat_id: chatId,
        text: message,
        parse_mode: "HTML"
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
