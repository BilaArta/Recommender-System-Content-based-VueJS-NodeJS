const express = require('express');
const router = express.Router();
const {getAllMovie} = require('../../controllers/movies/movies')

router.get('/', getAllMovie);

module.exports = router;