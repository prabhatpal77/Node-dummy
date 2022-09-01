const {Sequelize, Model, DataTypes} = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

const User = sequelize.define("user",{
    name:DataTypes.TEXT,
    favoriteColor:{
        type: DataTypes.TEXT,
        defaultValue:'green'
    },
    age:DataTypes.INTEGER,
    cash:DataTypes.INTEGER
});
(async()=>{
    await sequelize.sync({force:true});
    // code here;
})();

//Creating an instance
//Although a model is a class, you should nat create instances by using the new operator directly. Instead, the build method should be used.
const jane=User.build({name:"Jane"});
console.log(jane instanceof User); // ture
console.log(jane.name); //"jane"

// the save method should be used.
await jane.save();
console.log('Jane was saved to the database!');
// save is an asynchronous method. build is one of the very few exceptions.

// A very useful shortcut: the create method
const jane2=await User.create({name:"Jane"});
// Jane2 exists in the database now
console.log(jane instanceof User);  //ture
console.log(jane.name); //"Jane"

// Nate: logging instances
const jane3= await User.create({name:"Jane"});
//console.log(jane); //don't do this
console.log(jane.toJSON()); // this is good!
console.log(JSON.stringify(jane, null, 4)); //This is also good

// Default values
const jane4=User.build({name:"Jane"});
console.log(jane.favoriteColor);    //"green"

// Updating an instance
const jane5 = await User.create({name:"Jane"});
console.log(jane5.name); //"jane"
jane5.name="Ada";
// the name is still "jane" in the database
await jane.save();
// Now the name was updated to "Ada" in the database!

// update several fields at once with the set method
jane.set({
    name:"Ada",
    favoriteColor:"blue"
});
// As above, the database still has "Jane" and "green"
await jane.save();
// The database naow has "Ada" and "blue" for name and favorite color

//If you want to update a specific set of fields, you can use update.
const jane7= await User.create({name:"jane7"});
jane7.favoriteColor="blue"
await jane7.update({name:"Ada"})
// The database now has "Ada" for name, but still has the default "green" for favorite color 
await jane.save()
// Now the database has "Ada" for name and "blue" for favorite color

// Deleting an instance
// You can delete an instance by calling destroy:
const jane8 = await User.create({name:"Jane"});
console.log(jane.name); //"Jane"
await jane.destroy();
// Now this entry was removed from the database

// Reloading an instance
//reload
const jane9 = await User.create({name:"jane"});
console.log(jane.name); //"jane"
jane.name="Ada";
// the name is still "Jane" in the database
await jane.reload();
console.log(jane.name); //"Jane"
// The reload call generates a SELECT query to get the up to date data from the database

//Saving only some fields
const jane10 = await User.create({name:"Jane"});
console.log(jane.name);
console.log(jane.favoriteColor);
jane.name ="Jane II";
jane.favoriteColor = "blue"
await jane.save({fields:['name']});
console.log(jane.name);
console.log(jane.favoriteColor);
// the above printed blue because the local object has it set to blue, but in the database it is still "green"
await jane.reload();
console.log(jane.name);
console.log(jane.favoriteColor);

// Change-awareness of save

// Incrementing and decrementing integer values
const jane11 = await User.create({name:"jane", age:100});
const incrementResult = await jane.increment('age',{by:2});
// Increment multiple fields at once
const jane12 = await User.create({name:"Jane", age:100, cash:5000});
await jane12.increment({
'age':2,
'cash':100
});
//If the values are incremented by the some amount, you can use this other syntax as well:
await jane.increment(['age','cash'],{by:2});
