require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const sequenceRoutes = require('./routes/sequence.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors('*'));
app.use(bodyParser.json());

// Connect to MongoDB
require('./config/db');

// Use Routes
app.use('/api', sequenceRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
