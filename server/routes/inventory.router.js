const express = require('express');
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const pool = require('../modules/pool');

const router = express.Router();

// gets all the cards from the database for a single user
router.get('/', rejectUnauthenticated, (req, res) => {
    const sqlText = `
        SELECT * FROM "inventory"
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

// TODO: not being used investigate later????

// router.get('/:id', rejectUnauthenticated, (req, res) => {
//     const sqlText = `
//         SELECT * FROM "inventory"
//             WHERE "user_id"=$1
//                 AND "scryfall_id"=$2;
//     `;
//     const sqlValues = [
//         req.user.id,
//         req.params.id
//     ]
//     console.log('sqlValues', sqlValues)
//     // the following is not working and i dont know why
//     pool.query(sqlText, [req.user.id, req.params.id])
//         .then((dbRes) => {
//             console.log('dbRes******', dbRes.rows);
//             res.send(dbRes.rows);
//         })
//         .catch((dbErr) => {
//             console.error('get db error', dbErr);
//             res.sendStatus(500);
//         })
// });

// adds a new card to the inventory in a paired down way
router.post('/', rejectUnauthenticated, (req, res) => {
    const card = req.body;
    const sqlText = `
        INSERT INTO "inventory" 
            (
                "img_url",
                "img_back_url",
                "name", 
                "toughness",
                "toughness_back",
                "power",
                "power_back",
                "cmc", 
                "set",
                "color_identity",
                "type_line",
                "legality",
                "user_id",
                "scryfall_id"
            )
            VALUES 
                (
                    $1, $2, $3, 
                    $4, $5, $6, 
                    $7, $8, $9, 
                    $10, $11, 
                    $12, $13, $14
                )
    `;
    const sqlValues = [
        card.img_url,
        card.img_back_url,
        card.name,
        card.toughness,
        card.toughness_back,
        card.power,
        card.power_back,
        card.cmc,
        card.set,
        card.color_identity,
        card.type_line,
        card.legality,
        req.user.id,
        card.scryfall_id
    ]
    pool.query(sqlText, sqlValues)
        .then((dbRes) => {
            res.sendStatus(201);
        })
        .catch((dbErr) => {
            console.error('post db error', dbErr);
            res.sendStatus(500);
        })
})

// updates the inventory card with the new deck id
router.put('/', rejectUnauthenticated, (req, res) => {
    const sqlText = `
        UPDATE "inventory"
            SET "deck_id"=$1
            WHERE "user_id"=$2
                AND "id"=$3
    `;
    const sqlValues = [
        req.body.deck_id,
        req.user.id,
        req.body.card_id
    ]
    pool.query(sqlText, sqlValues)
        .then((dbRes) => {
            res.sendStatus(201);
        })
        .catch((dbErr) => {
            console.error('inventory put db error', dbErr)
            res.sendStatus(500);
        })
})

// updates the inventory card with NULL as the deck id when the card is removed from the deck in deckView
router.put('/deleteDeckId', rejectUnauthenticated, (req, res) => {
    const sqlText = `
        UPDATE "inventory"
            SET "deck_id"=NULL
            WHERE "user_id"=$1
                AND "id"=$2
    `;
    const sqlValues = [
        req.user.id,
        req.body.card_id
    ]
    pool.query(sqlText, sqlValues)
        .then((dbRes) => {
            res.sendStatus(201);
        })
        .catch((dbErr) => {
            console.error('inventory put db error', dbErr)
            res.sendStatus(500);
        })
})

// deletes the inventory card from the DB
router.delete('/', rejectUnauthenticated, (req, res) => {
    const cardToDelete = req.body.id
    const sqlText = `
        DELETE FROM "inventory"
	        WHERE "id"=$1;
    `;
    pool.query(sqlText, [cardToDelete])
        .then((dbRes) => {
            res.send(dbRes.rows);
        })
        .catch((dbErr) => {
            console.error('get db error', dbErr);
            res.sendStatus(500);
        })
});

module.exports = router;