//Sequelize supports the standard associations: One-To-One, One-To-Many and Many-To-Many.
//To do this, Sequelize provides four types of associations that should be combined to create them:
/* 1.The HasOne association
2. The BelongsTo association
3. The HasMany association
4. The BelongsToMany association */

// Defining the sequelize associations
/**
 //const A = sequelize.define('A', /* ... );
 //const B = sequelize.define('B', /* ... );

 //A.hasOne(B); // A HasOne B
 //A.belongsTo(B); // A BelongsTo B
 //A.hasMany(B); // A HasMany B
 //A.belongsToMany(B, { through: 'C' }); // A BelongsToMany B through the junction table C

//They all accept an options object as a second parameter 
(optional for the first three, mandatory for belongsToMany containing at least the through property):
A.hasOne(B, { /* options  });
A.belongsTo(B, { /* options  });
A.hasMany(B, { /* options  });
A.belongsToMany(B, { through: 'C', /* options  });
 */

//Creating the standard relationships
/**
 * To create a One-To-One relationship, the hasOne and belongsTo associations are used together;
 * To create a One-To-Many relationship, the hasMany and belongsTo associations are used together;
 * To create a Many-To-Many relationship, two belongsToMany calls are used together.
 */

// One-To-One realtionships
/**
 * // Phylosophy
 * // Goal
 * // Implementation
  Foo.hasOne(Bar);
  Bar.belongsTo(Foo);

  //This way, calling Bar.sync() after the above will yield the following SQL (on PostgreSQL, for example):
    CREATE TABLE IF NOT EXISTS "foos" (
//  /* ... */
//);
//CREATE TABLE IF NOT EXISTS "bars" (
 // /* ... */
//  "fooId" INTEGER REFERENCES "foos" ("id") ON DELETE SET NULL ON UPDATE CASCADE
 // /* ... */
//);

 //*/

// Options
// onDelete and onUpdate
/**
 Foo.hasOne(Bar, {
  onDelete: 'RESTRICT',
  onUpdate: 'RESTRICT'
});
Bar.belongsTo(Foo);
// The possible choices are RESTRICT, CASCADE, NO ACTION, SET DEFAULT and SET NULL.
// The defaults for the One-To-One associations is SET NULL for ON DELETE and CASCADE for ON UPDATE.

//Customizing the foreign key
//Both the hasOne and belongsTo calls shown above will infer that the foreign key to be created should be called fooId. 
//To use a different name, such as myFooId:
// Option 1
Foo.hasOne(Bar, {
  foreignKey: 'myFooId'
});
Bar.belongsTo(Foo);

// Option 2
Foo.hasOne(Bar, {
  foreignKey: {
    name: 'myFooId'
  }
});
Bar.belongsTo(Foo);

// Option 3
Foo.hasOne(Bar);
Bar.belongsTo(Foo, {
  foreignKey: 'myFooId'
});

// Option 4
Foo.hasOne(Bar);
Bar.belongsTo(Foo, {
  foreignKey: {
    name: 'myFooId'
  }
});

// to use UUID as the foreign key data type instead of the default (INTEGER), you can simply do:
const { DataTypes } = require("Sequelize");

Foo.hasOne(Bar, {
  foreignKey: {
    // name: 'myFooId'
    type: DataTypes.UUID
  }
});
Bar.belongsTo(Foo);

//Mandetory VS Optional association
Foo.hasOne(Bar, {
  foreignKey: {
    allowNull: false
  }
});
// "fooId" INTEGER NOT NULL REFERENCES "foos" ("id") ON DELETE RESTRICT ON UPDATE RESTRICT
 */

//One-To-Many realtionship
/**
 //Philosophy
 //Goal
 //Implementation
    Team.hasMany(Player);
    Player.belongsTo(Team);

    //Options
    Team.hasMany(Player, {
    foreignKey: 'clubId'
    });
    Player.belongsTo(Team);
    //Like One-To-One relationships, ON DELETE defaults to SET NULL and ON UPDATE defaults to CASCADE.

 */

 // Many-To-Many relationships
 /**
  //Philosophy
  //Goal
  //Implementation
const Movie = sequelize.define('Movie', { name: DataTypes.STRING });
const Actor = sequelize.define('Actor', { name: DataTypes.STRING });
Movie.belongsToMany(Actor, { through: 'ActorMovies' });
Actor.belongsToMany(Movie, { through: 'ActorMovies' });

//Instead of a string, passing a model directly is also supported, and in that case the given model will be used as the junction model 
//(and no model will be created automatically). For example:
const Movie = sequelize.define('Movie', { name: DataTypes.STRING });
const Actor = sequelize.define('Actor', { name: DataTypes.STRING });
const ActorMovies = sequelize.define('ActorMovies', {
  MovieId: {
    type: DataTypes.INTEGER,
    references: {
      model: Movie, // 'Movies' would also work
      key: 'id'
    }
  },
  ActorId: {
    type: DataTypes.INTEGER,
    references: {
      model: Actor, // 'Actors' would also work
      key: 'id'
    }
  }
});
Movie.belongsToMany(Actor, { through: ActorMovies });
Actor.belongsToMany(Movie, { through: ActorMovies });

//Options
Project.belongsToMany(User, { through: UserProjects, uniqueKey: 'my_custom_unique' })

*/

