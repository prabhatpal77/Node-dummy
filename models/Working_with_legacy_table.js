//Working with Legacy Tables
/**
 // Tables
class User extends Model {}
User.init({
  // ...
}, {
  modelName: 'user',
  tableName: 'users',
  sequelize,
});

//Fields
class MyModel extends Model {}
MyModel.init({
  userId: {
    type: DataTypes.INTEGER,
    field: 'user_id'
  }
}, { sequelize });

// Primary keys
Sequelize will assume your table has a id primary key property by default.
class Collection extends Model {}
Collection.init({
  uid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true // Automatically gets converted to SERIAL for postgres
  }
}, { sequelize });

class Collection extends Model {}
Collection.init({
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true
  }
}, { sequelize });
// And if your model has no primary key at all you can use Model.removeAttribute('id');

// If your model has no primary keys, you need to use the static equivalent of the following instance methods, 
// and provide your own where parameter:
* instance.save: Model.update
* instance.update: Model.update
* instance.reload: Model.findOne
* instance.destroy: Model.destroy
* instance.restore: Model.restore
* instance.decrement: Model.decrement
* instance.increment: Model.increment
 */

//Foreign Keys
/**
 // 1:1
Organization.belongsTo(User, { foreignKey: 'owner_id' });
User.hasOne(Organization, { foreignKey: 'owner_id' });

// 1:M
Project.hasMany(Task, { foreignKey: 'tasks_pk' });
Task.belongsTo(Project, { foreignKey: 'tasks_pk' });

// N:M
User.belongsToMany(Role, { through: 'user_has_roles', foreignKey: 'user_role_user_id' });
Role.belongsToMany(User, { through: 'user_has_roles', foreignKey: 'roles_identifier' });
 */