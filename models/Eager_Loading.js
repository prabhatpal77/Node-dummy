//In Sequelize, eager loading is mainly done by using the include option on a model finder query (such as findOne, findAll, etc).

// Basic Example
/**
const User = sequelize.define('user', { name: DataTypes.STRING }, { timestamps: false });
const Task = sequelize.define('task', { name: DataTypes.STRING }, { timestamps: false });
const Tool = sequelize.define('tool', {
  name: DataTypes.STRING,
  size: DataTypes.STRING
}, { timestamps: false });
User.hasMany(Task);
Task.belongsTo(User);
User.hasMany(Tool, { as: 'Instruments' });

//Fetch a single associated element
const tasks = await Task.findAll({ include: User });
console.log(JSON.stringify(tasks, null, 2));

// Output
[{
  "name": "A Task",
  "id": 1,
  "userId": 1,
  "user": {
    "name": "John Doe",
    "id": 1
  }
}]

*Fetching all associated alements
const users = await User.findAll({ include: Task });
console.log(JSON.stringify(users, null, 2));
//Output
[{
  "name": "John Doe",
  "id": 1,
  "tasks": [{
    "name": "A Task",
    "id": 1,
    "userId": 1
  }]
}]

*Fetching and aliased association
//If an association is aliased (using the as option), you must specify this alias when including the model.
 Instead of passing the model directly to the include option, you should instead provide an object with two options: model and as.
 const users = await User.findAll({
  include: { model: Tool, as: 'Instruments' }
});
console.log(JSON.stringify(users, null, 2));

//Output
[{
  "name": "John Doe",
  "id": 1,
  "Instruments": [{
    "name": "Scissor",
    "id": 1,
    "userId": 1
  }]
}]

*You can also include by alias name by specifying a string that matches the association alias:
User.findAll({ include: 'Instruments' }); // Also works
User.findAll({ include: { association: 'Instruments' } }); // Also works


 */

//Required Eager loading
/*
*This is done with the required: true
User.findAll({
  include: {
    model: Task,
    required: true
  }
});

*/

//Eager loading filtered at the associated model level
/*
User.findAll({
  include: {
    model: Tool,
    as: 'Instruments'
    where: {
      size: {
        [Op.ne]: 'small'
      }
    }
  }
});

// Generated SQL:
SELECT
  `user`.`id`,
  `user`.`name`,
  `Instruments`.`id` AS `Instruments.id`,
  `Instruments`.`name` AS `Instruments.name`,
  `Instruments`.`size` AS `Instruments.size`,
  `Instruments`.`userId` AS `Instruments.userId`
FROM `users` AS `user`
INNER JOIN `tools` AS `Instruments` ON
  `user`.`id` = `Instruments`.`userId` AND
  `Instruments`.`size` != 'small';

  *Referring to other columns
// Find all projects with a least one task where task.state === project.state
Project.findAll({
  include: {
    model: Task,
    where: {
      state: Sequelize.col('project.state')
    }
  }
})

*Complex where clauses at the top level
User.findAll({
  where: {
    '$Instruments.size$': { [Op.ne]: 'small' }
  },
  include: [{
    model: Tool,
    as: 'Instruments'
  }]
});
//Generated SQL
SELECT
  `user`.`id`,
  `user`.`name`,
  `Instruments`.`id` AS `Instruments.id`,
  `Instruments`.`name` AS `Instruments.name`,
  `Instruments`.`size` AS `Instruments.size`,
  `Instruments`.`userId` AS `Instruments.userId`
FROM `users` AS `user`
LEFT OUTER JOIN `tools` AS `Instruments` ON
  `user`.`id` = `Instruments`.`userId`
WHERE `Instruments`.`size` != 'small';

*For a better understanding of all differences between the inner where option (used inside an include), 
with and without the required option, and a top-level where using the $nested.column$ syntax, below we have four examples for you:
// Inner where, with default `required: true`
await User.findAll({
  include: {
    model: Tool,
    as: 'Instruments',
    where: {
      size: { [Op.ne]: 'small' }
    }
  }
});

// Inner where, `required: false`
await User.findAll({
  include: {
    model: Tool,
    as: 'Instruments',
    where: {
      size: { [Op.ne]: 'small' }
    },
    required: false
  }
});

// Top-level where, with default `required: false`
await User.findAll({
  where: {
    '$Instruments.size$': { [Op.ne]: 'small' }
  },
  include: {
    model: Tool,
    as: 'Instruments'
  }
});

// Top-level where, `required: true`
await User.findAll({
  where: {
    '$Instruments.size$': { [Op.ne]: 'small' }
  },
  include: {
    model: Tool,
    as: 'Instruments',
    required: true
  }
});

//Generated SQL
-- Inner where, with default `required: true`
SELECT [...] FROM `users` AS `user`
INNER JOIN `tools` AS `Instruments` ON
  `user`.`id` = `Instruments`.`userId`
  AND `Instruments`.`size` != 'small';

-- Inner where, `required: false`
SELECT [...] FROM `users` AS `user`
LEFT OUTER JOIN `tools` AS `Instruments` ON
  `user`.`id` = `Instruments`.`userId`
  AND `Instruments`.`size` != 'small';

-- Top-level where, with default `required: false`
SELECT [...] FROM `users` AS `user`
LEFT OUTER JOIN `tools` AS `Instruments` ON
  `user`.`id` = `Instruments`.`userId`
WHERE `Instruments`.`size` != 'small';

-- Top-level where, `required: true`
SELECT [...] FROM `users` AS `user`
INNER JOIN `tools` AS `Instruments` ON
  `user`.`id` = `Instruments`.`userId`
WHERE `Instruments`.`size` != 'small';

*/

