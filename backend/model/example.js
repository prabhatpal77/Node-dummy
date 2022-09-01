const {Sequelize, Op, Model, DataTypes}=require('sequelize');
const sequelize=new Sequelize('sqlite::memory:');

// choose one of the logging options
logging: console.log,                   // Default, display the first parameter of the log function call
//logging: (...msg)=>console.log(msg),    // displays all log function all parameters
//logging: false,                         // Disables loggin
//logging: msg=>logger.debug(msg),        // Use custom logger, (e.g. winston or bunyan), displays the first parameter
//logging: logger.debug.bind(logger)      // Alternative way to use custom logger, displays all messages 
class User extends Model{}
User.init({
    username: DataTypes.STRING,
    birthday: DataTypes.DATE
},{
    sequelize, modelName: 'user'
});
(async()=>{
    await sequelize.sync();
    const jane=await User.create({
        username:'janedoe',
        birthday: new Date(1980, 6, 20)
    });
    console.log(jane.toJSON());
})();

// Promises and async/await
// Promises API-- e.g. then, catch, finally

// Models can be defined in two ways in sequelize
// 1. Calling sequelize.define(modeName, attributes, options)
// 2. Extending Model and calling init(attributes, options)