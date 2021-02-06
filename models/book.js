const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const bookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    category: {
        type: ObjectId,
        ref: 'Category',
        required: true,
    },
    author: {
        type: String,
        trim: true,
        required: true,
        maxlength: 100
    },
    publisher: {
        type: String,
        trim: true,
        required: true,
        maxlength: 100
    },
    photo: {
        data: Buffer,
        contentType: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);



// const mongoose = require('mongoose');
// const { ObjectId } = mongoose.Schema.Types

// const categorySchema = new mongoose.Schema({
//     cName: {
//         type: String,
//         required: true
//     }
// }, { timestamps: true })

// const categoryModel = mongoose.model("categories", categorySchema);
// module.exports = categoryModel;