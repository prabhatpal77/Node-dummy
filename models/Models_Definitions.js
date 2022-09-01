//Deprecated: sequelize.import
/**
 * // in your server file - e.g. app.js
const Project = sequelize.import(__dirname + "/path/to/models/project");

// The model definition is done in /path/to/models/project.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('project', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  });
};

//The import method can also accept a callback as an argument.

sequelize.import('project', (sequelize, DataTypes) => {
  return sequelize.define('project', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  });
});

//This can be worked around by passing in Meteor's version of require:

// If this fails...
const AuthorModel = db.import('./path/to/models/project');

// Try this instead!
const AuthorModel = db.import('project', require('./path/to/models/project'));
 */