const {Sequelize, Model, DataTypes} = require('sequelize');
const sequelize = new Sequelize("sqlite::memory:");

const User = sequelize.define("user",{
    name:DataTypes.TEXT,
    favoriteColor:{
        type:DataTypes.TEXT,
        defaultValue:'Red'
    },
    age:DataTypes.INTEGER,
    cash:DataTypes.INTEGER
});
(
    async()=>{
        await sequelize.sync({force:true});
        //Code here
    }
)();