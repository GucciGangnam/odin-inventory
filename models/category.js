const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriesSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
}, { collection: 'Categories' }); // Specify the collection name here

// Export the model
module.exports = mongoose.model('Category', categoriesSchema);

