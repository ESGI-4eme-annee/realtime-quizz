const connection = require("./db");
const fs = require("fs");
const path = require("path");

const db = {connection};
 
const files = fs.readdirSync(path.join(__dirname, "models")); 

files.forEach((file) => {
  const model = require(path.join(__dirname, "models", file))(connection);

  db[model.name] = model;

});

const User = db.User;
const Quizz = db.Quizz;
const Question = db.Question;
const Answer = db.Answer;

Quizz.hasMany(Question, {
  foreignKey: "quizzId", alias: "quizz"});

Question.hasMany(Answer, {
  foreignKey: "questionId", alias: "question"});

module.exports = db;
