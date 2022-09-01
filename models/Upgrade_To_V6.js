// Upgrade to V6
// Support for node 10 and up
//CLS
/**
 const cls = require("cls-hooked");
const namespace = cls.createNamespace("....");
const Sequelize = require("sequelize");

Sequelize.useCLS(namespace);
 */

//Database engine support
//We have updated our minimum supported database engine versions. Using older database engine will show SEQUELIZE0006 deprecation warning. 
//Please check the releases page for the version table.

//Sequelize
/**
* Bluebird has been removed. Internally all methods are now using async/await. Public API now returns native promises. 
  Thanks to Andy Edwards for this refactor work.
* Sequelize.Promise is no longer available.
* sequelize.import method has been removed. CLI users should update to sequelize-cli@6.
* All instances of QueryInterface and QueryGenerator have been renamed to their lowerCamelCase variants 
  eg. queryInterface and queryGenerator when used as property names on Model and Dialect, the class names remain the same.
 */

  //Model
  /**
   * options.returning
   * Model.changed()
   const instance = await MyModel.findOne();

instance.myJsonField.someProperty = 12345; // Changed from something else to 12345
console.log(instance.changed()); // false

await instance.save(); // this will not save anything

instance.changed("myJsonField", true);
console.log(instance.changed()); // ['myJsonField']

await instance.save(); // will save

    * Model.bulkCreate()
    * Model.upsert()
    const [instance, created] = await MyModel.upsert({});

    //QueryInterface
    * addConstraint
   */
