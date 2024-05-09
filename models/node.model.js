const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: { type: String, required: true },
    position: mongoose.Schema.Types.Mixed, 
    data: mongoose.Schema.Types.Mixed 
}, { minimize: false }); 

module.exports = mongoose.model('Node', NodeSchema);
