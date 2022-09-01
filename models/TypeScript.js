// TypeScript
// Sequelize provides its own TypeScript definitions.
// Please note that only TypeScript >= 4.1 is supported.

//Installation
//npm install --save @types/node

//Usage-
/*
//Important: You must use declare on your class properties typings to ensure TypeScript does not emit those class properties.
 See Caveat with Public Class Fields
//Sequelize Models accept two generic types to define what the model's Attributes & Creation Attributes are like:
import { Model, Optional } from 'sequelize';

// We don't recommend doing this. Read on for the new way of declaring Model typings.

type UserAttributes = {
  id: number,
  name: string,
  // other attributes...
};

// we're telling the Model that 'id' is optional
// when creating an instance of the model (such as using Model.create()).
type UserCreationAttributes = Optional<UserAttributes, 'id'>;

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number;
  declare string: number;
  // other attributes...
}

//This solution is verbose. Sequelize >=6.14.0 provides new utility types that will drastically reduce the amount of boilerplate 
//necessary: InferAttributes, and InferCreationAttributes. They will extract Attribute typings directly from the Model:

import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
// order of InferAttributes & InferCreationAttributes is important.
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare string: number;
  // other attributes...


  //Important things to know about InferAttributes & InferCreationAttributes work: 
  They will select all declared properties of the class except:
* Static fields and methods.
* Methods (anything whose type is a function).
* Those whose type uses the branded type NonAttribute.
* Those excluded by using InferAttributes like this: InferAttributes<User, { omit: 'properties' | 'to' | 'omit' }>.
* Those declared by the Model superclass (but not intermediary classes!). If one of your attributes shares 
  the same name as one of the properties of Model, change its name. Doing this is likely to cause issues anyway.
*Getter & setters are not automatically excluded. Set their return / parameter type to NonAttribute, 
or add them to omit to exclude them.


class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare firstName: string;

  // there is no need to use CreationOptional on firstName because nullable attributes
  // are always optional in User.create()
  declare lastName: string | null;
}

// ...

await User.create({
  firstName: 'Zoé',
  // last name omitted, but this is still valid!
});


//Example of a minimal TypeScript project with strict type-checking for attributes:
/**
 * Keep this file in sync with the code in the "Usage" section
 * in /docs/manual/other-topics/typescript.md
 *
 * Don't include this comment in the md file.
 *
 import {
    Association, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
    HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, Model, ModelDefined, Optional,
    Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey,
  } from 'sequelize';
  
  const sequelize = new Sequelize('mysql://root:asd123@localhost:3306/mydb');
  
  // 'projects' is excluded as it's not an attribute, it's an association.
  class User extends Model<InferAttributes<User, { omit: 'projects' }>, InferCreationAttributes<User, { omit: 'projects' }>> {
    // id can be undefined during creation when using `autoIncrement`
    declare id: CreationOptional<number>;
    declare name: string;
    declare preferredName: string | null; // for nullable fields
  
    // timestamps!
    // createdAt can be undefined during creation
    declare createdAt: CreationOptional<Date>;
    // updatedAt can be undefined during creation
    declare updatedAt: CreationOptional<Date>;
  
    // Since TS cannot determine model association at compile time
    // we have to declare them here purely virtually
    // these will not exist until `Model.init` was called.
    declare getProjects: HasManyGetAssociationsMixin<Project>; // Note the null assertions!
    declare addProject: HasManyAddAssociationMixin<Project, number>;
    declare addProjects: HasManyAddAssociationsMixin<Project, number>;
    declare setProjects: HasManySetAssociationsMixin<Project, number>;
    declare removeProject: HasManyRemoveAssociationMixin<Project, number>;
    declare removeProjects: HasManyRemoveAssociationsMixin<Project, number>;
    declare hasProject: HasManyHasAssociationMixin<Project, number>;
    declare hasProjects: HasManyHasAssociationsMixin<Project, number>;
    declare countProjects: HasManyCountAssociationsMixin;
    declare createProject: HasManyCreateAssociationMixin<Project, 'ownerId'>;
  
    // You can also pre-declare possible inclusions, these will only be populated if you
    // actively include a relation.
    declare projects?: NonAttribute<Project[]>; // Note this is optional since it's only populated when explicitly requested in code
  
    // getters that are not attributes should be tagged using NonAttribute
    // to remove them from the model's Attribute Typings.
    get fullName(): NonAttribute<string> {
      return this.name;
    }
  
    declare static associations: {
      projects: Association<User, Project>;
    };
  }
  
  class Project extends Model<
    InferAttributes<Project>,
    InferCreationAttributes<Project>
  > {
    // id can be undefined during creation when using `autoIncrement`
    declare id: CreationOptional<number>;
  
    // foreign keys are automatically added by associations methods (like Project.belongsTo)
    // by branding them using the `ForeignKey` type, `Project.init` will know it does not need to
    // display an error if ownerId is missing.
    declare ownerId: ForeignKey<User['id']>;
    declare name: string;
  
    // `owner` is an eagerly-loaded association.
    // We tag it as `NonAttribute`
    declare owner?: NonAttribute<User>;
  
    // createdAt can be undefined during creation
    declare createdAt: CreationOptional<Date>;
    // updatedAt can be undefined during creation
    declare updatedAt: CreationOptional<Date>;
  }
  
  class Address extends Model<
    InferAttributes<Address>,
    InferCreationAttributes<Address>
  > {
    declare userId: ForeignKey<User['id']>;
    declare address: string;
  
    // createdAt can be undefined during creation
    declare createdAt: CreationOptional<Date>;
    // updatedAt can be undefined during creation
    declare updatedAt: CreationOptional<Date>;
  }
  
  Project.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'projects'
    }
  );
  
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      preferredName: {
        type: new DataTypes.STRING(128),
        allowNull: true
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: 'users',
      sequelize // passing the `sequelize` instance is required
    }
  );
  
  Address.init(
    {
      address: {
        type: new DataTypes.STRING(128),
        allowNull: false
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: 'address',
      sequelize // passing the `sequelize` instance is required
    }
  );
  
  // You can also define modules in a functional way
  interface NoteAttributes {
    id: number;
    title: string;
    content: string;
  }
  
  // You can also set multiple attributes optional at once
  type NoteCreationAttributes = Optional<NoteAttributes, 'id' | 'title'>;
  
  // And with a functional approach defining a module looks like this
  const Note: ModelDefined<
    NoteAttributes,
    NoteCreationAttributes
  > = sequelize.define(
    'Note',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: new DataTypes.STRING(64),
        defaultValue: 'Unnamed Note'
      },
      content: {
        type: new DataTypes.STRING(4096),
        allowNull: false
      }
    },
    {
      tableName: 'notes'
    }
  );
  
  // Here we associate which actually populates out pre-declared `association` static and other methods.
  User.hasMany(Project, {
    sourceKey: 'id',
    foreignKey: 'ownerId',
    as: 'projects' // this determines the name in `associations`!
  });
  
  Address.belongsTo(User, { targetKey: 'id' });
  User.hasOne(Address, { sourceKey: 'id' });
  
  async function doStuffWithUser() {
    const newUser = await User.create({
      name: 'Johnny',
      preferredName: 'John',
    });
    console.log(newUser.id, newUser.name, newUser.preferredName);
  
    const project = await newUser.createProject({
      name: 'first!'
    });
  
    const ourUser = await User.findByPk(1, {
      include: [User.associations.projects],
      rejectOnEmpty: true // Specifying true here removes `null` from the return type!
    });
  
    // Note the `!` null assertion since TS can't know if we included
    // the model or not
    console.log(ourUser.projects![0].name);
  }
  
  (async () => {
    await sequelize.sync();
    await doStuffWithUser();
  })();


*/

