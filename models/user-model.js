const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UsrsModels = new Schema({

    service: {
        type: String,
        enum: ["admin", "super"],
        default: "admin"
    },

   
   
    email: {
        type: String,
        require: true,
        unique: true
    },

    password: {
        type: String,
        default: ""
    },



    statusConexion: {
        type: String,
        default: "inactive"
    },

    statusOnline: {
        type: String,
        enum: ["on", "off", "del"],
        default: "on"
    },

    token: {
        type: String,
    },

    date: {
        type: Date,
        default: Date.now()
    }

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

module.exports = mongoose.model('user-admin', UsrsModels);