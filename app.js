const express = require("express");
const bodyParser = require("body-parser");
const routerTest = require("./routes/route")

const app = express();
app.use(express.json());
app.use(bodyParser.json());

//definition du middleware de connexion avec la bd

app.use(express.urlencoded({ extended: false }));

//preferences

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

app.use("/api/test", routerTest);
module.exports = app;