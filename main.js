const express = require("express");
const cheerio = require('cheerio'); // Basically jQuery for node.js
const rp = require("request-promise");
const app = express();

app.use(express.static(__dirname));

app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("home");
});

app.post("/api/get_results/:type/", function(req, res) {
    let type = req.params.type;
});

app.listen("80", function(err) {
    if (err) throw err;
});