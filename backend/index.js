const express = require('express')
const cors = require("cors");
require("dotenv").config({ path: ".env.local", override: true });

const app = express()

const PORT = process.env.PORT_BACK || 3000
const HOSTNAME = process.env.HOSTNAME_BACK || 'localhost'

app.use(cors());

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Hello World from backend!' })
})

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});

module.exports = app;