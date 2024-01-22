const axios = require("axios");

// function : sending message to the person who want do a transaction

exports.sendMessage = async (req, res) => {
  const url = process.env["send_message_uri"];

  const data = {
    outboundSMSMessageRequest: {
      address: "tel:+225" + req.params.PhoneNumber,
      senderAddress: "tel:+2250000",
      outboundSMSTextMessage: {
        message: req.params.Message,
      },
    },
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + req.token,
  };

  axios
    .post(url, data, { headers })
    .then((response) => {
      console.log("message envoyé...");
      return res
        .status(200)
        .send({ message: "Message envoyé avec succès", Status: "Success", Details: req.encoded });
    })
    .catch((error) => {
      console.log(error);
    });
}