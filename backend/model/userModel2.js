// Extending Model
const {Sequelize, DataTypes, Model} = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class User extends Model{
    //Caveat with public class fields
    // Invalid
    id;  //this field will shadow sequelize's getter and setter. If should be removed
    //valid
    otherPublicfield; // this field does not shadow anything. It is fine.
}

User.init({
   /* id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }   */
    //Model attributes are defined here
    firstname:{
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName:{
        type: DataTypes.STRING
        // allowNull defaults to true
    }
},{
    // other model options go here
    sequelize, // we make to pass the connection instance
    modelName: 'User' // We need to choose the model name
});
const user = new User({id: 1});
user.id;    // undefined
// the defined model is the class itself
console.log(User === sequelize.models.User); //true

// Internally, sequelize.define calls Model.init, so both approaches are essentially equivalent

// You can stop the auto-pluralization by Sequelize using the freezTableName: true option. e.g
/**
 sequelize.define('User',{
    // ...(attributes)
 },{
    freezeTableName:true
 });
 // for globally
 const sequelize = new Sequelize('sqlite::memory:',{
    define:{
        freezeTableName:true
    }
 });

 // providing the table name directly

 sequelize.define('User',{
    //..(attributes)
 },{
    tableName:'Employess'
 });
 */

 // Model synchronization
 // User.sync()- This creates the table if it doesn't exist(and does nothing if it already exists)
 // User.sync({force: true})- This creates the table, dropping it first if it already existed
 // User.sync({alter:true})- This checks what is the current state of the table in the database(which 
 // colunms it has, what are their data types, etc) and then performs the necessary changes in the table 
 // to make it match the model.
 /**e.g.
  await User.sync({force: ture});
  console.log("The table for the user model was just (re)created");
  */
 // Synchronizing all models at once
 // Use sequelize.sync()
 /**
  await sequelize.sync({force:true});
  console.log("All models were synchronized successfully");
  */

  // Dropping tables
  // To drop the table related to the model
  /**
   await User.drop();
   console.log("User table dropped");
   */
  // To drop all tables
  /*
  await sequelize.drop();
  console.log("All tables dropped");
  */

// Database safety check
// this will run .sync() only if database name ends with '_test'
// sequelize.sync({force:ture, match: /_test$/});

// Timestamps
/**
 sequelize.define('User',{
    //...attributes

 },{
    timestamps:false
 });
 */
// It is also possible to enable only one of createdAt/updatedAt, and to provide a custom name for these columns
/**
 class Foo extends Model{}
 Foo.init({/*attributes*},{
    sequelize,

    // don't forget to enable timestamps!
    timestamps: true,

    // I don't want createdAt
    createdAt: false,

    // I want updatedAt to actually be called updatedTimestamp
    updatedAt: 'updateTimestamp'
 });
 */

 // Column declaration shorthand syntax
 /*
 //This:
 sequelize.define('User',{
    name:{
        type:DataTypes.STRING
    }
 });
 // can ne simplefied to:
 sequelize.define('User',{name: DataTypes.STRING});
 */
// Default Values
// By default, sequelize assumes that the default value of a column is NULL. This behavior can be changed
// be passing a specific defaultValue to the column definition;
/*
sequelize.define('User',{
    name:{
        type:DataTypes.STRING,
        defaultValue:"John Doe"
    }
});
*/
// Some speciel values, such as DataTypes.NOW, are also accepted:
/*
sequelize.define('Foo',{
    bar:{
        type:DataTypes.DATETIME,
        defaultValue: DataTypes.NOW
        // This way, the current date/time will be used to populate this column (at the moment of insertion)
    }
})
*/
//DataTypes--
/**e.g.
 const {DataTypes}= require("sequelize"); //Import the built-in data types
 */
// Strings--
/**
 * DataTypes.STRING     //VARCHAR(255)
 * DataTypes.STRING(1234)   //VARCHAR(1234)
 * DataTypes.STRING.BINARY  //VARCHAR BINARY
 * DataTypes.TEXT           //TEXT
 * DataTypes.TEXT('tiny')   //TINYTEXT
 * 
 */
// Boolean
/**DataTypes.BOOLEAN    //TINYINT(1) */
//Numbers
/**
 * DataTypes.INTEGER    //INTEGER
 * DataTypes.BIGINT     //BIGINT
 * DataTypes.BIGINT(11) //BIGINT(11)
 * 
 * DataTypes.FLOAT      //FLOAT
 * DataTypes.FLOAT(11)  //FLOAT(11)
 * DataTypes.FLOAT(11, 10)  //FLOAT(11, 10)
 * 
 * DataTypes.REAL       //REAL
 * DataTypes.REAL(11)   //REAL(11)
 * 
 * DataTypes.DOUBLE     //DOUBLE
 * DataTypes.DOUBLE(11) //DOUBLE(11)
 * DataTypes.DOUBLE(11,10)
 * 
 * DataTypes.DECIMAL
 * DataTypes.DECIMAL(10, 2)
 */

// Unsigned and Zerofill integers - MySQL/MariaDB Only
/**
 * DataTypes.INTEGER.UNSIGNED
 * DataTypes.INTEGER.ZEROFILL
 * DataTypes.INTEGER.UNSIGNED.ZEROFILL
 */
//Dates
/**
 * DataTypes.DATE
 * DataTypes.DATE(6)    // DATETIME(6) fractional seconds support with up to 6 digits of precision
 * DataTypes.DATEONLY 
 *  */
//UUIDs
/**
 * {
 * type: DataTypes.UUID,
 * defaultValue: DataTypes.UUIDV4 //Or DataTypes.UUIDV1
 * }
 */

// Column Options
/**
 * const {Model, DataTypes, Deferrable} = require("sequelize");
 * 
 * class Foo extends Model{}
 * Foo.init({
 * // instantiating will automatically set the flag to true if not set
 * flag:{type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
 * //default values for date => current time
 * myDate:{type: DateTypes.DATE, defaultValue: DateTypes.NOW},
 * 
 * // setting allowNull to false will add NOT NULL to the column, which means an error will be
 * // thrown from the DB when the query is executed if the column is null. If you want to check that a value
 * // is not null before querying the DB, look at the validations section below.
 * title: {type: DataTypes.STRING, allowNull:false},
 * 
 * // Creating two objects with the same value will throw an error. The unique property can be either a 
 * // boolean, or a string. If you provide the same string for multiple columns, they will form a 
 * // composite unique key
 * uniqueOne: {type: DataTypes.STRING, unique:'compositeIndex'},
 * uniqueOne: {type: DataTypes.INTEGER, unique: 'compositeIndex'},
 * 
 * //The unique property is simply a shorthand to create a unique constraint.
 * someUnique:{type:DataTypes.STRING, unique:true},
 * 
 * //Go on reading for further information about primary keys
 * identifier: {type:DataTypes.STRING, primaryKey:true},
 * 
 * // autoincrement can be used to create auto_incrementing integer columns
 * incrementMe: {type:DataTypes.STRING, field:'field_with_underscores'},
 * 
 * //It is possible to create foreign keys:
 * bar_id:{
 * type:DataTypes.INTEGER,
 * references:{
 * //This is a reference to another model
 * model:Bar,
 * //This is the column name of the referenced model
 * key:'id',
 * //Comments can only be added to columns in MySQL, MariaDB, PostgreSQL, MSSQL
 * commentMe:{
 * type:DataTypes.INTEGER,
 * comment:'This is a column name that has a comment'
 * }
 * },{
 * sequelize,
 * modelName:'foo',
 * //Using `unique: true` in an attribute above is exactly the same as creating the index in the model's options;
 * indexes:[{unique: true, fields:['someUnique']}]
 * } 
 *
 * } 
 *
 * })
 */

// Taking advantage of model being classes
/**
 * class User extends Model{
 * static classLevelMethod(){
 * return 'foo';
 * }
 * instanceLevelMethod(){
 * return 'bar';
 * }
 * getFullname(){
 * return [this.firstname, this.lastname].json(' ');
 * }
 * }
 * User.init({
 * firstname:Sequelize.TEXT,
 * lastname:Sequelize.TEXT
 * },{sequelize});
 * 
 * console.log(User.classLevelMethod()); //'foo'
 * const user = User.build({firstname: 'Jane', lastname: 'Doe'});
 * console.log(user.instanceLevelMethod()); //'bar'
 * console.log(user.getFullName());     // 'Jane Doe'
 */