const express = require('express')
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user");

require("dotenv").config({ path: ".env", override: true });


const app = express()

app.use(cors({
    origin: [`${process.env.URL}:${process.env.PORT_FRONT}`, 'http://localhost:3000/'],

    credentials : true,
  }));

app.use(cookieParser());
app.use(express.json());
app.use(express.text());

const PORT = process.env.PORT_BACK || 3000
const HOSTNAME = process.env.HOSTNAME_BACK || 'localhost'



app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Hello World from backend!' })
})
app.use("/user", userRoutes);


app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});

module.exports = app;