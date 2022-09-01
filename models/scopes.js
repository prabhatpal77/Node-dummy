// Scopes
// Scopes are used to help you reuse code. You can define commonly used queries, specifying options such as where, include, limit, etc.
// Definition
/**
 * Scopes are defined in the model definition and can be finder objects, or functions returning finder objects - 
 * except for the default scope, which can only be an object:
class Project extends Model {}
Project.init({
  // Attributes
}, {
  defaultScope: {
    where: {
      active: true
    }
  },
  scopes: {
    deleted: {
      where: {
        deleted: true
      }
    },
    activeUsers: {
      include: [
        { model: User, where: { active: true } }
      ]
    },
    random() {
      return {
        where: {
          someNumber: Math.random()
        }
      }
    },
    accessLevel(value) {
      return {
        where: {
          accessLevel: {
            [Op.gte]: value
          }
        }
      }
    },
    sequelize,
    modelName: 'project'
  }
});

* You can also add scopes after a model has been defined by calling YourModel.addScope
//The default scope is always applied. This means, that with the model definition above, 
  Project.findAll() will create the following query:
SELECT * FROM projects WHERE active = true

//The default scope can be removed by calling .unscoped(), .scope(null), or by invoking another scope:
await Project.scope('deleted').findAll(); // Removes the default scope
SELECT * FROM projects WHERE deleted = true

// The `activeUsers` scope defined in the example above could also have been defined this way:
Project.addScope('activeUsers', {
  include: [
    { model: User.scope('active') }
  ]
});
*/

//Usage
/**
 * Scopes are applied by calling .scope on the model definition, passing the name of one or more scopes. 
 * .scope returns a fully functional model instance with all the regular methods: 
 * .findAll, .update, .count, .destroy etc. You can save this model instance and reuse it later:

const DeletedProjects = Project.scope('deleted');
await DeletedProjects.findAll();
// The above is equivalent to:
await Project.findAll({
  where: {
    deleted: true
  }
});

*Scopes which are functions can be invoked in two ways. If the scope does not take any arguments it can be invoked as normally. 
 If the scope takes arguments, pass an object:

 await Project.scope('random', { method: ['accessLevel', 19] }).findAll();

 //Generated SQL:
 SELECT * FROM projects WHERE someNumber = 42 AND accessLevel >= 19

 */

 // Merging
 /**
  * Several scopes can be applied simultaneously 
  * by passing an array of scopes to .scope, or by passing the scopes as consecutive arguments.
// These two are equivalent
await Project.scope('deleted', 'activeUsers').findAll();
await Project.scope(['deleted', 'activeUsers']).findAll();

// Generated SQL:
SELECT * FROM projects
INNER JOIN users ON projects.userId = users.id
WHERE projects.deleted = true
AND users.active = true

// If you want to apply another scope alongside the default scope, pass the key defaultScope to .scope:
await Project.scope('defaultScope', 'deleted').findAll();

//Generated SQL:
SELECT * FROM projects WHERE active = true AND deleted = true

// When invoking several scopes, keys from subsequent scopes will overwrite previous ones (similarly to Object.assign),
// except for where and include, which will be merged. Consider two scopes:

YourModel.addScope('scope1', {
  where: {
    firstName: 'bob',
    age: {
      [Op.gt]: 20
    }
  },
  limit: 2
});
YourModel.addScope('scope2', {
  where: {
    age: {
      [Op.lt]: 30
    }
  },
  limit: 10
});

//Using .scope('scope1', 'scope2') will yield the following WHERE clause:
WHERE firstName = 'bob' AND age < 30 LIMIT 10

//For instance, if YourModel was initialized as such:
YourModel.init({ /* attributes * }, {
  // ... other init options
  whereMergeStrategy: 'and',
});

//Using .scope('scope1', 'scope2') will yield the following WHERE clause:
WHERE firstName = 'bob' AND age > 20 AND age < 30 LIMIT 10

//The same merge logic applies when passing a find object directly to findAll (and similar finders) on a scoped model:

Project.scope('deleted').findAll({
  where: {
    firstName: 'john'
  }
})

//Generated where clause:

WHERE deleted = true AND firstName = 'john'

  */

//Merging includes
//Consider the models Foo, Bar, Baz and Qux, with One-to-Many associations as follows:
/**
 const Foo = sequelize.define('Foo', { name: Sequelize.STRING });
const Bar = sequelize.define('Bar', { name: Sequelize.STRING });
const Baz = sequelize.define('Baz', { name: Sequelize.STRING });
const Qux = sequelize.define('Qux', { name: Sequelize.STRING });
Foo.hasMany(Bar, { foreignKey: 'fooId' });
Bar.hasMany(Baz, { foreignKey: 'barId' });
Baz.hasMany(Qux, { foreignKey: 'bazId' });

//Now, consider the following four scopes defined on Foo:

Foo.addScope('includeEverything', {
  include: {
    model: Bar,
    include: [{
      model: Baz,
      include: Qux
    }]
  }
});

Foo.addScope('limitedBars', {
  include: [{
    model: Bar,
    limit: 2
  }]
});

Foo.addScope('limitedBazs', {
  include: [{
    model: Bar,
    include: [{
      model: Baz,
      limit: 2
    }]
  }]
});

Foo.addScope('excludeBazName', {
  include: [{
    model: Bar,
    include: [{
      model: Baz,
      attributes: {
        exclude: ['name']
      }
    }]
  }]
});

//These four scopes can be deeply merged easily, for example by calling Foo.scope
//('includeEverything', 'limitedBars', 'limitedBazs', 'excludeBazName').findAll(), 
//which would be entirely equivalent to calling the following:
await Foo.findAll({
  include: {
    model: Bar,
    limit: 2,
    include: [{
      model: Baz,
      limit: 2,
      attributes: {
        exclude: ['name']
      },
      include: Qux
    }]
  }
});

// The above is equivalent to:
await Foo.scope([
  'includeEverything',
  'limitedBars',
  'limitedBazs',
  'excludeBazName'
]).findAll();


 */