const express = require('express');
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

router.post('/', rejectUnauthenticated, (req, res) => {
    console.log('req.user', req.user)
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
                "user_id"
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
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
        req.user.id
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

module.exports = router;