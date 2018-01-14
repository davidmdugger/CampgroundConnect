var mongoose = require("mongoose");

// setup campground schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    // association of the user logged in with the comment
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }    
    ],
    price: String
});

// compile campgroundSchema into a model
// This will make us a model of the schema above that allows us to use .find() or .update()
module.exports = mongoose.model("Campground", campgroundSchema);