// Read Replication--
// Sequelize can connect with multiple databases. We use read replication to connect with the multiple databases
/**
 const sequelize = new Sequelize('database', null, null, {
  dialect: 'mysql',
  port: 3306,
  replication: {
    read: [
      { host: '8.8.8.8', username: 'read-1-username', password: process.env.READ_DB_1_PW },
      { host: '9.9.9.9', username: 'read-2-username', password: process.env.READ_DB_2_PW }
    ],
    write: { host: '1.1.1.1', username: 'write-username', password: process.env.WRITE_DB_PW }
  },
  pool: { // If you want to override the options used for the read/write pool you can do so here
    max: 20,
    idle: 30000
  },
})
 */