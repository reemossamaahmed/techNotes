const express = require('express');
const router = express.Router();
const {showUsers, showUserById ,createUser ,updateUser ,deleteUser, login, profile, logout, refreshToken} = require('../controller/user.controller');
const auth = require('../middleware/auth');


router.get('/', showUsers);

router.get('/profile', auth, profile);


router.get('/:id', showUserById );

router.post('/create', createUser);

router.post('/login', login);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

router.post("/logout",auth,logout);

router.post("/refresh",refreshToken);

module.exports = router;