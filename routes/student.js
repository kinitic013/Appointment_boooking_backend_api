const {Router} = require('express');
const StudentController = require('../controller/student');
const router = Router(); 

router.get('/student/allappointment',StudentController.allAppointment);

module.exports = router ; 