//Basics of queries involving associations
/*
// This is the setup of our models for the examples below
const Ship = sequelize.define('ship', {
    name: DataTypes.TEXT,
    crewCapacity: DataTypes.INTEGER,
    amountOfSails: DataTypes.INTEGER
  }, { timestamps: false });
  const Captain = sequelize.define('captain', {
    name: DataTypes.TEXT,
    skillLevel: {
      type: DataTypes.INTEGER,
      validate: { min: 1, max: 10 }
    }
  }, { timestamps: false });
  Captain.hasOne(Ship);
  Ship.belongsTo(Captain);
*/

//Fetching associations - Eager loading and Lazy loading
/**
 //Lazy Loading refers to the technique of fetching the associated data only when you really want it; Eager Loading,
 // on the other hand, refers to the technique of fetching everything at once, since the beginning, with a larger query.
 const awesomeCaptain = await Captain.findOne({
  where: {
    name: "Jack Sparrow"
  }
});
// Do stuff with the fetched captain
console.log('Name:', awesomeCaptain.name);
console.log('Skill Level:', awesomeCaptain.skillLevel);
// Now we want information about his ship!
const hisShip = await awesomeCaptain.getShip();
// Do stuff with the ship
console.log('Ship Name:', hisShip.name);
console.log('Amount of Sails:', hisShip.amountOfSails);

//Eager Loading Example
const awesomeCaptain = await Captain.findOne({
  where: {
    name: "Jack Sparrow"
  },
  include: Ship
});
// Now the ship comes with it
console.log('Name:', awesomeCaptain.name);
console.log('Skill Level:', awesomeCaptain.skillLevel);
console.log('Ship Name:', awesomeCaptain.ship.name);
console.log('Amount of Sails:', awesomeCaptain.ship.amountOfSails);

 */

// Creating, updating and deleting
/*
// Example: creating an associated model using the standard methods
Bar.create({
  name: 'My Bar',
  fooId: 5
});
// This creates a Bar belonging to the Foo of ID 5 (since fooId is
// a regular column, after all). Nothing very clever going on here.
*/

// Association Aliases and custom foreign key
/**
 const Ship = sequelize.define('ship', { name: DataTypes.TEXT }, { timestamps: false });
const Captain = sequelize.define('captain', { name: DataTypes.TEXT }, { timestamps: false });
There are three ways to specify a different name for the foreign key:
* By providing the foreign key name directly
* By defining an Alias
* By doing both things
 */

//Recap the default step
/**
 * //By using simply Ship.belongsTo(Captain), sequelize will generate the foreign key name automatically:
 Ship.belongsTo(Captain); // This creates the `captainId` foreign key in Ship.

// Eager Loading is done by passing the model to `include`:
console.log((await Ship.findAll({ include: Captain })).toJSON());
// Or by providing the associated model name:
console.log((await Ship.findAll({ include: 'captain' })).toJSON());

// Also, instances obtain a `getCaptain()` method for Lazy Loading:
const ship = Ship.findOne();
console.log((await ship.getCaptain()).toJSON());
 */

//Providing the foriegn key directly
/**
 Ship.belongsTo(Captain, { foreignKey: 'bossId' }); // This creates the `bossId` foreign key in Ship.

// Eager Loading is done by passing the model to `include`:
console.log((await Ship.findAll({ include: Captain })).toJSON());
// Or by providing the associated model name:
console.log((await Ship.findAll({ include: 'Captain' })).toJSON());

// Also, instances obtain a `getCaptain()` method for Lazy Loading:
const ship = Ship.findOne();
console.log((await ship.getCaptain()).toJSON());
 */

