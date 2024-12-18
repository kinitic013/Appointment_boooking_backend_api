const runQuery = require('../utils/runQuery');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const getAllQuery = require("../utils/runAll")


module.exports.allAppointment = async (req,res)=>{

    try{
        const student_id = req.param('student_id');
        console.log(student_id);
        const check_query = `SELECT COUNT(*) FROM student WHERE student_id = ?`;
        const check_result = await getAllQuery(check_query,[student_id]);
        console.log(check_result);
        if(check_result[0]['COUNT(*)'] == 0)
        {
            res.status(404).json({"error":"Student does not exist"});
        }
        else
        {
            const search_query = `SELECT * FROM slot WHERE student_id = ?`;
            const search_result = await getAllQuery(search_query,[student_id]);
            console.log(search_result) ;
            res.status(200).send(search_result );
        }

    }
    catch(error)
    {
        console.log(error);
        res.status(500).send({"error" : error});
    }
}