const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageModel = new Schema({

    titre: {
        type: String,
    },

    subTitle: {
        type: String,
    },

    desc: {
        type: String,
    },

    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'concourant' },

    success : {
        type : String,
        enum: ["0", "1"],
        default: "0"
    }

   
}, {
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('messages', MessageModel);