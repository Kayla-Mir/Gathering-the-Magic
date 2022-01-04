const express = require('express');
const axios = require('axios');
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
    // Send back user object from the session (previously queried from the database)
    const sqlText = `
        SELECT * FROM "user_decks"
	        WHERE "user_id"=$1;
    `;
    pool.query(sqlText, [req.user.id])
        .then((dbRes) => {
            res.send(dbRes.rows);
        })
        .catch((dbErr) => {
            console.error('get db error', dbErr);
            res.sendStatus(500);
        })
});

const queryObject = {
    "identifiers": []
}
const buildCardObject = (cardName) => {
    const cardObject = { name: cardName };
    queryObject.identifiers.push(cardObject);
}

// Handles Ajax request for user information if user is authenticated
router.get('/:id', rejectUnauthenticated, (req, res) => {
    // Send back user object from the session (previously queried from the database)
    const sqlText = `
        SELECT * FROM "user_deck_test"
	        WHERE "user_id"=$1
            AND "id"=$2;
    `;
    pool.query(sqlText, [req.user.id, req.params.id])
        .then((dbRes) => {
            dbRes.rows[0].deck_contents.map((item) => buildCardObject(item));
            axios({
                method: 'POST',
                url: `https://api.scryfall.com/cards/collection`,
                data: queryObject
            }).then((apiRes) => {
                console.log('API response', apiRes.data)
                res.send({
                    ...dbRes.rows[0],
                    deck_contents: apiRes.data
                })
            }).catch((apiErr) => {
                console.error('GET api error', apiErr);
            })
        })
        .catch((dbErr) => {
            console.error('get db error', dbErr);
            res.sendStatus(500);
        })
});

// router.post('/', rejectUnauthenticated, (req, res) => {
//     console.log('req.user', req.user)
//     const card = req.body;
//     const sqlText = `
//         INSERT INTO "inventory" 
//             (
//                 "img_url",
//                 "img_back_url",
//                 "name", 
//                 "toughness",
//                 "toughness_back",
//                 "power",
//                 "power_back",
//                 "cmc", 
//                 "set",
//                 "color_identity",
//                 "type_line",
//                 "legality",
//                 "user_id"
//             )
//             VALUES 
//                 (
//                     $1, $2, $3, 
//                     $4, $5, $6, 
//                     $7, $8, $9, 
//                     $10, $11, 
//                     $12, $13
//                 )
//     `;
//     const sqlValues = [
//         card.img_url,
//         card.img_back_url,
//         card.name,
//         card.toughness,
//         card.toughness_back,
//         card.power,
//         card.power_back,
//         card.cmc,
//         card.set,
//         card.color_identity,
//         card.type_line,
//         card.legality,
//         req.user.id
//     ]
//     pool.query(sqlText, sqlValues)
//         .then((dbRes) => {
//             res.sendStatus(201);
//         })
//         .catch((dbErr) => {
//             console.error('post db error', dbErr);
//             res.sendStatus(500);
//         })
// })

// router.delete('/', rejectUnauthenticated, (req, res) => {
//     const cardToDelete = req.body.id
//     const sqlText = `
//         DELETE FROM "inventory"
// 	        WHERE "id"=$1;
//     `;
//     pool.query(sqlText, [cardToDelete])
//         .then((dbRes) => {
//             res.send(dbRes.rows);
//         })
//         .catch((dbErr) => {
//             console.error('get db error', dbErr);
//             res.sendStatus(500);
//         })
// });

module.exports = router;