//Fetching with RIGHT OUTER JOIN (MySQL, MariaDB, PostgreSQL and MSSQL only)
/**
 * Right is only respected if required is false
 User.findAll({
  include: [{
    model: Task // will create a left join
  }]
});
User.findAll({
  include: [{
    model: Task,
    right: true // will create a right join
  }]
});
User.findAll({
  include: [{
    model: Task,
    required: true,
    right: true // has no effect, will create an inner join
  }]
});
User.findAll({
  include: [{
    model: Task,
    where: { name: { [Op.ne]: 'empty trash' } },
    right: true // has no effect, will create an inner join
  }]
});
User.findAll({
  include: [{
    model: Tool,
    where: { name: { [Op.ne]: 'empty trash' } },
    required: false // will create a left join
  }]
});
User.findAll({
  include: [{
    model: Tool,
    where: { name: { [Op.ne]: 'empty trash' } },
    required: false
    right: true // will create a right join
  }]
});

 */

// Multiple eager loading
/**
 * The include option can receive an array in order to fetch multiple associated models at once:
 Foo.findAll({
  include: [
    {
      model: Bar,
      required: true
    },
    {
      model: Baz,
      where: ...
    },
    Qux // Shorthand syntax for { model: Qux } also works here
  ]
})
 */

//Eager loading with many-to-many realtionship
/**
 * Sequelize will fetch the junction table data as well, by default. For example:
const Foo = sequelize.define('Foo', { name: DataTypes.TEXT });
const Bar = sequelize.define('Bar', { name: DataTypes.TEXT });
Foo.belongsToMany(Bar, { through: 'Foo_Bar' });
Bar.belongsToMany(Foo, { through: 'Foo_Bar' });

await sequelize.sync();
const foo = await Foo.create({ name: 'foo' });
const bar = await Bar.create({ name: 'bar' });
await foo.addBar(bar);
const fetchedFoo = await Foo.findOne({ include: Bar });
console.log(JSON.stringify(fetchedFoo, null, 2));

//Output:
{
  "id": 1,
  "name": "foo",
  "Bars": [
    {
      "id": 1,
      "name": "bar",
      "Foo_Bar": {
        "FooId": 1,
        "BarId": 1
      }
    }
  ]
}

*However, you can specify which attributes you want fetched. 
This is done with the attributes option applied inside the through option of the include. For example:
Foo.findAll({
  include: [{
    model: Bar,
    through: {
      attributes: [ list the wanted attributes here...]
    }
  }]
});


Foo.findOne({
  include: {
    model: Bar,
    through: {
      attributes: []
    }
  }
});

//Output:
{
  "id": 1,
  "name": "foo",
  "Bars": [
    {
      "id": 1,
      "name": "bar"
    }
  ]
}

*you can also apply a filter on the junction table. This is done with the where option applied inside the through option of the include
User.findAll({
  include: [{
    model: Project,
    through: {
      where: {
        // Here, `completed` is a column present at the junction table
        completed: true
      }
    }
  }]
});

//Generated SQL
SELECT
  `User`.`id`,
  `User`.`name`,
  `Projects`.`id` AS `Projects.id`,
  `Projects`.`name` AS `Projects.name`,
  `Projects->User_Project`.`completed` AS `Projects.User_Project.completed`,
  `Projects->User_Project`.`UserId` AS `Projects.User_Project.UserId`,
  `Projects->User_Project`.`ProjectId` AS `Projects.User_Project.ProjectId`
FROM `Users` AS `User`
LEFT OUTER JOIN `User_Projects` AS `Projects->User_Project` ON
  `User`.`id` = `Projects->User_Project`.`UserId`
LEFT OUTER JOIN `Projects` AS `Projects` ON
  `Projects`.`id` = `Projects->User_Project`.`ProjectId` AND
  `Projects->User_Project`.`completed` = 1;

 */

  //Including everything