// Defining an alias
/**
 Ship.belongsTo(Captain, { as: 'leader' }); // This creates the `leaderId` foreign key in Ship.

// Eager Loading no longer works by passing the model to `include`:
console.log((await Ship.findAll({ include: Captain })).toJSON()); // Throws an error
// Instead, you have to pass the alias:
console.log((await Ship.findAll({ include: 'leader' })).toJSON());
// Or you can pass an object specifying the model and alias:
console.log((await Ship.findAll({
  include: {
    model: Captain,
    as: 'leader'
  }
})).toJSON());

// Also, instances obtain a `getLeader()` method for Lazy Loading:
const ship = Ship.findOne();
console.log((await ship.getLeader()).toJSON());

//Defining both things

Ship.belongsTo(Captain, { as: 'leader', foreignKey: 'bossId' }); // This creates the `bossId` foreign key in Ship.

// Since an alias was defined, eager Loading doesn't work by simply passing the model to `include`:
console.log((await Ship.findAll({ include: Captain })).toJSON()); // Throws an error
// Instead, you have to pass the alias:
console.log((await Ship.findAll({ include: 'leader' })).toJSON());
// Or you can pass an object specifying the model and alias:
console.log((await Ship.findAll({
  include: {
    model: Captain,
    as: 'leader'
  }
})).toJSON());

// Also, instances obtain a `getLeader()` method for Lazy Loading:
const ship = Ship.findOne();
console.log((await ship.getLeader()).toJSON());
 */

// Special methods/mixins method to instances
/*
// if we have two models, Foo and Bar, and they are associated, 
//their instances will have the following methods/mixins available, depending on the association type:

Foo.hasOne(Bar)
* fooInstance.getBar()
* fooInstance.setBar()
* fooInstance.createBar()
const foo = await Foo.create({ name: 'the-foo' });
const bar1 = await Bar.create({ name: 'some-bar' });
const bar2 = await Bar.create({ name: 'another-bar' });
console.log(await foo.getBar()); // null
await foo.setBar(bar1);
console.log((await foo.getBar()).name); // 'some-bar'
await foo.createBar({ name: 'yet-another-bar' });
const newlyAssociatedBar = await foo.getBar();
console.log(newlyAssociatedBar.name); // 'yet-another-bar'
await foo.setBar(null); // Un-associate
console.log(await foo.getBar()); // null
*/

//Foo.belongsTo(Bar)
//The some ones from foo.hasOne(Bar)
/**
 * fooInstance.getBar()
 * fooInstance.setBar()
 * fooInstance.createBar()
 */

//Foo.hasMany(Bar)
/**
 * FooInstance.getBars()
 * FooInstance.countBars()
 * FooInstance.hasBar()
 * FooInstance.hasBars()
 * FooInstance.setBars()
 * FooInstance.addBar()
 * FooInstance.addBars()
 * FooInstance.removeBar()
 * FooInstance.removeBars()
 * FooInstance.createBar()
 * 
 const foo = await Foo.create({ name: 'the-foo' });
const bar1 = await Bar.create({ name: 'some-bar' });
const bar2 = await Bar.create({ name: 'another-bar' });
console.log(await foo.getBars()); // []
console.log(await foo.countBars()); // 0
console.log(await foo.hasBar(bar1)); // false
await foo.addBars([bar1, bar2]);
console.log(await foo.countBars()); // 2
await foo.addBar(bar1);
console.log(await foo.countBars()); // 2
console.log(await foo.hasBar(bar1)); // true
await foo.removeBar(bar2);
console.log(await foo.countBars()); // 1
await foo.createBar({ name: 'yet-another-bar' });
console.log(await foo.countBars()); // 2
await foo.setBars([]); // Un-associate all previously associated bars
console.log(await foo.countBars()); // 0
 */

//The getter method accepts options just like the usual finder methods (such as findAll):
/*
const easyTasks = await project.getTasks({
  where: {
    difficulty: {
      [Op.lte]: 5
    }
  }
});
const taskTitles = (await project.getTasks({
  attributes: ['title'],
  raw: true
})).map(task => task.title);
*/

// Foo.belongsToMany(Bar, { through: Baz })
// The some ones from foo.hasMany(Bar)
/**
* fooInstance.getBars()
* fooInstance.countBars()
* fooInstance.hasBar()
* fooInstance.hasBars()
* fooInstance.setBars()
* fooInstance.addBar()
* fooInstance.addBars()
* fooInstance.removeBar()
* fooInstance.removeBars()
* fooInstance.createBar()
const foo = Foo.findByPk(id, {
  include: [{
    model: Bar,
    through: { attributes: [] }
  }]
})
console.log(foo.bars)

const foo = Foo.findByPk(id)
console.log(foo.getBars({ joinTableAttributes: [] })) 
 */

