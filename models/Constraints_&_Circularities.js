//Constraints and circularities
/*
//const { Sequelize, Model, DataTypes } = require("sequelize");

class Document extends Model {}
Document.init({
    author: DataTypes.STRING
}, { sequelize, modelName: 'document' });

class Version extends Model {}
Version.init({
  timestamp: DataTypes.DATE
}, { sequelize, modelName: 'version' });

Document.hasMany(Version); // This adds documentId attribute to version
Document.belongsTo(Version, {
  as: 'Current',
  foreignKey: 'currentVersionId'
}); // This adds currentVersionId attribute to document

//However, unfortunately the code above will result in the following error:
Cyclic dependency found. documents is dependent of itself. Dependency chain: documents -> versions => documents

//In order to alleviate that, we can pass constraints: false to one of the associations:
Document.hasMany(Version);
Document.belongsTo(Version, {
  as: 'Current',
  foreignKey: 'currentVersionId',
  constraints: false
});

//Which will allow us to sync the tables correctly:

CREATE TABLE IF NOT EXISTS "documents" (
  "id" SERIAL,
  "author" VARCHAR(255),
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "currentVersionId" INTEGER,
  PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "versions" (
  "id" SERIAL,
  "timestamp" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "documentId" INTEGER REFERENCES "documents" ("id") ON DELETE
  SET
    NULL ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);

*/

//Enforcing a foreign key reference without constraints
/**
 class Trainer extends Model {}
Trainer.init({
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING
}, { sequelize, modelName: 'trainer' });

// Series will have a trainerId = Trainer.id foreign reference key
// after we call Trainer.hasMany(series)
class Series extends Model {}
Series.init({
  title: Sequelize.STRING,
  subTitle: Sequelize.STRING,
  description: Sequelize.TEXT,
  // Set FK relationship (hasMany) with `Trainer`
  trainerId: {
    type: DataTypes.INTEGER,
    references: {
      model: Trainer,
      key: 'id'
    }
  }
}, { sequelize, modelName: 'series' });

// Video will have seriesId = Series.id foreign reference key
// after we call Series.hasOne(Video)
class Video extends Model {}
Video.init({
  title: Sequelize.STRING,
  sequence: Sequelize.INTEGER,
  description: Sequelize.TEXT,
  // set relationship (hasOne) with `Series`
  seriesId: {
    type: DataTypes.INTEGER,
    references: {
      model: Series, // Can be both a string representing the table name or a Sequelize model
      key: 'id'
    }
  }
}, { sequelize, modelName: 'video' });

Series.hasOne(Video);
Trainer.hasMany(Series);
 */