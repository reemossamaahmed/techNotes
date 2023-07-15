const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose)

const noteSchema = new mongoose.Schema({
    userinfo : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref:"userinfo"
    },
    title:{
        type : String,
        required : true,
        trim : true,
    },
    body:{
        type : String,
        required : true,
        trim : true,
    },
    completed : {
        type : Boolean,
        default : false
    }
},
{
    timestamps: true
}
);


noteSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq : 500
})

const NoteModel = mongoose.model('Note',noteSchema);

module.exports = NoteModel;

