// Migrations--
// A Migration in Sequelize is a javascript file which exports two functions, up and down, 
// that dictates how to perform the migration and undo it. You define those functions manually,
// but you don't call them manually; they will be called automatically by the CLI.
// In these functions, you should simply perform whatever queries you need, 
// with the help of sequelize.query and whichever other methods Sequelize provides to you

// Installing the CLI-
// npm install --save-dev sequelize-cli

// Project Bootstrapping
// To create an empty project you will need to execute init command
// npx sequelize-cli init
// This will create following folders
/* 
* config, contains config file, which tells CLI how to connect with database
* models, contains all models for your project
* migrations, contains all migration files
* seeders, contains all seed files
*/

// Configration--
// Tell the CLI how to connect to the database. To do that let's open default config file config/config.json
/**
 {
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
// Note: If your database doesn't exist yet, you can just call db:create command. 
// With proper access it will create that database for you.
 */

// Creating the first Model (and Migration)
/**
We will use model:generate command. This command requires two options:
* name: the name of the model;
* attributes: the list of model attributes.
Let's create a model named User.
 npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string

 This will:
Create a model file user in models folder;
Create a migration file with name like XXXXXXXXXXXXXX-create-user.js in migrations folder.
 */

// Running Migrations
/**
 * Now to actually create that table in the database you need to run db:migrate command.
 npx sequelize-cli db:migrate
 */

 // Undoing Migrations
 /**
  * Now our table has been created and saved in the database. With migration you can revert to old state by just running a command.
  * You can use db:migrate:undo, this command will revert most the recent migration.
  npx sequelize-cli db:migrate:undo
  * You can revert back to the initial state by undoing all migrations with the db:migrate:undo:all command. 
    You can also revert back to a specific migration by passing its name with the --to option.
    npx sequelize-cli db:migrate:undo:all --to XXXXXXXXXXXXXX-create-posts.js

  */

//Creating the first seed--
/**
 * To manage all data migrations you can use seeders.
npx sequelize-cli seed:generate --name demo-user

 //Now we should edit this file to insert demo user to User table.
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      firstName: 'John',
      lastName: 'Doe',
      email: 'example@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
 */

//Running Seeds
// npx sequelize-cli db:seed:all
// This will execute that seed file and a demo user will be inserted into the User table.

//Undoing seeds
/**
// If you wish to undo the most recent seed:
* npx sequelize-cli db:seed:undo
// If you wish to undo a specific seed:
* npx sequelize-cli db:seed:undo --seed name-of-seed-as-in-data
// If you wish to undo all seeds:
* npx sequelize-cli db:seed:undo:all
 */

//Migration Skeleton
/**
 module.exports = {
  up: (queryInterface, Sequelize) => {
    // logic for transforming into the new state
  },
  down: (queryInterface, Sequelize) => {
    // logic for reverting the changes
  }
}

//We can generate this file using migration:generate.
npx sequelize-cli migration:generate --name migration-skeleton

// The passed queryInterface object can be used to modify the database.
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Person', {
      name: Sequelize.DataTypes.STRING,
      isBetaMember: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Person');
  }
};

//using an automatically-managed transaction to ensure 
that all instructions are successfully executed or rolled back in case of failure:
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Person', 'petName', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t }),
        queryInterface.addColumn('Person', 'favoriteColor', {
          type: Sequelize.DataTypes.STRING,
        }, { transaction: t })
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Person', 'petName', { transaction: t }),
        queryInterface.removeColumn('Person', 'favoriteColor', { transaction: t })
      ]);
    });
  }
};

//The next example is of a migration that has a foreign key. You can use references to specify a foreign key:
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Person', {
      name: Sequelize.DataTypes.STRING,
      isBetaMember: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      userId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'users',
            schema: 'schema'
          },
          key: 'id'
        },
        allowNull: false
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Person');
  }
}

// The next example is of a migration that uses async/await where you create an unique index on a new column, 
// with a manually-managed transaction:
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'Person',
        'petName',
        {
          type: Sequelize.DataTypes.STRING,
        },
        { transaction }
      );
      await queryInterface.addIndex(
        'Person',
        'petName',
        {
          fields: 'petName',
          unique: true,
          transaction,
        }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('Person', 'petName', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};

// The next example is of a migration that creates an unique index composed of multiple fields with a condition, 
// which allows a relation to exist multiple times but only one can satisfy the condition:
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('Person', {
      name: Sequelize.DataTypes.STRING,
      bool: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false
      }
    }).then((queryInterface, Sequelize) => {
      queryInterface.addIndex(
        'Person',
        ['name', 'bool'],
        {
          indicesType: 'UNIQUE',
          where: { bool : 'true' },
        }
      );
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Person');
  }
}
*/