//The case of Model.init
/**
 import { Model, InferAttributes, InferCreationAttributes, DataTypes, ForeignKey } from 'sequelize';

class Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>> {
  id: number;
  userId: ForeignKey<number>;
}

// this configures the `userId` attribute.
Project.belongsTo(User);

// therefore, `userId` doesn't need to be specified here.
Project.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, { sequelize });

/////
import { Model, InferAttributes, InferCreationAttributes, DataTypes } from 'sequelize';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // technically, `createdAt` & `updatedAt` are added by Sequelize and don't need to be configured in Model.init
  // but the typings of Model.init do not know this. Add the following to mute the typing error:
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, { sequelize });
 */

//Usage without strict types for attributes
/**
 /**
 * Keep this file in sync with the code in the "Usage without strict types for
 * attributes" section in /docs/manual/other-topics/typescript.md
 *
 * Don't include this comment in the md file.
 *
import { Sequelize, Model, DataTypes } from 'sequelize';

const sequelize = new Sequelize('mysql://root:asd123@localhost:3306/mydb');

class User extends Model {
  declare id: number;
  declare name: string;
  declare preferredName: string | null;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    preferredName: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    sequelize, // passing the `sequelize` instance is required
  },
);

async function doStuffWithUserModel() {
  const newUser = await User.create({
    name: 'Johnny',
    preferredName: 'John',
  });
  console.log(newUser.id, newUser.name, newUser.preferredName);

  const foundUser = await User.findOne({ where: { name: 'Johnny' } });
  if (foundUser === null) return;
  console.log(foundUser.name);
}
 */

