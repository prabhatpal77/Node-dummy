//Op OR
const {Op} = require("sequelize");
Post.findAll({
    where:{
        [op.OR]:[{
            authorId:12
        },
    {
        authorId:13
    }]
    }
});
// Select * from Post where authorId =12 OR authorId=13

//Op OR 2-
/*
const {Op} = require("sequelize");
Post.destroy({
    where:{
        authorId:{
            [Op.or]:[12,13]
        }
    }
})
*/

// Operators
/*
const {Op}=require("sequelize");
Post.findAll({
    where:{
        [Op.and]:[{a:5},{b:6}],     //(a=5) and (b=6)
        [Op.or]:[{a:5},{b:6}],      //(a=5) and (b=6)
        SomeAttributes:{
            //Basic

            [Op.eq]: 3,                              // = 3
            [Op.ne]: 20,                             // != 20
            [Op.is]: null,                           // IS NULL
            [Op.not]: true,                          // IS NOT TRUE
            [Op.or]: [5, 6],                         // (someAttribute = 5) OR (someAttribute = 6)

            // Using dialect specific column indetifiers (PG in the following e.g.)
            [Op.col]: 'user.organization_id',       //="user"."organization_id"

            // Number comparisons
            [Op.gt]: 6,                              // > 6
            [Op.gte]: 6,                             // >= 6
            [Op.lt]: 10,                             // < 10
            [Op.lte]: 10,                            // <= 10
            [Op.between]: [6, 10],                   // BETWEEN 6 AND 10
            [Op.notBetween]: [11, 15],               // NOT BETWEEN 11 AND 15

            // Other operators

            [Op.all]: sequelize.literal('SELECT 1'), // > ALL (SELECT 1)

            [Op.in]: [1, 2],                         // IN [1, 2]
            [Op.notIn]: [1, 2],                      // NOT IN [1, 2]

            [Op.like]: '%hat',                       // LIKE '%hat'
            [Op.notLike]: '%hat',                    // NOT LIKE '%hat'
            [Op.startsWith]: 'hat',                  // LIKE 'hat%'
            [Op.endsWith]: 'hat',                    // LIKE '%hat'
            [Op.substring]: 'hat',                   // LIKE '%hat%'
            [Op.iLike]: '%hat',                      // ILIKE '%hat' (case insensitive) (PG only)
            [Op.notILike]: '%hat',                   // NOT ILIKE '%hat'  (PG only)
            [Op.regexp]: '^[h|a|t]',                 // REGEXP/~ '^[h|a|t]' (MySQL/PG only)
            [Op.notRegexp]: '^[h|a|t]',              // NOT REGEXP/!~ '^[h|a|t]' (MySQL/PG only)
            [Op.iRegexp]: '^[h|a|t]',                // ~* '^[h|a|t]' (PG only)
            [Op.notIRegexp]: '^[h|a|t]',             // !~* '^[h|a|t]' (PG only)

            [Op.any]: [2, 3],                        // ANY (ARRAY[2, 3]::INTEGER[]) (PG only)
            [Op.match]: Sequelize.fn('to_tsquery', 'fat & rat') // match text search for strings 'fat' and 'rat' (PG only)

            // In Postgres, Op.like/Op.iLike/Op.notLike can be combined to Op.any:
            [Op.like]: { [Op.any]: ['cat', 'hat'] }  // LIKE ANY (ARRAY['cat', 'hat'])

            // There are more postgres-only range operators, see below

            //Shorthand Syntax for Op.in
            //Passing an array directly to the where option will implicitly use the IN operator
            /**
             post.findAll({
                where:{
                    id:[1,2,3]  //some as using `id:{[Op.in]:[1,2,3]}`
                }
             });
             // Select ... from "posts" AS "post" Where "post"."id" IN (1,2,3);

             //Logical combinations with operators
             The operators Op.and, Op.or and Op.not can be used to create arbitrarily complex nested logical comparisons.

                Examples with Op.and and Op.or
                const { Op } = require("sequelize");

                Foo.findAll({
                where: {
                rank: {
                [Op.or]: {
                [Op.lt]: 1000,
                [Op.eq]: null
                }
                    },
                // rank < 1000 OR rank IS NULL

                {
                createdAt: {
                [Op.lt]: new Date(),
                [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000)
                }
                },
                // createdAt < [timestamp] AND createdAt > [timestamp]

                {
                [Op.or]: [
                {
                title: {
                [Op.like]: 'Boat%'
                }
                },
                {
                description: {
                [Op.like]: '%boat%'
                }
                }
                ]
                }
                // title LIKE 'Boat%' OR description LIKE '%boat%'
                }
                });
                }
                }
                });
                }
                }
                })
                
                // Example with Op.not
                Project.findAll({
                where: {
                name: 'Some Project',
                [Op.not]: [
                { id: [1,2,3] },
                {
                description: {
                [Op.like]: 'Hello%'
                }
                }
                ]
                }
                });
                // the above will generated
                //The above will generate:
                // SELECT * FROM `Projects` WHERE ( `Projects`.`name` = 'Some Project' AND NOT ( `Projects`.`id` IN (1,2,3) AND `Projects`.`description` LIKE 'Hello%'
  )
)
                
                */

