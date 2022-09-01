const sequelize = require("sequelize");

const Users = sequelize.define("users",{
    name:{
        type:sequelize.DataTypes.STRING,
        set(Value){
            this.setDataValue('name',value+'Singh')
        }
    },
    email:{
        type:sequelize.DataTypes.STRING,
        defaultValue:'test@gmail.com',
        set(Values){
            this.setDataValue('email',value+'@gmail.com')
        },
        allowNull:false,
        unique:true
    }
})
// getter
get(){
    return this.getDataValue('name')+'XYZ';
}


module.exports = (sequelize, DataTypes)=>{
    const Users = sequelize.define("users",{
        name:DataTypes.STRING,
        email:{
            type:DataTypes.STRING,
            defaultValue:'test@gmail.com'
        },
        gender:{
            type:DataTypes.STRING,
            validate:{
                    equals:'male'
            }
        },
        hooks:{
            beforeValidate:(user, option)=>{
                console.log("Yes Hooks called")
            }
        },

        // remove hook
        Users.removeHook('beforeValidate','CustomeName');
    },{
        timestamps:false,
        paranoid:true,
        daleteAt:SoftDelete
    })
}