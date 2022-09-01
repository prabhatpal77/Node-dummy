// Underlying connection libraries

//MySQL
/**
 * You can provide custom options to it using the dialectOptions in the Sequelize constructor:
 const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'mysql',
  dialectOptions: {
    // Your mysql2 options here
  }
})
 */

//mariaDB
/**
 * The underlying connector library used by Sequelize for MariaDB is the mariadb npm package.
 * You can provide custom options to it using the dialectOptions in the Sequelize constructor:
 const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'mariadb',
  dialectOptions: {
    // Your mariadb options here
    // connectTimeout: 1000
  }
});
 */

//SQLite
/**
 * You specify the storage file in the Sequelize constructor with the storage option (use :memory: for an in-memory SQLite instance).
 import { Sequelize } from 'sequelize';
import SQLite from 'sqlite3';

const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'sqlite',
  storage: 'path/to/database.sqlite', // or ':memory:'
  dialectOptions: {
    // Your sqlite3 options here
    // for instance, this is how you can configure the database opening mode:
    mode: SQLite.OPEN_READWRITE | SQLite.OPEN_CREATE | SQLite.OPEN_FULLMUTEX,
  },
});
 */

//PostgreSQL
/**
 * You can provide custom options to it using the dialectOptions in the Sequelize constructor:
 const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'postgres',
  dialectOptions: {
    // Your pg options here
  }
});

The following fields may be passed to Postgres dialectOptions:
* application_name: Name of application in pg_stat_activity. See the Postgres docs for details.
* ssl: SSL options. See the pg docs for details.
* client_encoding: // Setting 'auto' determines locale based on the client LC_CTYPE environment variable.
  See the Postgres docs for details.
* keepAlive: Boolean to enable TCP KeepAlive. See the pg changelog for details.
* statement_timeout: Times out queries after a set time in milliseconds. Added in pg v7.3. See the Postgres docs for details.
* idle_in_transaction_session_timeout: Terminate any session with an open transaction that has been idle for longer than 
  the specified duration in milliseconds. See the Postgres docs for details.

  //To connect over a unix domain socket, specify the path to the socket directory in the host option. 
   The socket path must start with /.

   const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'postgres',
  host: '/path/to/socket_directory'
  });
  //The default client_min_messages config in sequelize is WARNING.
 */

  //Redshift
  /**
    * Most configuration is same as PostgreSQL above.
    * Redshift doesn't support client_min_messages, 'ignore' is needed to skip the configuration:
    const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'postgres',
  dialectOptions: {
    // Your pg options here
    // ...
    clientMinMessages: 'ignore' // case insensitive
  }
});
   */

//MSSQL
/**
* The underlying connector library used by Sequelize for MSSQL is the tedious npm package (version 6.0.0 or above).
* You can provide custom options to it using dialectOptions.options in the Sequelize constructor:
const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'mssql',
  dialectOptions: {
    // Observe the need for this nested `options` field for MSSQL
    options: {
      // Your tedious options here
      useUTC: false,
      dateFirst: 1
    }
  }
});

// MSSQL Domain Account
const sequelize = new Sequelize('database', null, null, {
  dialect: 'mssql',
  dialectOptions: {
    authentication: {
      type: 'ntlm',
      options: {
        domain: 'yourDomain',
        userName: 'username',
        password: 'password'
      }
    },
    options: {
      instanceName: 'SQLEXPRESS'
    }
  }
})

//Table Hints - MSSQL only
const { TableHints } = require('sequelize');
Project.findAll({
  // adding the table hint NOLOCK
  tableHint: TableHints.NOLOCK
  // this will generate the SQL 'WITH (NOLOCK)'
})
 */

// Data type: ARRAY(ENUM) - PostgreSQL only
/**
* Array(Enum) type requireS special treatment. Whenever Sequelize will talk to the database, 
  it has to typecast array values with ENUM name.
* So this enum name must follow this pattern enum_<table_name>_<col_name>. 
  If you are using sync then correct name will automatically be generated.
 */

  // Index Hints - MySQL/MariaDB only
  /**
   const { IndexHints } = require("sequelize");
Project.findAll({
  indexHints: [
    { type: IndexHints.USE, values: ['index_project_on_name'] }
  ],
  where: {
    id: {
      [Op.gt]: 623
    },
    name: {
      [Op.like]: 'Foo %'
    }
  }
});

//The above will generate a MySQL query that looks like this:
SELECT * FROM Project USE INDEX (index_project_on_name) WHERE name LIKE 'FOO %' AND id > 623;
// Sequelize.IndexHints includes USE, FORCE, and IGNORE.
   */

//Engines - MySQL/MariaDB only
/**
 * You can change the engine for a model with the engine option (e.g., to MyISAM):
 const Person = sequelize.define('person', { /* attributes * }, {
    engine: 'MYISAM'
});

//Like every option for the definition of a model, 
 this setting can also be changed globally with the define option of the Sequelize constructor
 const sequelize = new Sequelize(db, user, pw, {
  define: { engine: 'MYISAM' }
})
 */

// Table comments - MySQL/MariaDB/PostgreSQL only
/**
 class Person extends Model {}
Person.init({ /* attributes * }, {
    comment: "I'm a table comment!",
    sequelize
  })
// The comment will be set when calling sync().
 */
