// Using Sequelize in AWS lambda
// TL;DR
/**
 const { Sequelize } = require("sequelize");

let sequelize = null;

async function loadSequelize() {
  const sequelize = new Sequelize(/* (...) *, {
    // (...)
    pool: {
        /*
         * Lambda functions process one request at a time but your code may issue multiple queries
         * concurrently. Be wary that `sequelize` has methods that issue 2 queries concurrently
         * (e.g. `Model.findAndCountAll()`). Using a value higher than 1 allows concurrent queries to
         * be executed in parallel rather than serialized. Careful with executing too many queries in
         * parallel per Lambda function execution since that can bring down your database with an
         * excessive number of connections.
         *
         * Ideally you want to choose a `max` number where this holds true:
         * max * EXPECTED_MAX_CONCURRENT_LAMBDA_INVOCATIONS < MAX_ALLOWED_DATABASE_CONNECTIONS * 0.8
         *
        max: 2,
        /*
         * Set this value to 0 so connection pool eviction logic eventually cleans up all connections
         * in the event of a Lambda function timeout.
         *
        min: 0,
        /*
         * Set this value to 0 so connections are eligible for cleanup immediately after they're
         * returned to the pool.
         *
        idle: 0,
        // Choose a small enough value that fails fast if a connection takes too long to be established.
        acquire: 3000,
        /*
         * Ensures the connection pool attempts to be cleaned up automatically on the next Lambda
         * function invocation, if the previous invocation timed out.
         *
        evict: CURRENT_LAMBDA_FUNCTION_TIMEOUT
      }
    });
  
    // or `sequelize.sync()`
    await sequelize.authenticate();
  
    return sequelize;
  }
  
  module.exports.handler = async function (event, callback) {
    // re-use the sequelize instance across invocations to improve performance
    if (!sequelize) {
      sequelize = await loadSequelize();
    } else {
      // restart connection pool to ensure connections are not re-used across invocations
      sequelize.connectionManager.initPools();
  
      // restore `getConnection()` if it has been overwritten by `close()`
      if (sequelize.connectionManager.hasOwnProperty("getConnection")) {
        delete sequelize.connectionManager.getConnection;
      }
    }
  
    try {
      return await doSomethingWithSequelize(sequelize);
    } finally {
      // close any opened connections during the invocation
      // this will wait for any in-progress queries to finish before closing the connections
      await sequelize.connectionManager.close();
    }
  };
 */

  //Using AWS RDS Proxy
  //This will make sure that opening/closing connections on each invocation is not 
  //an expensive operation for your underlying database server.

  //The Node.js event loop
  /**
   // see: https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/
// see: https://www.youtube.com/watch?v=P9csgxBgaZ8
// see: https://www.youtube.com/watch?v=PNa9OMajw9w
const process = require('process');

/*
 * counter of pending events
 *
 * reference counter is increased for every:
 *
 * 1. scheduled timer: `setTimeout()`, `setInterval()`, etc.
 * 2. scheduled immediate: `setImmediate()`.
 * 3. syscall of non-blocking IO: `require('net').Server.listen()`, etc.
 * 4. scheduled task to the thread pool: `require('fs').WriteStream.write()`, etc.
 *
 * reference counter is decreased for every:
 *
 * 1. elapsed timer
 * 2. executed immediate
 * 3. completed non-blocking IO
 * 4. completed thread pool task
 *
 * references can be explicitly decreased by invoking `.unref()` on some
 * objects like: `require('net').Socket.unref()`
 *
let refs = 0;

/*
 * a heap of timers, sorted by next ocurrence
 *
 * whenever `setTimeout()` or `setInterval()` is invoked, a timer gets added here
 *
const timersHeap = /* (...) *;

/*
 * a FIFO queue of immediates
 *
 * whenever `setImmediate()` is invoked, it gets added here
 *
const immediates = /* (...) *;

/*
 * a FIFO queue of next tick callbacks
 *
 * whenever `require('process').nextTick()` is invoked, the callback gets added here
 *
const nextTickCallbacks = [];

/*
 * a heap of Promise-related callbacks, sorted by promise constructors callbacks first,
 * and then resolved/rejected callbacks
 *
 * whenever a new Promise instance is created via `new Promise` or a promise resolves/rejects
 * the appropriate callback (if any) gets added here
 *
const promiseCallbacksHeap = /* ... ;

function execTicksAndPromises() {
  while (nextTickCallbacks.length || promiseCallbacksHeap.size()) {
    // execute all callbacks scheduled with `process.nextTick()`
    while (nextTickCallbacks.length) {
      const callback = nextTickCallbacks.shift();
      callback();
    }

    // execute all promise-related callbacks
    while (promiseCallbacksHeap.size()) {
      const callback = promiseCallbacksHeap.pop();
      callback();
    }
  }
}

try {
  // execute index.js
  require('./index');
  execTicksAndPromises();

  do {
    // timers phase: executes all elapsed timers
    getElapsedTimerCallbacks(timersHeap).forEach(callback => {
      callback();
      execTicksAndPromises();
    });

    // pending callbacks phase: executes some system operations (like `TCP errors`) that are not
    //                          executed in the poll phase
    getPendingCallbacks().forEach(callback => {
      callback();
      execTicksAndPromises();
    })

    // poll phase: gets completed non-blocking I/O events or thread pool tasks and invokes the
    //             corresponding callbacks; if there are none and there's no pending immediates,
    //             it blocks waiting for events/completed tasks for a maximum of `maxWait`
    const maxWait = computeWhenNextTimerElapses(timersHeap);
    pollForEventsFromKernelOrThreadPool(maxWait, immediates).forEach(callback => {
      callback();
      execTicksAndPromises();
    });

    // check phase: execute available immediates; if an immediate callback invokes `setImmediate()`
    //              it will be invoked on the next event loop iteration
    getImmediateCallbacks(immediates).forEach(callback => {
      callback();
      execTicksAndPromises();
    });

    // close callbacks phase: execute special `.on('close')` callbacks
    getCloseCallbacks().forEach(callback => {
      callback();
      execTicksAndPromises();
    });

    if (refs === 0) {
      // listeners of this event may execute code that increments `refs`
      process.emit('beforeExit');
    }
  } while (refs > 0);
} catch (err) {
  if (!process.listenerCount('uncaughtException')) {
    // default behavior: print stack and exit with status code 1
    console.error(err.stack);
    process.exit(1);
  } else {
    // there are listeners: emit the event and exit using `process.exitCode || 0`
    process.emit('uncaughtException');
    process.exit();
  }
}
   */

