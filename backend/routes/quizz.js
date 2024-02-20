const express = require('express');
const router = express.Router();
const quizzCtrl = require('../controllers/quizzController');


router.post('/', quizzCtrl.postQuizz);
router.get('/info/:id', quizzCtrl.getQuizz);

router.get('/list', quizzCtrl.getQuizzList);


module.exports = router;