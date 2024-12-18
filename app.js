const express = require("express")
const authRoutes = require("./routes/auth");
const slotRoutes = require("./routes/slot");
const studentRoutes = require("./routes/student");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get("/",(req,res)=>
{
    console.log("HERE");
    res.send("HELLO WORLD!!")
})
    
app.use(authRoutes);
app.use(slotRoutes);
app.use(studentRoutes);



module.exports = app;