const express = require('express')
const cors = require("cors");
// const io = socketIo(server);
// const http = require('http');
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user");
const quizzRoutes = require("./routes/quizz");
const {app, server} = require('./socket/socket');

require("dotenv").config({ path: ".env", override: true });

app.use(cors({
    origin: [`${process.env.URL}:${process.env.PORT_FRONT}`, 'http://localhost:3000'],
    credentials : true,
  }));

app.use(cookieParser());
app.use(express.json());
app.use(express.text());

const PORT = process.env.PORT_BACK || 3000
const HOSTNAME = process.env.HOSTNAME_BACK || 'localhost'


// io.on('connection', handleConnection);


app.use("/user", userRoutes);
app.use("/quizz", quizzRoutes);


server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});

module.exports = app;