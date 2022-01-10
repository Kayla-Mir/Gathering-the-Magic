const express = require('express');
const axios = require('axios');
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// get all user decks based on user_id
router.get('/', rejectUnauthenticated, (req, res) => {
    const sqlText = `
        SELECT * FROM "user_decks"
	        WHERE "user_id"=$1;
    `;
    pool.query(sqlText, [req.user.id])
        .then((dbRes) => {
            console.log('dbRes********', dbRes.rows);

            res.send(dbRes.rows);
        })
        .catch((dbErr) => {
            console.error('get db error', dbErr);
            res.sendStatus(500);
        })
});

// object builder for get by id
let queryObject = {
    "identifiers": []
}
//function to build above query
const buildCardObject = (cardId) => {
    const cardObject = { id: cardId };
    queryObject.identifiers.push(cardObject);
}

// get single deck based on its id
router.get('/:id', rejectUnauthenticated, (req, res) => {
    const sqlText = `
        SELECT * FROM "user_decks"
	        WHERE "user_id"=$1
                AND "id"=$2;
    `;
    pool.query(sqlText, [req.user.id, req.params.id])
        .then((dbRes) => {
            // sends an axios request with the ids of the cards from the DB
            if (dbRes.rows[0].deck_contents != null && dbRes.rows[0].deck_contents.length != 0) {
                dbRes.rows[0].deck_contents.map((item) => buildCardObject(item));
                axios({
                    method: 'POST',
                    url: `https://api.scryfall.com/cards/collection`,
                    data: queryObject
                }).then((apiRes) => {
                    queryObject = {
                        "identifiers": []
                    }
                    res.send({
                        ...dbRes.rows[0],
                        deck_contents: apiRes.data
                    });
                }).catch((apiErr) => {
                    console.error('GET api error', apiErr);
                });
            } else {
                res.send(dbRes.rows[0]);
            }
        })
        .catch((dbErr) => {
            console.error('get db error', dbErr);
            res.sendStatus(500);
        });
});

router.get('/commander/:id', rejectUnauthenticated, (req, res) => {
    const sqlText = `
        SELECT * FROM "user_decks"
	        WHERE "user_id"=$1
                AND "id"=$2;
    `;
    pool.query(sqlText, [req.user.id, req.params.id])
        .then((dbRes) => {
            const cardName = dbRes.rows[0].commander.replace(/ /g, "+");
            console.log('cardName fixed', cardName);
            // sends an axios request with the ids of the cards from the DB
            if (dbRes.rows[0].commander != null) {
                axios({
                    method: 'GET',
                    url: `https://api.scryfall.com/cards/named?exact=${cardName}`
                }).then((apiRes) => {
                    console.log('apiRes', apiRes.data)
                    res.send(apiRes.data);
                }).catch((apiErr) => {
                    console.error('GET api error', apiErr);
                });
            } else {
                res.send(dbRes.rows[0]);
            }
        })
        .catch((dbErr) => {
            console.error('get db error', dbErr);
            res.sendStatus(500);
        });
});

