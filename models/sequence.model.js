const mongoose = require('mongoose');
const Edge = require('./edge.model'); 
const Node = require('./node.model');

const SequenceSchema = new mongoose.Schema({
    sqName: { type: String, required: true },
    nodeData: [Node.schema], 
    edges: [Edge.schema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: mongoose.Schema.Types.ObjectId 
});

module.exports = mongoose.model('Sequence', SequenceSchema);
