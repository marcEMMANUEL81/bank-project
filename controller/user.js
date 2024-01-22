const User = require("../lib/prisma.js").user

// create user

exports.createUser = async (req, res) => {
    try {
        console.log("creating user...")
        const { lastname, firstname, phone_number, password } = req.body;

        if (!lastname || !firstname || !phone_number || !password) {
            return res.status(400).json({
                status: false,
                data: {
                    message: "All mandatory fields must be completed."
                }
            });
        }

        var user = await User.create({
            data: {
                lastname: lastname,
                firstname: firstname,
                phone_number: phone_number,
                password: password
            }
        })

        user = await User.findFirst({
            where: {
                id: user.id
            },
            select: {
                id_user: true,
                firstname: true,
                lastname: true,
                phone_number: true,
                password: true,
            }
        })

        console.log("Signed Up")
        res.status(201).json({ status: true, data: user })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message })
    }
}

// log in -- se connecter

exports.logIn = async (req, res) => {
    try {
        console.log("log in ...")
        const { phone_number, password } = req.body;

        if (!phone_number || !password) {
            return res.status(400).json({
                status: false,
                data: {
                    message: "All mandatory fields must be completed."
                }
            });
        }

        var user = await User.findFirst({
            where: {
                phone_number: phone_number,
                password: password
            },
            select: {
                id_user: true,
                firstname: true,
                lastname: true,
                phone_number: true,
                password: false,
            }
        })

        if (user) {
            res.status(201).json({ status: true, data: user })
        } else {
            res.status(400).json({ status: false, data: { message: "Un des chmaps est incorrect" } })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, error: error.message })
    }
}

// get all cards 

exports.getAllCards = async (req, res) => {
    try {
        console.log("log in ...")
        const { id_user } = req.body;

        if (!id_user) {
            return res.status(400).json({
                status: false,
                data: {
                    message: "All mandatory fields must be completed."
                }
            });
        }

        const userCards = await User.findMany({
            where: { id_user: id_user },
            select: {
                cards: true,
            },
        });

        if (userCards) {
            res.status(201).json({ status: true, data: userCards })
        } else {
            res.status(400).json({ status: false, data: { message: "l'utilisateur n'a pas de carte" } })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, error: error.message })
    }
}