//AWS Lambda function handler types in Node.js
/**
 //Non-async handlers (i.e. callback)
 module.exports.handler = function (event, context, callback) {
  try {
    doSomething();
    callback(null, "Hello World!"); // Lambda returns "Hello World!"
  } catch (err) {
    // try/catch is not required, uncaught exceptions invoke `callback(err)` implicitly
    callback(err); // Lambda fails with `err`
  }
};

//Async handlers (i.e. use async/await or Promises)
// async/await
module.exports.handler = async function (event, context) {
  try {
    await doSomethingAsync();
    return "Hello World!"; // equivalent of: callback(null, "Hello World!");
  } catch (err) {
    // try/cath is not required, async functions always return a Promise
    throw err; // equivalent of: callback(err);
  }
};

// Promise
module.exports.handler = function (event, context) {
  /*
   * must return a `Promise` to be considered an async handler
   *
   * an uncaught exception that prevents a `Promise` to be returned
   * by the handler will "downgrade" the handler to non-async
   *
  return Promise.resolve()
    .then(() => doSomethingAsync())
    .then(() => "Hello World!");
};


//This fundamental difference is very important to understand in order to rationalize how sequelize may be affected by it. 
//Here are a few examples to illustrate the difference:
// no callback invoked
module.exports.handler = function () {
  // Lambda finishes AFTER `doSomething()` is invoked
  setTimeout(() => doSomething(), 1000);
};

// callback invoked
module.exports.handler = function (event, context, callback) {
  // Lambda finishes AFTER `doSomething()` is invoked
  setTimeout(() => doSomething(), 1000);
  callback(null, "Hello World!");
};

// callback invoked, context.callbackWaitsForEmptyEventLoop = false
module.exports.handler = function (event, context, callback) {
  // Lambda finishes BEFORE `doSomething()` is invoked
  context.callbackWaitsForEmptyEventLoop = false;
  setTimeout(() => doSomething(), 2000);
  setTimeout(() => callback(null, "Hello World!"), 1000);
};

// async/await
module.exports.handler = async function () {
  // Lambda finishes BEFORE `doSomething()` is invoked
  setTimeout(() => doSomething(), 1000);
  return "Hello World!";
};

// Promise
module.exports.handler = function () {
  // Lambda finishes BEFORE `doSomething()` is invoked
  setTimeout(() => doSomething(), 1000);
  return Promise.resolve("Hello World!");
};
 */

//AWS Lambda execution envvironments (i.e. containers)
/**
let sequelize = null;

module.exports.handler = async function () {
  /*
   * sequelize will already be loaded if the container is re-used
   *
   * containers are never re-used when a Lambda function's code change
   *
   * while the time elapsed between Lambda invocations is used as a factor to determine whether
   * a container is re-used, no assumptions should be made of when a container is actually re-used
   *
   * AWS does not publicly document the rules of container re-use "by design" since containers
   * can be recycled in response to internal AWS Lambda events (e.g. a Lambda function container
   * may be recycled even if the function is constanly invoked)
   *
  if (!sequelize) {
    sequelize = await loadSequelize();
  }

  return await doSomethingWithSequelize(sequelize);
}; 

// When a Lambda function doesn't wait for the event loop to be empty and 
// a container is re-used, the event loop will be "paused" until the next invocation occurs. For example:
let counter = 0;

module.exports.handler = function (event, context, callback) {
  /*
   * The first invocation (i.e. container initialized) will:
   * - log:
   *   - Fast timeout invoked. Request id: 00000000-0000-0000-0000-000000000000 | Elapsed ms: 5XX
   * - return: 1
   *
   * Wait 3 seconds and invoke the Lambda again. The invocation (i.e. container re-used) will:
   * - log:
   *   - Slow timeout invoked. Request id: 00000000-0000-0000-0000-000000000000 | Elapsed ms: 3XXX
   *   - Fast timeout invoked. Request id: 11111111-1111-1111-1111-111111111111 | Elapsed ms: 5XX
   * - return: 3
   *
  const now = Date.now();

  context.callbackWaitsForEmptyEventLoop = false;

  setTimeout(() => {
    console.log(
      "Slow timeout invoked. Request id:",
      context.awsRequestId,
      "| Elapsed ms:",
      Date.now() - now
    );
    counter++;
  }, 1000);

  setTimeout(() => {
    console.log(
      "Fast timeout invoked. Request id:",
      context.awsRequestId,
      "| Elapsed ms:",
      Date.now() - now
    );
    counter++;
    callback(null, counter);
  }, 500);
};
*/ 

