const runQuery = require('../utils/runQuery');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const getAllQuery = require("../utils/runAll");
const { EMPTY } = require('sqlite3');
// const db = require('../models/database')

module.exports.create = async(req,res)=>{

    try{
        const {start_time, professor_id } = req.body;
        if(!Number.isInteger(start_time))
        {
            res.status(400).json({ error: 'Invalid Time, only Integer Start time allowed' });
        }
        const count_sql = `SELECT COUNT(*) FROM slot WHERE professor_id = ? AND start_time = ?`;
        const count_result = await getAllQuery(count_sql,[professor_id,start_time]);
        // console.log(res);
        if(count_result[0]['COUNT(*)'] != 0)
        {
            res.status(400).json({ error: 'Slot with this Start time already exists'});
        }
        else
        {
            const insert_sql = `INSERT INTO slot (professor_id,start_time) VALUES(?,?) RETURNING slot_id`;
            const result = await runQuery(insert_sql,[professor_id,start_time]);
            // console.log(result);
            res.status(201).json({
                "professor_id": professor_id,
                "start_time" : start_time,
                "slot_id" : result['lastID']
            });
        }

    }
    catch(error){
        console.error(error);
        res.status(400).json({ error: 'Slot creation failed' });
    }
}
module.exports.getById = async(req,res)=>
{
    try{
        const professor_id = req.param('professor_id');
        // console.log(professor_id) ;
        const query = "SELECT * FROM slot WHERE professor_id = ? AND isBooked = ?";
        const result = await getAllQuery(query,[professor_id,0]);
        res.status(200).send(result);
    }
    catch(error)
    {
        res.status(400).json({"error" : "Search query failed " + error});
    }
}

module.exports.book = async(req,res)=>{
    try{
        const {slot_id , student_id} = req.body;
        const get_query = `SELECT * from slot WHERE slot_id = ?`;
        const result = await getAllQuery(get_query,[slot_id]);
        if(result.length === 0)
        {
            res.status(404).json({"message": "Slot doesn't exist"});
        }
        else if(result[0]['isBooked'])
        {
            res.status(400).json({"message": "Appointment is already booked"});
        }
        else
        {
            const update_query = `UPDATE slot SET isBooked = ? , student_id = ? WHERE slot_id = ?`;
            const update_result = await runQuery(update_query,[1,student_id,slot_id]);
            res.status(200).json({"message" : "Appointment Booked"});
        }
    }
    catch(error)
    {
        res.status(500).json({"error" : "\nFailed\n"+error});
    }
}
module.exports.cancel = async(req,res)=>{
    try{
        const {slot_id,professor_id} = req.body;
        const check_query = `SELECT COUNT(*) FROM slot WHERE slot_id = ? AND professor_id = ?`;
        const check_result = await getAllQuery(check_query,[slot_id,professor_id]);
        // console.log(check_result);
        if(check_result[0]['COUNT(*)'] != 0)
        {
            const delete_query = `DELETE FROM slot WHERE slot_id = ?`;
            const result = await runQuery(delete_query,[slot_id]);
            console.log(result);
            res.status(200).json({"message" : "Slot Deleted"});
        }
        else
        {
            res.status(404).json({"error" : "Slot does not exist"});
        }
    }
    catch(error)
    {
        res.status(400).json({"error" : "\nFailed\n"+error});
    }
}
module.exports.getAll = async(req,res)=>{
    const query = "SELECT * FROM slot";
    try{
        const result = await getAllQuery(query);
        res.send(result);
    }
    catch(error)
    {
        res.status(400).json({"error" : "Search query failed " + error});
    }
}