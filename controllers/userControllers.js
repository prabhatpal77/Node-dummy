const { response } = require('express');
const { Sequelize, op, QueryTypes } = require('sequelize/types');
var db = require('../models/student');
const Users = db.users;

// query Interface- write a command to create table, insert, delete or many operation using query interface.
const queryInterface = sequelize.getQueryInterface();

var queryInterfaceData= async(req, resp)=>{
    queryInterface.createTable('avon',{
        queryInterface.createTable('avon','email',{
            type:sequelize.DataTypes.STRING
        })
        
    })
    let data ='Query Interface'

    // Alter
    queryInterface.changeColumn('avon','email',{
        type:DataTypes.STRING,
        defaultValue:'test@gmail.com'
    })
}

// Hooks- If sequelize operation is about to execute and you want to perform any action before or after the operation
// before create,  after create
// before validate, after validate
// before delete, after delete
// defore update, after update
var hooks = async(req, resp)=>{
    let data = 'hooks';
    resp.status(200).json(data);
}

// Transactions- If does not heppen final commit it will rollback complete transaction
var transaction = async(req, resp)=>{
    const t= await sequelize.transaction();
    try{
        const user =  await Users.create({name:'Raja',email:'raja@gmail.com',gender:'male'},{
            transaction:t
        });
        console.log("commit");
        t.commit();
    }catch(e){
        console.log("rollback");
        t.rollback();
    }
    resp.status(200).json('ok');
}

// oneToOne polymorphic
var polymorphic = async(req, resp)=>{

}

// lazy loading & eager loading
// lazy loading
let data10 = await Users.findOne({Where:{id:8}});
let postdata = await data.getPosts();
let response = {
    users:data,
    posts:postdata
}
// Eager loading
let data11 = await Users.findOne({
    where:{id:8}
}) 
let response2={
users:data,
}

var scope = async(req, resp)=>{
    let data = await Users.scope('checkStatus').findAll({});
    resp.status(200).json(data);
}

var manyToMany = async(req, resp)=>{

}

var oneToOne = async(req, resp)=>{
    let data = await Users.findAll({include:posts,
    where:{id:8}});
    resp.status(200).json(data);
}

var rawQuery = async(req, resp)=>{
    const users = await db.sequelize.query("Select * from users",{
        type:QueryTypes.SELECT
    });
    let response={
        data:'Raw Query', record:users
    }
    resp.status(200).json(response);
}

var setterGetter = (req,resp)=>{
    let data = await Users.create({name:'mahesh',email:'mahesh@gmail.com',gender:'male'});
    let response = {

    
    data:'setter-getter'
    }
    resp.status(200).json(response);
}

var validationCount = async(req, resp)=>{
    try{
    let data = await Users.create({name:'Test',email:'done', gender:'male'});
    }catch(e){
        console.log(e);
        const message={};
        e.errors.forEach((error) => {
            let message;
            switch(error.validatorKey){
                case 'not_unique:message=DuplicateEmail';
                break;
            }
            message[error.path]=message;
            console.log(error.not_unique);
            
        });
    }
    let response = {
        data:'me'
    }
    resp:status(200).json(response);
    
}

var finderData = async(req, resp)=>{
    let data = await Users.findAll({});
    let data2 = await Users.findOne({});
    let data3 = await Users.findByPk(4);
    let data4 = await Users.findAndCountAll({
        where:{
            email:'first2@gmail.com'
        }
    });
    let data5 = await Users.findOrCreate({
        where:{name='dummy'},
        defaults:{
            email:'dummy@gmail.com',
            gender:'male'
        }
    }) ;

    let response = {
        data:'finder'
    }
}

var queryData = async(req, resp) => {
    let data = await Users.create({name:'demolast', email:'demo14@gmail.com', gender:'male'},{
        fields:['email','gender']
    });

    //select
    let data2 = await Users.findAll({
        attributes:[
            'name',
            ['email','emailID'],
            'gender',
            [Sequelize.fn('const',Sequelize.col('email')),'emailCount']
        ]

    //include-exclude-

    })
}
let data = await Users.findAll({
    attributes:{exclude:['create_at','modified_at']},
    include:[
        [Sequelize.fn('CONCAT',Sequelize.col('name'),'Singh'),'fullName']
    ]
});
// condition
let data9 = await Users.findAll({
    where:{
        id:2
    }
});
// To use the operator
const {Sequelize, op} = require('sequelize');
const posts = require('../models/posts');
const sequelize = require('sequelize');
id:{
    [op.eq]:2

}
email:{
    [op.eq]:'demo@gmail.com'
}
var crudOperation = (req,resp)=>{
    
    // Insert 
    let data3 = await Users.create({name:'demolast', email:'demo14@gamil.com'});
    console.log(data.id);

    // Update 
    let data4 = await Users.update({name:'final', email:'final@gmail.com'},{
        where:{
            id:2
        }
    });

    // Delete
    let data5 = await Users.destroy({
        where:{
            id:2
        }
    });

    //truncate
    let data6 = await Users.destroy({
        truncate:true
    })

    // bulk Insert
    let data7 = await Users.bulkCreate([
        {name:'first', email:'first@gmail.com', gender:'male'},
        {name:'first2', email:'first2@gmail.com', gender:'male'},
        {name:'first3', email:'first3@gmail.com', gender:'male'},
        {name:'first4', email:'first4@gmail.com', gender:'male'},
        {name:'first5', email:'first5@gmail.com', gender:'male'},
    ])

    // find
    let data8 = await Users.findAll({});
    let response = {
        data:'ok'
    }
    resp.status(200).json(response);
}
var addUser = async(req,resp)=>{

    //insert
    let data = await Users.build({name:'Test',email:'test2@gmail.com'});
    await data.save();
    let data2 = await Users.create({name:'demolast',email:'demo14@gmail.com'});
    await data2.save();
   
    //update 
    /* data.name = 'dummy';
    data.save(); */
   
    // delete
    /*data.destroy();
    console.log(data.dataValues);
    */
   //reload
   data.reload(); 
   //data.save();
   let response = {
    data:'ok'
   }
   resp.status(200).json(response);
}
module.exports = {
    oneToOne,
    addUser
}
