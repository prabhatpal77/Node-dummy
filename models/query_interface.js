// Query Interface --
//The methods from the query interface are therefore lower-level methods; 
//you should use them only if you do not find another way to do it with higher-level APIs from Sequelize. 
// Obtaining the query interface--
/**
 * From now on, we will call queryInterface the singleton instance of the QueryInterface class, 
 * which is available on your Sequelize instance:
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(/* ... *);
const queryInterface = sequelize.getQueryInterface();
 */

//Creating a table--
/**
 queryInterface.createTable('Person', {
  name: DataTypes.STRING,
  isBetaMember: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
});

//Generated SQL (using SQLite):
CREATE TABLE IF NOT EXISTS `Person` (
  `name` VARCHAR(255),
  `isBetaMember` TINYINT(1) NOT NULL DEFAULT 0
);
//Consider defining a Model instead and calling YourModel.sync() instead, which is a higher-level approach.
 */

//Adding a column to a table
/**
 queryInterface.addColumn('Person', 'petName', { type: DataTypes.STRING });
 //Generated SQL (using SQLite):
ALTER TABLE `Person` ADD `petName` VARCHAR(255);
 */

//Changing a datatype of a column--
/**
 queryInterface.changeColumn('Person', 'foo', {
  type: DataTypes.FLOAT,
  defaultValue: 3.14,
  allowNull: false
});

//Generated SQL (using MySQL):
ALTER TABLE `Person` CHANGE `foo` `foo` FLOAT NOT NULL DEFAULT 3.14;
 */

//Removing a column--
/**
 queryInterface.removeColumn('Person', 'petName', { /* query options * });
 //Generated SQL (using PostgreSQL):
 ALTER TABLE "public"."Person" DROP COLUMN "petName";
 */

 //Changing and removing columns in SQLite
 /**
  // Assuming we have a table in SQLite created as follows:
queryInterface.createTable('Person', {
  name: DataTypes.STRING,
  isBetaMember: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  petName: DataTypes.STRING,
  foo: DataTypes.INTEGER
});

// And we change a column:
queryInterface.changeColumn('Person', 'foo', {
  type: DataTypes.FLOAT,
  defaultValue: 3.14,
  allowNull: false
});

// The following SQL calls are generated for SQLite:
PRAGMA TABLE_INFO(`Person`);

CREATE TABLE IF NOT EXISTS `Person_backup` (
  `name` VARCHAR(255),
  `isBetaMember` TINYINT(1) NOT NULL DEFAULT 0,
  `foo` FLOAT NOT NULL DEFAULT '3.14',
  `petName` VARCHAR(255)
);

INSERT INTO `Person_backup`
  SELECT
    `name`,
    `isBetaMember`,
    `foo`,
    `petName`
  FROM `Person`;

DROP TABLE `Person`;

CREATE TABLE IF NOT EXISTS `Person` (
  `name` VARCHAR(255),
  `isBetaMember` TINYINT(1) NOT NULL DEFAULT 0,
  `foo` FLOAT NOT NULL DEFAULT '3.14',
  `petName` VARCHAR(255)
);

INSERT INTO `Person`
  SELECT
    `name`,
    `isBetaMember`,
    `foo`,
    `petName`
  FROM `Person_backup`;

DROP TABLE `Person_backup`;
  */

//Others
//As mentioned in the beginning of this guide, there is a lot more to the Query Interface available in Sequelize! 
//Check the QueryInterface API for a full list of what can be done.