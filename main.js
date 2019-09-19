const express = require("express");
const cheerio = require('cheerio'); // Basically jQuery for node.js
const rp = require("request-promise");
const app = express();

app.use(express.static(__dirname));

app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("home");
});

app.listen("80", function(err) {
    if (err) throw err;
});