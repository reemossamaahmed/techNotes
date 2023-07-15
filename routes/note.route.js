const express = require('express');
const router = express.Router();
const {showNotes, showNoteById ,createNote ,updateNote ,deleteNote} = require('../controller/note.controller')
const auth = require('../middleware/auth')



router.get('/', showNotes);

router.get('/:id', showNoteById );

router.post('/create', auth, createNote);

router.put('/:id', updateNote);

router.delete('/:id', deleteNote);

module.exports = router;