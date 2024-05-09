const mongoose = require('mongoose');

const EdgeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
    animated: { type: Boolean, default: false }
});

module.exports = mongoose.model('Edge', EdgeSchema);
