const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();

// sends the search request to the API
router.get('/:search', (req, res) => {
    axios({
        method: 'GET',
        url: `https://api.scryfall.com/cards/search?q=${req.params.search}`
    }).then((apiRes) => {
        res.send(apiRes.data);
    }).catch((apiErr) => {
        res.send(apiErr.response.data);
        console.error('**************************', apiErr.response);
    })
})

module.exports = router;