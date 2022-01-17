const express = require('express');
const axios = require('axios');
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const pool = require('../modules/pool');

const router = express.Router();

// get all user decks based on user_id
router.get('/', rejectUnauthenticated, (req, res) => {
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

// gets the commander of a deck based on id
router.get('/commander/:id', rejectUnauthenticated, (req, res) => {
    const sqlText = `
        SELECT * FROM "user_decks"
	        WHERE "user_id"=$1
                AND "id"=$2;
    `;
    pool.query(sqlText, [req.user.id, req.params.id])
        .then((dbRes) => {
            const cardName = dbRes.rows[0]?.commander?.replace(/ /g, "+");
            // sends an axios request with the ids of the cards from the DB
            if (dbRes.rows[0].commander != null) {
                axios({
                    method: 'GET',
                    url: `https://api.scryfall.com/cards/named?exact=${cardName}`
                }).then((apiRes) => {
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

// posts the new deck in the DB with a filler image thats stored in the public folder
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

// updates the deck contents array with the card scryfall_id when a new card is added to the DB
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
            const invSql = `
                UPDATE "inventory"
                    SET "deck_id"=$1
                    WHERE "user_id"=$2
                        AND "id"=$3;
            `;
            const invValues = [
                req.body.deck_id,
                req.user.id,
                req.body.cardToAdd.inventoryId
            ]
            pool.query(invSql, invValues)
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
                            console.error('3rd put contents db error', dbErr);
                            res.sendStatus(500);
                        })
                })
                .catch((dbErr) => {
                    console.error('2nd put contents db error', dbErr)
                })
        })
        .catch((dbErr) => {
            console.error('put contents db error', dbErr);
            res.sendStatus(500);
        })
})

// presentation cards to add to the deck
const cardsToAdd = [
    'bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd',
    '5d131784-c1a3-463e-a37b-b720af67ab62',
    '52705c53-883e-4b6a-9c08-3fa35f6f17d5',
    '44657ab1-0a6a-4a5f-9688-86f239083821',
    'fab2fca4-a99f-4ffe-9c02-edb6e0be2358',
    '9dfdb73d-b001-4a59-b79e-8c8c1baea116',
    '6832e495-7ee9-43e0-94ea-03c88344080e',
    'd0787e1f-0b75-44ab-a8fd-90358906a787',
    '97502411-5c93-434c-b77b-ceb2c32feae7',
    'e90d01c9-e76e-42ff-b0fa-8b6786242aae',
    'b4036bb7-835d-4690-aca1-1ab566776e9a',
    'c697548f-925b-405e-970a-4e78067d5c8e',
    '2bd9d26e-984c-4cf8-8c46-447f9776668f',
    'ab70c262-37a9-4dcd-80bb-d4422368eade',
    '5b3c393c-3596-4bd9-a553-e0b03c2eb950',
    'b76bed98-30b1-4572-b36c-684ada06826c',
    '27427233-da58-45af-ade8-e0727929efaa',
    '2a0417bf-b735-46d7-9985-2d991051020f',
    'f185a734-a32a-4244-88e8-dabafbfd064f',
    '75ec8548-5790-4eac-8780-cdd126438192',
    '8dfcb129-4665-40e4-b5cb-a79f3f40ae5c',
    '7bf6baf2-d20b-467d-8929-abefcf7dfa99',
    '3606519e-5677-4c21-a34e-be195b6669fa',
    'e1d2c774-aab9-4747-af91-da792ed7cfe1',
    '14dc88ee-bba9-4625-af0d-89f3762a0ead',
    'd6876c7a-8bbe-484e-b733-70229fa336cd',
    '22a6a5f1-1405-4efb-af3e-e1f58d664e99',
    'ea7e4c65-b4c4-4795-9475-3cba71c50ea5',
    '3184b138-1109-4195-9d96-4f190164e98b'
]

// fills up the presentation deck with all the pre-chosen cards
router.put('/contents/fill', rejectUnauthenticated, (req, res) => {
    const sqlText = `
        UPDATE "user_decks"
            SET "deck_contents"=$1
            WHERE "user_id"=$2
                AND "id"=$3;
    `;
    const sqlValues = [
        cardsToAdd,
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
                    console.error('3rd put contents db error', dbErr);
                    res.sendStatus(500);
                })
        })
        .catch((dbErr) => {
            console.error('put contents db error', dbErr);
            res.sendStatus(500);
        })
})

// updates the deck name based on user input
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

// updates the commander when the user has chosen a new commander
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

// deletes a single cards in the deck contents based on scryfall_id
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

// deletes the entire deck based on id
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