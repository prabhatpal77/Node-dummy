const {Sequelize, DataTypes} = require('sequelize');
//const sequelize=require('sequelize')
const sequelize=new Sequelize('academic1','root','root',{
    host:'localhost',
    dialect:'mysql',
    logging:true,
    pool:{max:5,min:0,idle:10000}
});
sequelize.authenticate()
.then(()=>{
    console.log('connected');
})
.catch(err=>{
    console.log('Error'+err);
});

const db = {};
db.Sequelize=Sequelize;
db.sequelize=sequelize;
db.student = require('../models/student')(sequelize,DataTypes);
db.sequelize.sync({force:false})
.then(()=>{
    console.log("yes re-sync");
})
db.users.hasOne(db.users);
db.posts.belongTo(db.users);
db.users.hasOne(db.posts,{foreignKey:'user_id'});

// Associates one to many
db.users.hasMany(db.users);

// Many to many
db.posts.belongToMany(db.tags,{through:'post_tag'});
db.tags.belongToMany(db.posts,{through:'post_tag'});

// reusable code
db.users.addScope('checkStatus',{
    where:{
        status:1
    }
});
