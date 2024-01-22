const OTP = require("../lib/prisma.js").otp
const { encode, decode } = require("../middleware/crypt.js");
const authController = require("./authentification")

exports.sendOtpToPhone = async (req, res, next) => {
    try {
        const { phone_number, type } = req.body;

        let phone_message;

        if (!phone_number) {
            const response = {
                Status: "Failure",
                Details: "Phone Number not provided",
            };
            return res.status(400).send(response);
        }
        if (!type) {
            const response = { Status: "Failure", Details: "Type not provided" };
            return res.status(400).send(response);
        }

        //Generate OTP
        const randomNumber = Math.round(Math.random() * 1000000);
        const otp = ("000000" + randomNumber).slice(-6);
        const now = new Date();
        const expiration_time = AddMinutesToDate(now, 10);

        // Create OTP instance in DB
        var otp_instance = await OTP.create({
            data: {
                otp: otp,
                expiration_time: expiration_time
            }
        })

        // Create details object containing the phone number and otp id
        var details = {
            "timestamp": now,
            "check": phone_number,
            "success": true,
            "message": "OTP sent to user",
            "otp_id": otp_instance.id
        }

        // Encrypt the details object
        const encoded = await encode(JSON.stringify(details));

        //Choose message template according type requested
        if (type) {
            if (type == "VERIFICATION") {
                const message = require("../templates/sms/phone_verification");
                phone_message = message(otp);
            } else if (type == "FORGET") {
                const message = require("../templates/sms/phone_forget");
                phone_message = message(otp);
            } else if (type == "2FA") {
                const message = require("../templates/sms/phone_2FA");
                phone_message = message(otp);
            } else {
                const response = {
                    Status: "Failure",
                    Details: "Incorrect Type Provided",
                };
                return res.status(400).send(response);
            }
        }

        // Settings Params for SMS
        var params = {
            Message: phone_message,
            PhoneNumber: phone_number,
        };

        //Send response back to the client if the message is sent
        authController.getAuthenticate(params, encoded, res);
    } catch (err) {
        const response = { Status: "Failure", Details: err.message };
        return res.status(400).send(response);
    }
};

function AddMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}