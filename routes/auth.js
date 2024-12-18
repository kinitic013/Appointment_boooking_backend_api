const {Router} = require('express');
const authController = require('../controller/auth');
const router = Router(); 

router.post('/professor/signup',authController.professorSignup);
router.post('/professor/login',authController.professorLogin);
router.post('/student/signup',authController.studentSignup);
router.post('/student/login',authController.studentLogin);

module.exports = router ; 