/**
 * To include all associated models, you can use the all and nested option
 // Fetch all models associated with User
User.findAll({ include: { all: true }});

// Fetch all models associated with User and their nested associations (recursively)
User.findAll({ include: { all: true, nested: true }});

 */

//Including soft deleted record
/**
 * you can do that by setting include.paranoid to false:
 User.findAll({
  include: [{
    model: Tool,
    as: 'Instruments',
    where: { size: { [Op.ne]: 'small' } },
    paranoid: false
  }]
});
 */

// Ordering eager loaded associations
/**
 Company.findAll({
  include: Division,
  order: [
    // We start the order array with the model we want to sort
    [Division, 'name', 'ASC']
  ]
});
Company.findAll({
  include: Division,
  order: [
    [Division, 'name', 'DESC']
  ]
});
Company.findAll({
  // If the include uses an alias...
  include: { model: Division, as: 'Div' },
  order: [
    // ...we use the same syntax from the include
    // in the beginning of the order array
    [{ model: Division, as: 'Div' }, 'name', 'DESC']
  ]
});

Company.findAll({
  // If we have includes nested in several levels...
  include: {
    model: Division,
    include: Department
  },
  order: [
    // ... we replicate the include chain of interest
    // at the beginning of the order array
    [Division, Department, 'name', 'DESC']
  ]
});
*In the case of many-to-many relationships
Company.findAll({
  include: {
    model: Division,
    include: Department
  },
  order: [
    [Division, DepartmentDivision, 'name', 'ASC']
  ]
});

*you have noticed that the order option is used at the top-level. The only situation in which order 
also works inside the include option is when separate: true is used. In that case, the usage is as follows:
// This only works for `separate: true` (which in turn
// only works for has-many relationships).
User.findAll({
  include: {
    model: Post,
    separate: true,
    order: [
      ['createdAt', 'DESC']
    ]
  }
});

*Complex ordering involving sub-queries

 */

//Nested eager loading
/*
const users = await User.findAll({
  include: {
    model: Tool,
    as: 'Instruments',
    include: {
      model: Teacher,
      include: [ /* etc  ]
    }
  }
});
console.log(JSON.stringify(users, null, 2));

//Output
[{
  "name": "John Doe",
  "id": 1,
  "Instruments": [{ // 1:M and N:M association
    "name": "Scissor",
    "id": 1,
    "userId": 1,
    "Teacher": { // 1:1 association
      "name": "Jimi Hendrix"
    }
  }]
}]

*To return all parent instances, you should add required: false.
User.findAll({
  include: [{
    model: Tool,
    as: 'Instruments',
    include: [{
      model: Teacher,
      where: {
        school: "Woodstock Music School"
      },
      required: false
    }]
  }]
});
*/

//Using findAndCountAll with includes
/**
 User.findAndCountAll({
  include: [
    { model: Profile, required: true }
  ],
  limit: 3
});

*Adding a where clause to the include automatically makes it required:
User.findAndCountAll({
  include: [
    { model: Profile, where: { active: true } }
  ],
  limit: 3
});
 */


