const express = require('express');
const router = express.Router();
const {createUser, signIn, getOneUser, userRated, userRecommendation} = require('../../controllers/users/users')
// const {protect} = require('../../middleware/auth')

// Method GET
// Desc get all users
// Public
// router.get('/', getAllUsers);

// router.get('/logout', signout)

// @Params PASSWORD
// Method GET
// Desc get one user
// Public
router.get('/:_id', getOneUser);

// @Params [NAME, EMAIL, PASSWORD]
// Method POST
// Desc create a new user
// Public
router.post('/', createUser);


router.post('/rating', userRated);

router.get('/:_id/getRecommendation', userRecommendation);
// Method PUT
// Desc edit a user
// Private
// router.put('/:id',protect, editUser);

// Method DELETE
// Desc delete a user
// Private
// router.delete('/:id',protect, deleteUser);

router.post('/signin', signIn);


module.exports = router;