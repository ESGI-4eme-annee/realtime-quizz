const  { Server } = require ('socket.io');
const http = require  ('http');
const express = require  ('express');

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});


const roomSocketMap = {}; // {roomId: {name: roomName, userId: userId}}; : liste des salles et des utilisateurs qui les ont créées

const roomUserMap = {}; // {roomId: [userId]}; : toues les salles et les utilisateurs qui sont dedans

const userSocketMap = {}; // {userId: socketId}; : liste des utilisateurs connectés


io.on('connection', (socket) => {
    console.log('Un client est connecté', socket.id);

    const userEmail = socket.handshake.query.userEmail;
    if (userEmail != "undefined") {
        userSocketMap[userEmail] = socket.id;

        // Envoi de la liste des utilisateurs connectés
        io.emit('onlineUsers', Object.keys(userSocketMap));
        io.emit('roomCreated', roomSocketMap);
        
    }

    room(socket,io);

    quizz(socket,io);

    socket.on("disconnect", () => {
        console.log("Client déconnecté");
        delete userSocketMap[userEmail];
        io.emit('onlineUsers', Object.keys(userSocketMap));
    });
});

function room(socket,io)  {

    socket.on('createRoom', (socket) => {
        const roomId = socket.roomId;
        const roomName = socket.roomName;
        const password = socket.password;
        if (roomId != "undefined") {
            roomSocketMap[roomId] = {name : roomName, userEmail:socket.userEmail, password:password, state : true};
        }

        io.emit('roomCreated', roomSocketMap);
    });

    socket.on('joinRoom', (data) => {
        const roomId = data.roomId;
        const userEmail = data.userEmail;
        const userId = data.userId;

        if (roomSocketMap[roomId])
        {
            socket.join(roomId);
            io.to(roomId).emit('userJoinedRoom', userEmail);

            roomUserMap[roomId] = roomUserMap[roomId] || [];

            const userObject = {userEmail: userEmail, userId: userId};
            if (!roomUserMap[roomId].some(user => user.userId === userId)) {
                roomUserMap[roomId].push(userObject);
            }
            io.to(roomId).emit('roomUsers', roomUserMap[roomId]);

            console.log(`Le client ${userEmail} a rejoint le salon ${roomId}`);

        } else 
        {
            console.log(`Le salon ${userEmail} n'existe pas`);
        }

    });
    socket.on('leaveRoom', (data) => {
        console.log('leaveRoom', data);
        const userEmail = data.userEmail;

        const roomsJoined = socket.rooms;

        roomsJoined?.forEach(room => {
            socket.leave(room);

            const userIndex = roomUserMap[room]?.findIndex(user => user.userEmail === userEmail);
            const userCreate = roomSocketMap[room]?.userEmail === userEmail;

            if (roomUserMap[room]) {
                roomUserMap[room].splice(userIndex, 1);
            }

            if (userCreate) {
                delete roomSocketMap[room];
                io.emit('roomCreated', roomSocketMap);
                io.to(room).emit('adminLeave', true);

            }

        io.to(room).emit('roomUsers', roomUserMap[room]);


        });


    });
}

const roomQuizzMap = {};
const roomQuizzProgressMap = {};
const questionResponseMap = {};
const scoreUserMap = {};
const roomQuestions = [];


function quizz(socket,io) {
    
    socket.on('startQuizz', (data) => {
        const roomId = data.salle;
        const quizz = data.quizz;

        roomQuestions.push({
            roomId: roomId,
            quizzId: quizz.id,
            questions: quizz.Questions,
            numberOfQuestions: quizz.Questions.length,
            currentTimer: quizz.Questions[0].time,
            scores: []
        });


        let time = 3;
        io.to(roomId).emit('timerBeforeStart', time);
        let interval = setInterval(() => {
            time--;
            if (time < 0) {
                clearInterval(interval);

                let timer = quizz.Questions[0].time;
                let interval2 = setInterval(() => {
                    timer--;
                    if (timer < 0) {
                        return clearInterval(interval2);
                    }

                    if(timer === 3) {
                        io.emit('alertQuestionWillEnd', {
                            title: 'La question va bientôt se terminer !',
                            message: 'Il ne reste plus que quelques secondes pour répondre'
                        });
                    }

                    io.to(roomId).emit('timerQuestion', timer);
                }, 1000);

                io.to(roomId).emit('nextQuestion', {question: quizz.Questions[0], quizzId: quizz.id});
                io.to(roomId).emit('alertQuizzStarting', {
                    title: 'Le quizz commence 🏁',
                    message: 'Bon courage ! 💪'
                });

                return;
            }
            io.to(roomId).emit('timerBeforeStart', time);
        }, 1000);
    });

    socket.on('needNextQuestion', (data) => {
        const roomId = data.roomId;
        const quizzId = data.quizzId;
        const questionId = data.questionId;

        let indexQuestion = roomQuestions.find(room => room.roomId === roomId && room.quizzId === quizzId).questions.findIndex(question => question.id === questionId);
        let nextQuestion = roomQuestions.find(room => room.roomId === roomId && room.quizzId === quizzId).questions[indexQuestion + 1];

        console.log('nextQuestion backend', nextQuestion)

        if (nextQuestion) {
            let timer = nextQuestion.time;
            io.emit('alertNextQuestion', {
                title: 'Question suivante',
                message: 'La question suivante commence'
            });

            let interval = setInterval(() => {
                timer--;
                if (timer < 0) {
                    return clearInterval(interval);
                }

                if(timer === 3) {
                    io.emit('alertQuestionWillEnd', {
                        title: 'La question va bientôt se terminer !',
                        message: 'Il ne reste plus que quelques secondes pour répondre'
                    });
                }

                io.to(roomId).emit('timerQuestion', timer);
            }, 1000);
        }

        io.to(roomId).emit('nextQuestion', {question: nextQuestion, quizzId});
    });

    //response envoyer par les joueurs
    socket.on('sendResponse', (userId, roomId, quizzId, idQuestion, idResponse,timer) => {
        roomQuizzProgressMap[roomId] ??= {};
        roomQuizzProgressMap[roomId][quizzId] ??= {};
        roomQuizzProgressMap[roomId][quizzId][idQuestion] ??= {};
        roomQuizzProgressMap[roomId][quizzId][idQuestion][userId] = idResponse;

        const responseCounts = Object.values(roomQuizzProgressMap[roomId][quizzId][idQuestion]).reduce((acc, value) => {
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {});

        if(!timer){
        io.to(roomId).emit('responseCounts', responseCounts);
        }else{
            const question = roomQuestions.find(room => room.roomId === roomId && room.quizzId === quizzId).questions.find(question => question.id === idQuestion);
            const response = question.Answers.find(answer => answer.id === idResponse);
        
            let scores = roomQuestions.find(room => room.roomId === roomId && room.quizzId === quizzId).scores;
            if (response && response.valid) {
                
                    io.to(roomId).emit('responseValid', response.id);
                
                const score = scores.find(score => score.userId === userId);
                if (score) {
                    score.score++;
                } else {
                    scores.push({userId, score: 1});
                }
            } else {
                const score = scores.find(score => score.userId === userId);
                if (!score) {
                    scores.push({userId, score: 0});
                }
            }
            io.to(roomId).emit('scoresQuizz', scores);
        }
    });
}

module.exports = {app, io, server};