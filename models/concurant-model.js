const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ConcurantModel = new Schema({

    sexe: {
        type: String,
        enum: ["masculin", "feminin"],
        default: "masculin"
    },

    nom :{
        type : String,
        default :""
    },

    prenom : {

        type : String ,
        default :""

    },
   

    daara : {

        type : String ,
        default :""

    },

    addresse : {

        type : String ,
        default :""

    },
   
   
    telephone: {
        type: String,
        require: true,
    },

   




}, {
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.statusConexion;
            delete ret.__v;
        },
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('concourant', ConcurantModel);