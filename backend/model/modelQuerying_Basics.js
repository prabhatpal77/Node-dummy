// Simple INSERT queries

const sequelize = require("sequelize");
const { Model } = require("sequelize/types");
const { UPSERT, SELECT } = require("sequelize/types/query-types");

//e.g. create a new user
const jane = await UPSERT.create({firstName:"Jane", lastName:"Doe"});
console.log("Jane's auto generated ID:", jane.id);

const user = await User.create({
    username:'alice123',
    isAdmin: true
},{
    fields:['username']
});
//let's assume the default of isAdmin is false
console.log(user.username); //'alice123'
console.log(user.isAdmin); // false

//Simple SELECT queries
//find all users
const users = await User.findAll();
console.log(users.every(user=>user instanceof User)); //true
console.log("All users:", JSON.stringify(users, null, 2));
SELECT * FROM ...

//Specifying attributes for SELECT queries
Model.findAll({
    attributes:['foo','bar']
});
SELECT foo, bar, FROM ...
//Attributes can be renamed using a nested array:
Model.findAll({
    attributes:['foo',['bar','baz'],'qux']
});
SELECT foo, bar AS baz, qux FROM...
// You can use sequelize.fn to do aggregations
Model.findAll({
    attributes:[
        'foo',
        [sequelize.fn('COUNT', sequelize.col('hats')), 'n_hats'],
        'bar'
    ]
});
SELECT foo, COUNT(hats) AS n_hats, bar FROM...

//This is a tiresome way of getting the number of hats (along with every column)
Model.findAll({
    attributes:[
        'id','foo','bar','baz','qux','hats', //We had to list all attribues...
        [sequelize.fn('COUNT',sequelize.col('hats')),'n_hats'] //To add the aggregation...
    ]
});

//This is shorter, and less error prone because it still works if you add/remove attributes from your model leter
Model.findAll({
    attributes:{
        include:[
            [sequelize.fn('COUNT', sequelize.col('hats')),'n_hats']
        ]
    }
});
SELECT id, foo, bar, qux, hats, COUNT(hats) AS n_hats FROM...

// Similer, it's also possible to remove a selected few attributes:
Model.findAll({
    attributes:{exclude:['baz']}
});
//--Assuming all colums are 'id', 'foo', 'bar', 'baz', and 'qux'
SELECT id, foo, bar,qux FROM...

//Applying WHERE clauses
//The where option is used to filter the query. There are lots of operators to use for the where clause, available as Symbols from Op.
//The basics
Post.findAll({
    where:{
        authorId:2
    }
});
//Select * from post where authorId=2;

//Op eq--equal
const {Op} = require("sequelize");
Post.findAll({
    where:{
        authorId:{
            [Op.eq]:2
        }
    }
});
//SELECT * FROM post WHERE authorId = 2;

//Multiple checks can be passed:
Post.findAll({
    where:{
        authorId:12,
        status:'active'
    }
});
//SELECT*FROM post WHERE authorId = 12 AND status = 'active';

//Op AND
const {Op} = require("sequelize");
Post.findAll({
    where:{
        [Op.and]: [
            {authorId:12},
            {status:'active'}
        ]
    }
});
//SELECT* from post where authorId =12 and status = 'active';

//Op OR