router.post('/', rejectUnauthenticated, (req, res) => {
    const cardPlaceholder = 'filler-card.png'
    const sqlText = `
        INSERT INTO "user_decks" ( "user_id", "deck_name", "deck_img" )
            VALUES ( $1, $2, $3 )
    `;
    const sqlValues = [
        req.user.id,
        req.body.deck_name,
        cardPlaceholder
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

router.put('/contents', rejectUnauthenticated, (req, res) => {
    const sqlText = `
        UPDATE "user_decks"
            SET "deck_contents" = array_append("deck_contents", $1)
            WHERE "user_id"=$2
                AND "id"=$3;
    `;
    const sqlValues = [
        req.body.cardToAdd.id,
        req.user.id,
        req.body.deck_id
    ]
    pool.query(sqlText, sqlValues)
        .then((dbRes) => {
            const newQuery = `
                SELECT "id" FROM "user_decks"
                    WHERE "user_id"=$1
                        AND "id"=$2
            `;
            const newValues = [
                req.user.id,
                req.body.deck_id
            ]
            pool.query(newQuery, newValues)
                .then((dbRes) => {
                    res.send(dbRes.rows[0])
                })
                .catch((dbErr) => {
                    console.error('2nd put contents db error', dbErr);
                    res.sendStatus(500);
                })
        })
        .catch((dbErr) => {
            console.error('put contents db error', dbErr);
            res.sendStatus(500);
        })
})

router.put('/name', rejectUnauthenticated, (req, res) => {
    const sqlText = `
        UPDATE "user_decks"
            SET "deck_name"=$1
            WHERE "user_id"=$2
                AND "id"=$3;
    `;
    const sqlValues = [
        req.body.deck_name,
        req.user.id,
        req.body.deck_id
    ]
    pool.query(sqlText, sqlValues)
        .then((dbRes) => {
            const newQuery = `
                SELECT "id" FROM "user_decks"
                    WHERE "user_id"=$1
                        AND "id"=$2
            `;
            const newValues = [
                req.user.id,
                req.body.deck_id
            ]
            pool.query(newQuery, newValues)
                .then((dbRes) => {
                    res.send(dbRes.rows[0])
                })
                .catch((dbErr) => {
                    console.error('2nd put name db error', dbErr);
                    res.sendStatus(500);
                })
        })
        .catch((dbErr) => {
            console.error('put name db error', dbErr);
            res.sendStatus(500);
        })
})

router.put('/commander', rejectUnauthenticated, (req, res) => {
    const sqlText = `
        UPDATE "user_decks"
            SET "commander"=$1,
                "deck_img"=$2
            WHERE "user_id"=$3
                AND "id"=$4;
    `;
    const sqlValues = [
        req.body.commander,
        req.body.deck_img,
        req.user.id,
        req.body.deck_id
    ]
    pool.query(sqlText, sqlValues)
        .then((dbRes) => {
            const newQuery = `
                SELECT "id" FROM "user_decks"
                    WHERE "user_id"=$1
                    AND "id"=$2
            `;
            const newValues = [
                req.user.id,
                req.body.deck_id
            ]
            pool.query(newQuery, newValues)
                .then((dbRes) => {
                    res.send(dbRes.rows[0])
                })
                .catch((dbErr) => {
                    console.error('2nd put commander db error', dbErr);
                    res.sendStatus(500);
                })
        })
        .catch((dbErr) => {
            console.error('put commander db error', dbErr);
            res.sendStatus(500);
        })
})

router.delete('/', rejectUnauthenticated, (req, res) => {
    const cardToDelete = req.body.cardToDelete.id;
    const userId = req.user.id;
    const deckId = req.body.deck_id;
    const sqlText = `
        SELECT "deck_contents" FROM "user_decks"
            WHERE "user_id"=$1
                AND "id"=$2;
    `;
    const sqlValues = [
        userId,
        deckId
    ]
    pool.query(sqlText, sqlValues)
        .then((dbRes) => {
            // update deck_contents after removing single card
            const updatedDeck = dbRes.rows[0].deck_contents
            const cardIndex = updatedDeck.indexOf(cardToDelete);
            if (cardIndex === -1) {
                console.error('could not find card to delete in deck_contents')
            } else {
                updatedDeck.splice(cardIndex, 1);
                const setDeckQuery = `
                    UPDATE "user_decks"
                        SET "deck_contents"=$1
                        WHERE "user_id"=$2
                            AND "id"=$3;
                `;
                const setDeckValues = [
                    updatedDeck,
                    userId,
                    deckId
                ]
                pool.query(setDeckQuery, setDeckValues)
                    .then((dbRes) => {
                        const newQuery = `
                            SELECT "id" FROM "user_decks"
                                WHERE "user_id"=$1
                                AND "id"=$2
                        `;
                        const newValues = [
                            userId,
                            deckId
                        ]
                        pool.query(newQuery, newValues)
                            .then((dbRes) => {
                                res.send(dbRes.rows[0])
                            })
                            .catch((dbErr) => {
                                console.error('3rd delete db error', dbErr);
                                res.sendStatus(500);
                            })
                    })
                    .catch((dbErr) => {
                        console.error('2nd delete db error', dbErr);
                        res.sendStatus(500);
                    })
            }
        })
        .catch((dbErr) => {
            console.error('delete db error', dbErr);
            res.sendStatus(500);
        })
});

router.delete('/:id', rejectUnauthenticated, (req, res) => {
    const sqlText = `
        DELETE FROM "user_decks"
	        WHERE "user_id"=$1
            AND "id"=$2;
    `;
    const sqlValues = [
        req.user.id,
        req.params.id
    ]
    pool.query(sqlText, sqlValues)
        .then((dbRes) => {
            res.send(dbRes.rows);
        })
        .catch((dbErr) => {
            console.error('get db error', dbErr);
            res.sendStatus(500);
        })
});

module.exports = router;