const express = require("express");
const cheerio = require('cheerio'); // Basically jQuery for node.js
const rp = require("request-promise");
const bodyParser = require("body-parser");
const utils = require("./js/utils.js");
const app = express();

/**
 * Declaration of Variables
 */
const lotteryTypesName = [
    "6/58 Ultra Lotto",
    "6/55 Grand Lotto",
    "6/49 Super Lotto",
    "6/45 Super Lotto",
    "6/42 Lotto",
    "6-Digit Lotto",
    "4-Digit Lotto",
    "Swertres Lotto",
    "EZ2 Lotto",
    "STL Pares",
    "STL Swer3",
    "STL 2-Digit"
];

const lotteryTypesURL = [
    "https://philnews.ph/pcso-lotto-result/pcso-lotto-result-ultralotto-6-58-draw/",
    "https://philnews.ph/pcso-lotto-result/pcso-lotto-result-grand-lotto-6-55-draw/",
    "https://philnews.ph/pcso-lotto-result/pcso-lotto-result-superlotto-6-49-draw/",
    "https://philnews.ph/pcso-lotto-result/pcso-lotto-result-megalotto-6-45-draw/",
    "https://philnews.ph/pcso-lotto-result/pcso-lotto-result-lotto-6-42-daily-draw-updates/",
    "https://philnews.ph/pcso-lotto-result/pcso-lotto-result-6-digit-lotto-daily-draw-updates/",
    "https://philnews.ph/pcso-lotto-result/pcso-lotto-result-4-digit-lotto-daily-draw-updates/",
    "https://philnews.ph/pcso-lotto-result/pcso-swertres-lotto-result-daily-draw-updates/",
    "https://philnews.ph/pcso-lotto-result/pcso-lotto-result-ez2-daily-draw-updates/",
    "https://philnews.ph/2018/09/10/pcso-stl-pares-result-history/",
    "https://philnews.ph/2018/09/10/pcso-stl-swer3-result-history/",
    "https://philnews.ph/2018/09/10/pcso-stl-2-digit-result-history/"
];

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("home", {
        lotteryTypesName: lotteryTypesName
    });
});

app.post("/", function(req, res) {
    let type = req.body.type,
        numbers = req.body.lotteryNumbers.split("-");
    
    const options = {
        uri: lotteryTypesURL[type],
        transform: function(body) {
            return cheerio.load(body);
        }
    };

    rp(options).then(($) => {
        let drawResultsElements = $("h4"),
            results = [];

        for (let i = 0, drawResultsElementsLength = drawResultsElements.length - 1; i < drawResultsElementsLength; i++) {
            let result = drawResultsElements.eq(i).text().split(":"),
                resultObject = {
                    drawDate: result[0].replace("Draw", "").trim(),
                    numbers: result[1].trim(),
                    match: [],
                    winning: false
                };
            
            resultObject.numbers.split("-").forEach((number) => {
                if (numbers.includes(number)) {
                    resultObject.match.push(number);
                }

                if (resultObject.match.length >= 3) {
                    resultObject.winning = true;
                }
            });

            results.push(resultObject);
        }

        res.render("results", {
            type: lotteryTypesName[type],
            results: results
        });

    }).catch((err) => {
        if (err) throw err;
    })
});

app.listen("80", function(err) {
    if (err) throw err;
});