// Note: Method Names
/**
 Task.hasOne(User, { as: 'Author' });

* taskInstance.getAuthor()
* taskInstance.setAuthor()
* taskInstance.createAuthor()
 */

// Why associations are defined in pairs?
/**
* To create a One-To-One relationship, the hasOne and belongsTo associations are used together;
* To create a One-To-Many relationship, the hasMany and belongsTo associations are used together;
* To create a Many-To-Many relationship, two belongsToMany calls are used together.

If we do not define the pair of associations, calling for example just Foo.hasOne(Bar):
// This works...
await Foo.findOne({ include: Bar });
// But this throws an error:
await Bar.findOne({ include: Foo });
// SequelizeEagerLoadingError: foo is not associated to bar!

If we define the pair as recommended, i.e., both Foo.hasOne(Bar) and Bar.belongsTo(Foo):
// This works!
await Foo.findOne({ include: Bar });
// This also works!
await Bar.findOne({ include: Foo });
 */

// Multiple associations involving the same models
/*
Team.hasOne(Game, { as: 'HomeTeam', foreignKey: 'homeTeamId' });
Team.hasOne(Game, { as: 'AwayTeam', foreignKey: 'awayTeamId' });
Game.belongsTo(Team);
*/

// Creating associations referencing a field which is not the primary key
/**
 // For belongsTo relationships
 const Ship = sequelize.define('ship', { name: DataTypes.TEXT }, { timestamps: false });
const Captain = sequelize.define('captain', {
  name: { type: DataTypes.TEXT, unique: true }
}, { timestamps: false });

Ship.belongsTo(Captain, { targetKey: 'name', foreignKey: 'captainName' });
// This creates a foreign key called `captainName` in the source model (Ship)
// which references the `name` field from the target model (Captain).
 
Now we can do things like:
await Captain.create({ name: "Jack Sparrow" });
const ship = await Ship.create({ name: "Black Pearl", captainName: "Jack Sparrow" });
console.log((await ship.getCaptain()).name); // "Jack Sparrow"

*/

// For hasOne and hasMany relationships
/*
const Foo = sequelize.define('foo', {
  name: { type: DataTypes.TEXT, unique: true }
}, { timestamps: false });
const Bar = sequelize.define('bar', {
  title: { type: DataTypes.TEXT, unique: true }
}, { timestamps: false });
const Baz = sequelize.define('baz', { summary: DataTypes.TEXT }, { timestamps: false });
Foo.hasOne(Bar, { sourceKey: 'name', foreignKey: 'fooName' });
Bar.hasMany(Baz, { sourceKey: 'title', foreignKey: 'barTitle' });
// [...]
await Bar.setFoo("Foo's Name Here");
await Baz.addBar("Bar's Title Here");
*/

// For belongsToMany relationships
/**
 const Foo = sequelize.define('foo', {
  name: { type: DataTypes.TEXT, unique: true }
}, { timestamps: false });
const Bar = sequelize.define('bar', {
  title: { type: DataTypes.TEXT, unique: true }
}, { timestamps: false });
There are four cases to consider:
* We might want a many-to-many relationship using the default primary keys for both Foo and Bar:
Foo.belongsToMany(Bar, { through: 'foo_bar' });
// This creates a junction table `foo_bar` with fields `fooId` and `barId`

* We might want a many-to-many relationship using the default primary key for Foo but a different field for Bar:
Foo.belongsToMany(Bar, { through: 'foo_bar', targetKey: 'title' });
// This creates a junction table `foo_bar` with fields `fooId` and `barTitle`

* We might want a many-to-many relationship using the a different field for Foo and the default primary key for Bar:
Foo.belongsToMany(Bar, { through: 'foo_bar', sourceKey: 'name' });
// This creates a junction table `foo_bar` with fields `fooName` and `barId`

* We might want a many-to-many relationship using different fields for both Foo and Bar:
Foo.belongsToMany(Bar, { through: 'foo_bar', sourceKey: 'name', targetKey: 'title' });
// This creates a junction table `foo_bar` with fields `fooName` and `barTitle`

 */

//Notes
/*
* A.belongsTo(B) keeps the foreign key in the source model (A), therefore the referenced key is in the target model, 
  hence the usage of targetKey.

* A.hasOne(B) and A.hasMany(B) keep the foreign key in the target model (B), therefore the referenced key is in the source model, 
  hence the usage of sourceKey.

* A.belongsToMany(B) involves an extra table (the junction table), therefore both sourceKey and targetKey are usable, 
  with sourceKey corresponding to some field in A (the source) and targetKey corresponding to some field in B (the target).
*/


