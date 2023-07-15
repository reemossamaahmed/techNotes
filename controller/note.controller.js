const NoteModel = require('../model/note');

const showNotes = async (req, res) => {
    try{
        const notes = await NoteModel.find({});
        if(!notes){
            return res.status(404).json({
                message : `This note is not exists`
            })    
        }

        res.status(200).json({
            data : notes,
            message: 'success'
        })
    }
    catch(error)
    {
        res.status(500).json({
            message : error.message
        })
    }
}

const showNoteById = async (req, res) => {
    try{
        const id = req.params.id;
        const note = await NoteModel.find({_id : id});
        if(!note){
            return res.status(404).json({
                message : `This note is not exists`
            })    
        }

        res.status(200).json({
            data : note,
            message: 'success'
        })
    }
    catch(error)
    {
        res.status(500).json({
            message : error.message
        })
    }
}

const createNote = async (req, res) => {
    try{
        const Note = new NoteModel(req.body);
        const noteSave = await Note.save();
        res.status(201).json({
            data : noteSave,
            message: "New note created successfully"
        })
    }
    catch(error)
    {
        res.status(500).json({
            message : error.message
        })
    }
}

const updateNote = async (req, res) => {
    try{
        const id = req.params.id;
        
        if(!id){
            return res.status(404).json({
                message : `This note  id is not exists`
            })    
        }

        const note = await NoteModel.findByIdAndUpdate({_id : id},req.body,{
            new : true ,
            runValidators :true
        });
        

        res.status(200).json({
            data : note,
            message: 'success'
        })
    }
    catch(error)
    {
        res.status(500).json({
            message : error.message
        })
    }
}

const deleteNote = async (req, res) => {
    try{
        const id = req.params.id;
        
        if(!id){
            return res.status(404).json({
                message : `This note  id is not exists`
            })    
        }

        const note = await NoteModel.findByIdAndRemove({_id : id});
        
        res.status(200).json({
            data : note,
            message: 'success'
        })
    }
    catch(error)
    {
        res.status(500).json({
            message : error.message
        })
    }
}

module.exports = {showNotes, showNoteById ,createNote ,updateNote ,deleteNote}