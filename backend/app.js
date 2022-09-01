//console.log("yes")
const express=require('express');
const app=express();
const port=88;
const con = require('./config/mssql')
app.get("/",(req,resp)=>{
    resp.send("Hello beby");
});
app.listen(port,()=>{
    console.log(`App is listning at http://localhost:${port}`);
})
