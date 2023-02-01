function _getDummyCollection() {
  const Collection = typeof Mongo !== "undefined" ? Mongo.Collection : Meteor.Collection;
  return new Collection("__dummy_coll_" + Random.id());
}

async function _getSynchronousCursor(cursor) {
  await cursor.fetchAsync();
  return cursor._synchronousCursor || undefined;
}

async function _getMultiplexer(cursor) {
  const handler = await cursor.observeChanges({ added: Function.prototype });
  await handler.stop();

  return handler._multiplexer;
}

async function _getObserverDriver(cursor) {
  const multiplexer = await _getMultiplexer(cursor);

  return multiplexer && multiplexer._observeDriver || undefined;
}

async function exposeOplogDriver(namespace, coll) {
  const driver = _getObserverDriver(coll.find({}));
  // verify observer driver is an oplog driver
  if (driver && typeof driver.constructor.cursorSupported === "function") {
    namespace.MongoOplogDriver = driver.constructor;
  }
}

async function exposePollingDriver(namespace, coll) {
  const cursor = coll.find({}, { limit: 20, _disableOplog: true });
  const driver = _getObserverDriver(cursor);
  // verify observer driver is a polling driver
  if (driver && typeof driver.constructor.cursorSupported === "undefined") {
    namespace.MongoPollingDriver = driver.constructor;
  }
}

async function exposeSynchronousCursor(namespace, coll) {
  const synchronousCursor = await _getSynchronousCursor(coll.find({}));
  if (synchronousCursor) {
    namespace.SynchronousCursor = synchronousCursor.constructor;
  }
}

async function exposeMultiplexer(namespace, coll) {
  const multiplexer = await _getMultiplexer(coll.find({}));

  if (multiplexer) {
    namespace.Multiplexer = multiplexer.constructor;
  }
}

export async function exposeMongoAsync(namespace) {
  const isMongoInstalled = Package.hasOwnProperty('mongo');

  if (!isMongoInstalled) {
    return;
  }

  import { MongoInternals } from "meteor/mongo";

  const coll = _getDummyCollection();

  await coll.findOneAsync()

  namespace.MongoConnection = MongoInternals.defaultRemoteCollectionDriver().mongo.constructor;
  const cursor = coll.find();
  namespace.MongoCursor = cursor.constructor;

  await exposeOplogDriver(namespace, coll);
  await exposePollingDriver(namespace, coll);
  await exposeMultiplexer(namespace, coll);
  await exposeSynchronousCursor(namespace, coll);
}