// Advance queries with functions (not just columns)
// What if you wanted to obtain something like WHERE char_length("content")=7?
/*
Post.findAll({
  where: sequelize.where(sequelize.fn('char_length', sequelize.col('content')), 7)
});
// SELECT ... FROM "posts" AS "post" WHERE char_length("content") = 7

//Something more complex
Post.findAll({
  where: {
    [Op.or]: [
      sequelize.where(sequelize.fn('char_length', sequelize.col('content')), 7),
      {
        content: {
          [Op.like]: 'Hello%'
        }
      },
      {
        [Op.and]: [
          { status: 'draft' },
          sequelize.where(sequelize.fn('char_length', sequelize.col('content')), {
            [Op.gt]: 10
          })
        ]
      }
    ]
  }
});
// The above generated SQL is
SELECT
  ...
FROM "posts" AS "post"
WHERE (
  char_length("content") = 7
  OR
  "post"."content" LIKE 'Hello%'
  OR (
    "post"."status" = 'draft'
    AND
    char_length("content") > 10
  )
)
*/

// Postgre only range operator
/**
[Op.contains]: 2,            // @> '2'::integer  (PG range contains element operator)
[Op.contains]: [1, 2],       // @> [1, 2)        (PG range contains range operator)
[Op.contained]: [1, 2],      // <@ [1, 2)        (PG range is contained by operator)
[Op.overlap]: [1, 2],        // && [1, 2)        (PG range overlap (have points in common) operator)
[Op.adjacent]: [1, 2],       // -|- [1, 2)       (PG range is adjacent to operator)
[Op.strictLeft]: [1, 2],     // << [1, 2)        (PG range strictly left of operator)
[Op.strictRight]: [1, 2],    // >> [1, 2)        (PG range strictly right of operator)
[Op.noExtendRight]: [1, 2],  // &< [1, 2)        (PG range does not extend to the right of operator)
[Op.noExtendLeft]: [1, 2],   // &> [1, 2)        (PG range does not extend to the left of operator) 

 */

//Deprecated operator aliases
/**
 const { Sequelize, Op } = require("sequelize");
const sequelize = new Sequelize('sqlite::memory:', {
  operatorsAliases: {
    $gt: Op.gt
  }
});

// Now we can use `$gt` instead of `[Op.gt]` in where clauses:
Foo.findAll({
  where: {
    $gt: 6 // Works like using [Op.gt]
  }
});
 */

//Simple update queries
/**
 // Change everyone without a last name to "Doe"
await User.update({ lastName: "Doe" }, {
  where: {
    lastName: null
  }
});
 */

//Simple delete query
//Delete query also accept the where option, just like read query shown above
/**
 // Delete everyone named "Jane"
await User.destroy({
  where: {
    firstName: "Jane"
  }
});

//To destroy everything the TRUNCATE SQL can be used:
// Truncate the table
await User.destroy({
  truncate: true
});
 */

//Creating in BULK
//Sequelize provides the Model.bulkCreate method to allow creating multiple records at once, with only one query.
/**
const captains = await Captain.bulkCreate([
  { name: 'Jack Sparrow' },
  { name: 'Davy Jones' }
]);
console.log(captains.length); // 2
console.log(captains[0] instanceof Captain); // true
console.log(captains[0].name); // 'Jack Sparrow'
console.log(captains[0].id); // 1 // (or another auto-generated value) 

//However, by default, bulkCreate does not run validations on each object that is going to be created (which create does). 
//To make bulkCreate run these validations as well, you must pass the validate: true option. This will decrease performance. 
//Usage example:

const Foo = sequelize.define('foo', {
  bar: {
    type: DataTypes.TEXT,
    validate: {
      len: [4, 6]
    }
  }
});

// This will not throw an error, both instances will be created
await Foo.bulkCreate([
  { name: 'abc123' },
  { name: 'name too long' }
]);

// This will throw an error, nothing will be created
await Foo.bulkCreate([
  { name: 'abc123' },
  { name: 'name too long' }
], { validate: true });

//If you are accepting values directly from the user, it might be beneficial to limit the columns that you want to actually insert. 
//To support this, bulkCreate() accepts a fields option, an array defining which fields must be considered (the rest will be ignored).
await User.bulkCreate([
  { username: 'foo' },
  { username: 'bar', admin: true }
], { fields: ['username'] });
// Neither foo nor bar are admins.

 */

