const mongoose = require("mongoose");
 const { ObjectId } = mongoose.Schema;

const inventorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    bookName: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    userId: {
        type: ObjectId,
        ref: "User",
    },
    bookId: {
        type: ObjectId,
        ref: "Book",
    },
    status: {
        type: String,
        trim: true,
        required: true,
        maxlength: 100
    }
}, { timestamps: true });

module.exports = mongoose.model("Inventory", inventorySchema);
// module.exports = { Inventory };