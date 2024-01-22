const sendMessageController = require("./sendMessage")
const axios = require("axios");

// Get Authenticate For Orange SMS API service

exports.getAuthenticate = (params, encoded, res) => {
    const url = process.env["auth_api_orange"];

    const data = {
        grant_type: "client_credentials",
    };

    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic OFFSM2wzWVRTODdnTXVEMnIxMXc5alRodVYzY3VoQVM6Vk5xTVVicjM3U2pyZlRQcw==",
    };

    axios
        .post(url, data, { headers })
        .then((response) => {
            const token = response.data["access_token"];
            const req = { token: token, params: params, encoded: encoded };
            sendMessageController.sendMessage(req, res);
        })
        .catch((error) => {
            return res.status(400).send({ Status: "Failure", Details: error });
        });
}