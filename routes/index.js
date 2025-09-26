const express = require('express');
const router = express.Router();

// Landing page route
router.get('/', (req, res) => {
    res.render('landing');
});

module.exports = router;
