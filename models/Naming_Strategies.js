// Naming Strategies
// The underscore option
/**
 const User = sequelize.define('user', { username: Sequelize.STRING }, {
  underscored: true
});
const Task = sequelize.define('task', { title: Sequelize.STRING }, {
  underscored: true
});
User.hasMany(Task);
Task.belongsTo(User);

Without the underscored option, Sequelize would automatically define:
* A createdAt attribute for each model, pointing to a column named createdAt in each table
* An updatedAt attribute for each model, pointing to a column named updatedAt in each table
* A userId attribute in the Task model, pointing to a column named userId in the task table
 
With the underscored option enabled, Sequelize will instead define:
* A createdAt attribute for each model, pointing to a column named created_at in each table
* An updatedAt attribute for each model, pointing to a column named updated_at in each table
* A userId attribute in the Task model, pointing to a column named user_id in the task table

// calling sync() on the above code will generate the following:
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL,
  "username" VARCHAR(255),
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "tasks" (
  "id" SERIAL,
  "title" VARCHAR(255),
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  "user_id" INTEGER REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  PRIMARY KEY ("id")
);
*/

// Singular vs Plural
/**
 // When defining the model
 Models should be defined with the singular form of a word. Example:
 sequelize.define('foo', { name: DataTypes.STRING });
 Above, the model name is foo (singular), and the respective table name is foos, 
 since Sequelize automatically gets the plural for the table name.

// When defining a reference key in a model
sequelize.define('foo', {
  name: DataTypes.STRING,
  barId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "bars",
      key: "id"
    },
    onDelete: "CASCADE"
  },
});


// When retrieving data from eager loading
// Assuming Foo.hasMany(Bar)
const foo = Foo.findOne({ include: Bar });
// foo.bars will be an array
// foo.bar will not exist since it doens't make sense
// Assuming Foo.hasOne(Bar)
const foo = Foo.findOne({ include: Bar });
// foo.bar will be an object (possibly null if there is no associated model)
// foo.bars will not exist since it doens't make sense
// And so on.

//Overriding singulars and plurals when defining aliases
// When defining an alias for an association, instead of using simply { as: 'myAlias' }, 
you can pass an object to specify the singular and plural forms:
Project.belongsToMany(User, {
  as: {
    singular: 'líder',
    plural: 'líderes'
  }
});

// If you know that a model will always use the same alias in associations, 
you can provide the singular and plural forms directly to the model itself:
const User = sequelize.define('user', { /* ... * }, {
    name: {
        singular: 'líder',
        plural: 'líderes',
      }
    });
    Project.belongsToMany(User);

    // Example of possible mistake
Invoice.belongsTo(Subscription, { as: 'TheSubscription' });
Subscription.hasMany(Invoice);

// Fixed example
Invoice.belongsTo(Subscription, { as: 'TheSubscription', foreignKey: 'subscription_id' });
Subscription.hasMany(Invoice, { foreignKey: 'subscription_id' });
 */