//Usage of Sequelize#define
/**
 /**
 * Keep this file in sync with the code in the "Usage of `sequelize.define`"
 * section in /docs/manual/other-topics/typescript.md
 *
 * Don't include this comment in the md file.
 *
import { Sequelize, Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

const sequelize = new Sequelize('mysql://root:asd123@localhost:3306/mydb');

// We recommend you declare an interface for the attributes, for stricter typechecking

interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  id: CreationOptional<number>;
  name: string;
}

const UserModel = sequelize.define<UserModel>('User', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER.UNSIGNED,
  },
  name: {
    type: DataTypes.STRING,
  },
});

async function doStuff() {
  const instance = await UserModel.findByPk(1, {
    rejectOnEmpty: true,
  });

  console.log(instance.id);
}
 */

//Utility types
/**
 * Requesting a model class
 import { ModelStatic, ModelAttributeColumnOptions, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

/**
 * Returns the list of attributes that are part of the model's primary key.
 *
export function getPrimaryKeyAttributes(model: ModelStatic<any>): ModelAttributeColumnOptions[] {
    const attributes: ModelAttributeColumnOptions[] = [];
  
    for (const attribute of Object.values(model.rawAttributes)) {
      if (attribute.primaryKey) {
        attributes.push(attribute);
      }
    }
  
    return attributes;
  }
  
  class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    id: CreationOptional<number>;
  }
  
  User.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
  }, { sequelize });
  
  const primaryAttributes = getPrimaryKeyAttributes(User);
 */

  //Getting a model attributes
  /**
   import {
  ModelStatic,
  ModelAttributeColumnOptions,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Attributes
} from 'sequelize';

export function getAttributeMetadata<M extends Model>(model: ModelStatic<M>, attributeName: keyof Attributes<M>): ModelAttributeColumnOptions {
  const attribute = model.rawAttributes[attributeName];
  if (attribute == null) {
    throw new Error(`Attribute ${attributeName} does not exist on model ${model.name}`);
  }

  return attribute;
}

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  id: CreationOptional<number>;
}

User.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
}, { sequelize });

const idAttributeMeta = getAttributeMetadata(User, 'id'); // works!

// @ts-expect-error
const nameAttributeMeta = getAttributeMetadata(User, 'name'); // fails because 'name' is not an attribute of User
   */