const Sequence = require('../models/sequence.model');
const { processNode} = require('../config/mock_email');
const jwt = require('jsonwebToken');


exports.verifyToken=(req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403); // Forbidden if error (e.g., token expired)
      res.sendStatus(200); // OK if token is valid
    });
  };

exports.loginUser = (req, res) => {
    // Authenticate User Logic here
    const email = req.body.username; 
    const password = req.body.password;
    console.log(req)
    if(email === 'admin@mail.com' && password === 'admin'){
    const accessToken = jwt.sign({email,password}, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken })
    }
    res.status(402).send({ message: 'Invalid Credentials' });
  };
// Save a new sequence or update if it exists
exports.saveSequence = async (req, res) => {
    const { sqName, nodeData, edges } = req.body;
    try {
        const existingSequence = await Sequence.findOne({ sqName });
        if (existingSequence) {
            res.status(409).send({ message: 'A sequence with this name already exists.' });
            return;
        }
        const sequence = new Sequence({ sqName, nodeData, edges });
        await sequence.save();
        res.status(201).send({ message: 'Sequence saved successfully', id: sequence._id });
    } catch (error) {
        console.error('Error saving the sequence:', error);
        res.status(500).send({ message: error.message });
    }
};

// Delete a sequence by name
exports.deleteSequence = async (req, res) => {
    const { sqName } = req.params;  // Extract the sequence name from the request parameters
    console.log(req.params)
    try {
        const sequence = await Sequence.findOneAndDelete({ sqName });
        if (!sequence) {
            res.status(404).send({ message: 'Sequence not found.' });
            return;
        }
        res.status(200).send({ message: 'Sequence deleted successfully.' });
    } catch (error) {
        console.error('Error deleting the sequence:', error);
        res.status(500).send({ message: error.message });
    }
};

exports.executeSequence = async (req, res) => {
    const { nodeData, edges } = req.body;  // Removed sqName as it's not used in this modified version

    try {
        if (!nodeData || nodeData.length === 0 || !edges) {
            res.status(400).send({ message: 'Invalid or missing node data or edges.' });
            return;
        }

        console.log('Executing sequence with nodes and edges:', nodeData, edges);
        
        let currentNodeId = nodeData[0].id; 
        while (currentNodeId) {
            const currentNode = nodeData.find(n => n.id === currentNodeId);
            if (!currentNode) {
                console.log('Next node not found, ending sequence.');
                res.status(404).send({ message: 'Next node not found in sequence.' });
                return;
            }
            currentNodeId = await processNode(currentNode, nodeData, edges);
        }

        console.log('Sequence execution completed');
        res.status(200).send({ message: 'Sequence execution completed successfully.' });
    } catch (error) {
        console.error('Error executing the sequence:', error);
        res.status(500).send({ message: 'Error executing the sequence: ' + error.message });
    }
};


exports.updateSequence = async (req, res) => {
    const { sqName, nodeData, edges } = req.body;
    try {
        console.log(nodeData);
        const existingSequence = await Sequence.findOne({ sqName });

        if (!existingSequence) {
            res.status(404).send({ message: 'Sequence not found.' });
            return;
        }

        // Update the sequence with new data
        existingSequence.nodeData = nodeData;
        existingSequence.edges = edges;

        // Save the updated sequence
        await existingSequence.save();

        res.status(200).send({ message: 'Sequence updated successfully', name: existingSequence.sqName });
    } catch (error) {
        console.error('Error updating the sequence:', error);
        res.status(500).send({ message: error.message });
    }
};


// Get a single sequence by name
exports.getSequenceByName = async (req, res) => {
    try {
        const sqName = req.params.sqName;
       
        const sequence = await Sequence.findOne({ sqName });
        if (!sequence) {
            res.status(404).send({ message: 'Sequence not found.' });
            return;
        }
        res.status(200).send(sequence);
    } catch (error) {
        console.error('Error retrieving the sequence:', error);
        res.status(500).send({ message: error.message });
    }
};

// Get all sequences
exports.getAllSequences = async (req, res) => {
    try {
        const sequences = await Sequence.find();
        res.status(200).send(sequences);
    } catch (error) {
        console.error('Error retrieving sequences:', error);
        res.status(500).send({ message: error.message });
    }
};