// Ordering and Grouping
// Sequelize provides the order and group options to work with ORDER BY and GROUP BY.
// Ordering
/**
 Subtask.findAll({
  order: [
    // Will escape title and validate DESC against a list of valid direction parameters
    ['title', 'DESC'],

    // Will order by max(age)
    sequelize.fn('max', sequelize.col('age')),

    // Will order by max(age) DESC
    [sequelize.fn('max', sequelize.col('age')), 'DESC'],

    // Will order by  otherfunction(`col1`, 12, 'lalala') DESC
    [sequelize.fn('otherfunction', sequelize.col('col1'), 12, 'lalala'), 'DESC'],

    // Will order an associated model's createdAt using the model name as the association's name.
    [Task, 'createdAt', 'DESC'],

    // Will order through an associated model's createdAt using the model names as the associations' names.
    [Task, Project, 'createdAt', 'DESC'],

    // Will order by an associated model's createdAt using the name of the association.
    ['Task', 'createdAt', 'DESC'],

    // Will order by a nested associated model's createdAt using the names of the associations.
    ['Task', 'Project', 'createdAt', 'DESC'],

    // Will order by an associated model's createdAt using an association object. (preferred method)
    [Subtask.associations.Task, 'createdAt', 'DESC'],

    // Will order by a nested associated model's createdAt using association objects. (preferred method)
    [Subtask.associations.Task, Task.associations.Project, 'createdAt', 'DESC'],

    // Will order by an associated model's createdAt using a simple association object.
    [{model: Task, as: 'Task'}, 'createdAt', 'DESC'],

    // Will order by a nested associated model's createdAt simple association objects.
    [{model: Task, as: 'Task'}, {model: Project, as: 'Project'}, 'createdAt', 'DESC']
  ],

  // Will order by max age descending
  order: sequelize.literal('max(age) DESC'),

  // Will order by max age ascending assuming ascending is the default order when direction is omitted
  order: sequelize.fn('max', sequelize.col('age')),

  // Will order by age ascending assuming ascending is the default order when direction is omitted
  order: sequelize.col('age'),

  // Will order randomly based on the dialect (instead of fn('RAND') or fn('RANDOM'))
  order: sequelize.random()
});

Foo.findOne({
  order: [
    // will return `name`
    ['name'],
    // will return `username` DESC
    ['username', 'DESC'],
    // will return max(`age`)
    sequelize.fn('max', sequelize.col('age')),
    // will return max(`age`) DESC
    [sequelize.fn('max', sequelize.col('age')), 'DESC'],
    // will return otherfunction(`col1`, 12, 'lalala') DESC
    [sequelize.fn('otherfunction', sequelize.col('col1'), 12, 'lalala'), 'DESC'],
    // will return otherfunction(awesomefunction(`col`)) DESC, This nesting is potentially infinite!
    [sequelize.fn('otherfunction', sequelize.fn('awesomefunction', sequelize.col('col'))), 'DESC']
  ]
});
// A call to Sequelize.fn (which will generate a function call in SQL)
// A call to Sequelize.col (which will quoute the column name)


//Grouping
Project.findAll({ group: 'name' });
// yields 'GROUP BY name'
 */

//Limits and Pagination
// The limit and offset options allow you to work with limiting / pagination:
/**
 // Fetch 10 instances/rows
Project.findAll({ limit: 10 });

// Skip 8 instances/rows
Project.findAll({ offset: 8 });

// Skip 5 instances and fetch the 5 after that
Project.findAll({ offset: 5, limit: 5 });
 */

//Utility Methods
/* 
// count
console.log(`There are ${await Project.count()} projects`);

const amount = await Project.count({
  where: {
    id: {
      [Op.gt]: 25
    }
  }
});
console.log(`There are ${amount} projects with an id greater than 25`);

//min, max, and sum
// Let's assume we have three users, whose ages are 10, 5, and 40.
await User.max('age'); // 40
await User.max('age', { where: { age: { [Op.lt]: 20 } } }); // 10
await User.min('age'); // 5
await User.min('age', { where: { age: { [Op.gt]: 5 } } }); // 10
await User.sum('age'); // 55
await User.sum('age', { where: { age: { [Op.gt]: 5 } } }); // 50

//increment and decrement
//Let's assume we have a user, whose age is 10.
await User.increment({age: 5}, { where: { id: 1 } }) // Will increase age to 15
await User.increment({age: -5}, { where: { id: 1 } }) // Will decrease age to 5
*/




