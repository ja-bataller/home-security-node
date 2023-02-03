const express = require('express');


const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hi there, this is the the node.js api of Home Security Web Application.');
});

module.exports = router;