//Sequelize connection pooling in AWS lambda
/**
 * Given the fact that AWS Lambda containers process one request at a time, one would be tempted to configure sequelize as follows:
 const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(/* (...) , {
  // (...)
  pool: { min: 1, max: 1 }
});
 */

//Detailed race condition example
/*
//runtime/Runtime.js
class Runtime {
  // (...)

  // each iteration is executed in the event loop `check` phase
  scheduleIteration() {
    setImmediate(() => this.handleOnce().then(/* (...) *));
}

async handleOnce() {
  // get next invocation. see: https://docs.aws.amazon.com/lambda/latest/dg/runtimes-api.html#runtimes-api-next
  let { bodyJson, headers } = await this.client.nextInvocation();

  // prepare `context` handler parameter
  let invokeContext = new InvokeContext(headers);
  invokeContext.updateLoggingContext();

  // prepare `callback` handler parameter
  let [callback, callbackContext] = CallbackContext.build(
    this.client,
    invokeContext.invokeId,
    this.scheduleIteration.bind(this)
  );

  try {
    // this listener is subscribed to process.on('beforeExit')
    // so that when when `context.callbackWaitsForEmptyEventLoop === true`
    // the Lambda execution finishes after the event loop is empty
    this._setDefaultExitListener(invokeContext.invokeId);

    // execute handler
    const result = this.handler(
      JSON.parse(bodyJson),
      invokeContext.attachEnvironmentData(callbackContext),
      callback
    );

    // finish the execution if the handler is async
    if (_isPromise(result)) {
      result
        .then(callbackContext.succeed, callbackContext.fail)
        .catch(callbackContext.fail);
    }
  } catch (err) {
    callback(err);
  }
}
}


//The runtime schedules an iteration at the end of the initialization code:

runtime/index.js
// (...)
new Runtime(client, handler, errorCallbacks).scheduleIteration();
*/

//sequelize.js
/**
 class Sequelize {
  // (...)

  query(sql, options) {
    // (...)

    const connection = await this.connectionManager.getConnection(options);
    const query = new this.dialect.Query(connection, this, options);

    try {
      return await query.run(sql, bindParameters);
    } finally {
      await this.connectionManager.releaseConnection(connection);
    }
  }
}

 */

//mysql/connection-manager.js
/**
 class ConnectionManager {
  // (...)

  async connect(config) {
    // (...)
    return await new Promise((resolve, reject) => {
      // uses mysql2's `new Connection()`
      const connection = this.lib.createConnection(connectionConfig);

      const errorHandler = (e) => {
        connection.removeListener("connect", connectHandler);
        connection.removeListener("error", connectHandler);
        reject(e);
      };

      const connectHandler = () => {
        connection.removeListener("error", errorHandler);
        resolve(connection);
      };

      connection.on("error", errorHandler);
      connection.once("connect", connectHandler);
    });
  }
}
 */

//mysql2/connection.js
/***
 class Connection extends EventEmitter {
  constructor(opts) {
    // (...)

    // create Socket
    this.stream = /* (...) ;

    // when data is received, clear timeout
    this.stream.on('data', data => {
        if (this.connectTimeout) {
          Timers.clearTimeout(this.connectTimeout);
          this.connectTimeout = null;
        }
        this.packetParser.execute(data);
      });
  
      // (...)
  
      // when handshake is completed, emit the 'connect' event
      handshakeCommand.on('end', () => {
        this.emit('connect', handshakeCommand.handshake);
      });
  
      // set a timeout to trigger if no data is received on the socket
      if (this.config.connectTimeout) {
        const timeoutHandler = this._handleTimeoutError.bind(this);
        this.connectTimeout = Timers.setTimeout(
          timeoutHandler,
          this.config.connectTimeout
        );
      }
    }
  
    // (...)
  
    _handleTimeoutError() {
      if (this.connectTimeout) {
        Timers.clearTimeout(this.connectTimeout);
        this.connectTimeout = null;
      }
      this.stream.destroy && this.stream.destroy();
      const err = new Error('connect ETIMEDOUT');
      err.errorno = 'ETIMEDOUT';
      err.code = 'ETIMEDOUT';
      err.syscall = 'connect';
  
      // this will emit the 'error' event
      this._handleNetworkError(err);
    }
  }
 */