// The .sequelizerc file
/**
* env: The environment to run the command in
* config: The path to the config file
* options-path: The path to a JSON file with additional options
* migrations-path: The path to the migrations folder
* seeders-path: The path to the seeders folder
* models-path: The path to the models folder
* url: The database connection string to use. Alternative to using --config files
* debug: When available show various debug information
 
// Some scenarios where you can use it
* You want to override default path to migrations, models, seeders or config folder.
* You want to rename config.json to something else like database.json

//To begin, let's create the .sequelizerc file in the root directory of your project, with the following content:
// .sequelizerc
const path = require('path');
module.exports = {
  'config': path.resolve('config', 'database.json'),
  'models-path': path.resolve('db', 'models'),
  'seeders-path': path.resolve('db', 'seeders'),
  'migrations-path': path.resolve('db', 'migrations')
};
// With this config you are telling the CLI to:
* Use config/database.json file for config settings;
* Use db/models as models folder;
* Use db/seeders as seeders folder;
* Use db/migrations as migrations folder
*/

//Dynamic configration
/**
 The configuration file is by default a JSON file called config.json. But sometimes you need a dynamic configuration, 
 for example to access environment variables or execute some other code to determine the configuration.
const path = require('path');
module.exports = {
  'config': path.resolve('config', 'config.js')
}

//An example of config/config.js file:
const fs = require('fs');

module.exports = {
  development: {
    username: 'database_dev',
    password: 'database_dev',
    database: 'database_dev',
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true
    }
  },
  test: {
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    database: process.env.CI_DB_NAME,
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true
    }
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    port: process.env.PROD_DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true,
      ssl: {
        ca: fs.readFileSync(__dirname + '/mysql-ca-main.crt')
      }
    }
  }
};
 */

//Using Babel
// To enable more modern constructions in your migrations and seeders, 
// you can simply install babel-register and require it at the beginning of .sequelizerc:
// npm i --save-dev babel-register
/**
 // .sequelizerc
require("babel-register");
const path = require('path');
module.exports = {
  'config': path.resolve('config', 'config.json'),
  'models-path': path.resolve('models'),
  'seeders-path': path.resolve('seeders'),
  'migrations-path': path.resolve('migrations')
}
 */

//Security tips--
//Use environment variables for config settings. This is because secrets such as passwords should never be part of the source code 
//(and especially not committed to version control).

//Storage--
/**
There are three types of storage that you can use: sequelize, json, and none.
* sequelize : stores migrations and seeds in a table on the sequelize database
* json : stores migrations and seeds on a json file
* none : does not store any migration/seed

Migration Storage--
{
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
    // Use a different storage type. Default: sequelize
    "migrationStorage": "json",
    // Use a different file name. Default: sequelize-meta.json
    "migrationStoragePath": "sequelizeMeta.json",
    // Use a different table name. Default: SequelizeMeta
    "migrationStorageTableName": "sequelize_meta",
    // Use a different schema for the SequelizeMeta table
    "migrationStorageTableSchema": "custom_schema"
  }
}

Seed Storage--
{
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
    // Use a different storage. Default: none
    "seederStorage": "json",
    // Use a different file name. Default: sequelize-data.json
    "seederStoragePath": "sequelizeData.json",
    // Use a different table name. Default: SequelizeData
    "seederStorageTableName": "sequelize_data"
  }
}

*/

//Configration Connection String
/*
//As an alternative to the --config option with configuration files defining your database, 
//you can use the --url option to pass in a connection string. For example:
npx sequelize-cli db:migrate --url 'mysql://root:password@mysql_host.com/database_name'

If utilizing package.json scripts with npm, make sure to use the extra -- in your command when using flags. For example:
// package.json
...
  "scripts": {
    "migrate:up": "npx sequelize-cli db:migrate",
    "migrate:undo": "npx sequelize-cli db:migrate:undo"
  },
...
// Use the command like so: npm run migrate:up -- --url <url>
 */

//Programmatic Usage
//Sequelize has a sister library called umzug for programmatically handling execution and logging of migration tasks


