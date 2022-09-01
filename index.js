var userCtrl = require('./controllers/userControllers');
const express = require('express');
const app = express();
const port = 88;
const con = require('./config/connectdb');
app.get("/",(req,resp)=>{
    resp.send("hello baby");
});
app.listen(port, ()=>{
    console.log(`App is listening at http://localhost:${port}`);
})
app.get("/add",userCtrl.addUser);
app.get("/crud",userCtrl.crudOperation);
app.get("/query",userCtrl.queryData);
app.get("/finder",userCtrl.findData);
app.get("/setter-getter",userCtrl.setterGetter);
app.get("/validation",userCtrl.validationCount);
app.get("/raw-query",userCtrl.rawQuery);
app.get("/oneToOne",userCtrl.oneToOne);