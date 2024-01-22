const Card = require("../lib/prisma.js").card

// create card

exports.createCard = async (req, res) => {
    try {
        console.log("creating card...")
        const { card_number, card_validity, card_cvv, userId } = req.body;
        console.log(req.body);

        if (!card_number || !card_validity || !card_cvv || !userId) {
            return res.status(400).json({
                status: false,
                data: {
                    message: "All mandatory fields must be completed."
                }
            });
        }

        card = await Card.create({
            data: {
                card_number: card_number,
                card_validity: card_validity,
                card_cvv: card_cvv,
                userId: userId,
            }
        })

        console.log("Card created !")
        res.status(201).json({ status: true, data: { message: "card created with success !" } })

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, data: { message: error.message } })
    }
}

// lock card

exports.stateCard = async (req, res, next) => {
    try {
        const { isLock, id_card } = req.body;
        isLock == true ? console.log("locking card...") : console.log("unlocking card...")

        if (isLock == undefined || !id_card) {
            return res.status(400).json({
                status: false,
                data: {
                    message: "All mandatory fields must be completed."
                }
            });
        }

        await Card.update({
            where: {
                id_card: id_card,
            },
            data: {
                isLock: isLock,
            }
        });

        isLock == true ? console.log("Card locked...") : console.log("Card unlocked...")
        return res.status(200).json({ status: true, data: { message: isLock == true ? "Card succesfully locked" : "Card succesfully unlocked" } });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, data: { message: error.message } })
    }
}

// add money to card

exports.accountOperation = async (req, res) => {
    try {
        const { senderCardNumber, reciverdcardNumber, amount } = req.body;
        console.log("ongoing operation...")

        if (!senderCardNumber || !reciverdcardNumber || !amount) {
            return res.status(400).json({
                status: false,
                data: {
                    message: "All mandatory fields must be completed."
                }
            });
        }

        senderCard = await Card.findFirst({
            where: {
                card_number: senderCardNumber,
            }
        });

        receiverCard = await Card.findFirst({
            where: {
                card_number: reciverdcardNumber,
            }
        });

        if (!receiverCard) {
            return res.status(400).json({ status: false, data: { message: "Ce compte n'existe pas" } });
        } else if (senderCard.isLock) {
            return res.status(400).json({ status: false, data: { message: "Ce compte est bloqué" } });
        } else if (receiverCard.isLock) {
            return res.status(400).json({ status: false, data: { message: "Le compte du receveur est bloqué" } });
        } else if (senderCard.amount < amount) {
            return res.status(400).json({ status: false, data: { message: "Le solde présent sur le compte est insuffisant" } })
        } else {
            await Card.update({
                where: {
                    id_card: senderCard.id_card,
                },
                data: {
                    amount: senderCard.amount - amount,
                }
            });

            await Card.update({
                where: {
                    id_card: receiverCard.id_card,
                },
                data: {
                    amount: receiverCard.amount + amount,
                }
            });

            return res.status(200).json({ status: true, data: { message: "Operation done..." } });
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, data: { message: error.message } })
    }
}

// make a deposit

exports.depositOnAccount = async (req, res) => {
    try {
        const { reciverdcardNumber, amount } = req.body;
        console.log("ongoing operation...")
        console.log(amount == undefined);

        if (!reciverdcardNumber || !amount) {
            return res.status(400).json({
                status: false,
                data: {
                    message: "All mandatory fields must be completed."
                }
            });
        }

        receiverCard = await Card.findFirst({
            where: {
                card_number: reciverdcardNumber,
            }
        });

        if (!receiverCard) {
            return res.status(400).json({ status: false, data: { message: "Ce compte n'existe pas" } });
        } else if (receiverCard.isLock) {
            return res.status(400).json({ status: false, data: { message: "Ce compte est bloqué" } });
        } else {
            await Card.update({
                where: {
                    id_card: receiverCard.id_card,
                },
                data: {
                    amount: receiverCard.amount + amount,
                }
            });

            return res.status(200).json({ status: true, data: { message: "Operation done..." } });
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, data: { message: error.message } })
    }
}

// withdraw money

exports.withDrawOnAccount = async (req, res) => {
    try {
        const { reciverdcardNumber, amount } = req.body;
        console.log("ongoing operation...")

        if (!reciverdcardNumber || !amount) {
            return res.status(400).json({
                status: false,
                data: {
                    message: "All mandatory fields must be completed."
                }
            });
        }

        receiverCard = await Card.findFirst({
            where: {
                card_number: reciverdcardNumber,
            }
        });

        if (!receiverCard) {
            return res.status(400).json({ status: false, data: { message: "Ce compte n'existe pas" } });
        } else if (receiverCard.isLock) {
            return res.status(400).json({ status: false, data: { message: "Ce compte est bloqué" } });
        } else if (receiverCard.amount < amount) {
            return res.status(400).json({ status: false, data: { message: "Le montant du compte est insufisant" } });
        } else {
            await Card.update({
                where: {
                    id_card: receiverCard.id_card,
                },
                data: {
                    amount: receiverCard.amount - amount,
                }
            });

            return res.status(200).json({ status: true, data: { message: "Operation done..." } });
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, data: { message: error.message } })
    }
}