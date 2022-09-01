const Sequelize = require('sequelize');
const sequelize = new Sequelize('acadInfo','dbo','root',{
    dialect:'mssql',
    host:'localhost',
    dialectOptions:{
        encrypt:true
    }
});
sequelize.authenticate().then((err)=>{
    console.log('Connection successfull', err);
})
.catch((err)=>{
    console.log('Unable to connect to database', err)
})

// sequelize.close() to close the connection