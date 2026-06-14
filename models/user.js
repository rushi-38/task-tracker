const mongoose = require("mongoose");

const passportLocalMongoose =
require("passport-local-mongoose").default;

const userSchema =
new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    }

});

// passport

userSchema.plugin(
    passportLocalMongoose
);

// model

const User =
mongoose.model(
    "User",
    userSchema
);

module.exports = User;