const Quizz = require("../db").Quizz;
const Question = require("../db").Question;
const Answer = require("../db").Answer;

async function postQuizz(req, res) {
    try {
        if ( !req.body?.quizz) {
            return res.status(400).json({ error: "Missing parameters" });
        }
        console.log(req.body.quizz);

        const data = req.body.quizz

        const newQuizz = await Quizz.create({
            name: data.name,
        });

        data.quizz.forEach(async (line) => {
            console.log(line.question, line.time, line.options, line.correctOption);
            let newQuestion = await Question.create({
                name: line.question,
                quizzId: newQuizz.id,
                time: line.time,
            });
            line.options.forEach(async (option) => {
                let newAnswer = await Answer.create({
                    name: option,
                    questionId: newQuestion.id,
                    valid: line.correctOption === option,
                });
            });
        });


            res.status(200).json("ok");
        
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}


async function getQuizz(req, res) {
    try {
        const quizzId = req.params.id;

        if (!quizzId) {
            return res.status(400).json({ error: "Missing quizz ID parameter" });
        }

        const quizz = await Quizz.findByPk(quizzId, {
            include: {
                model: Question,
                include: Answer,
            },
        });

        if (!quizz) {
            return res.status(404).json({ error: "Quizz not found" });
        }

        res.status(200).json(quizz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getQuizzList(req, res) {
    try {
        const quizzList = await Quizz.findAll({
            attributes: ['id', 'name'],
        });

        res.status(200).json(quizzList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}




module.exports = { postQuizz, getQuizz, getQuizzList };