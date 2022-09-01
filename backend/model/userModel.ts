// Using sequelize.define
const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const User = sequelize.define('User',{
    //Model attributes are defined here
    firstName:{
        type: DataTypes.STRING,
        allowNull:false
    },
    lastName:{
        type:DataTypes.STRING
        //allowNull defaults to true
    }
},{
    //other model options go here
});
// `sequelize.define` also returns the model
console.log(User===sequelize.models.User); //true

// In typescript, you can add typing information without adding an actual public class field by using the declare keyword
//valid
/*
class User extends Model{
    declare id: number; //this is ok! The 'declare' keyword ensures this field will not be emmitted by typescript

}
User.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncreament: true,
        primaryKey: true
    }
},{
    sequelize
});
const user = new User({id:1});
user.id; //1        */