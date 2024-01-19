import { Mongo, MongoInternals } from "meteor/mongo";

export async function exposeMongoAsync(MeteorX) {
  if (!MeteorX._mongoInstalled) return

  import { MongoInternals } from "meteor/mongo";

  const coll = _getDummyCollection();

  await coll.findOneAsync();

  const driver = MongoInternals.defaultRemoteCollectionDriver();

  MeteorX.MongoConnection = driver.mongo.constructor;
  const cursor = coll.find();
  MeteorX.MongoCursor = cursor.constructor;

  await exposeOplogDriver(MeteorX, coll);
  await exposePollingDriver(MeteorX, coll);
  await exposeMultiplexer(MeteorX, coll);
  await exposeSynchronousCursor(MeteorX, coll);
}

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
  const driver = await _getObserverDriver(coll.find({}));
  // verify observer driver is an oplog driver
  if (driver && typeof driver.constructor.cursorSupported === "function") {
    namespace.MongoOplogDriver = driver.constructor;
  }
}

async function exposePollingDriver(namespace, coll) {
  const cursor = coll.find({}, { limit: 20, _disableOplog: true });
  const driver = await _getObserverDriver(cursor);
  // verify observer driver is a polling driver
  if (driver && typeof driver.constructor.cursorSupported === "undefined") {
    namespace.MongoPollingDriver = driver.constructor;
  }
}

async function exposeSynchronousCursor(namespace, coll) {
  const synchronousCursor = await _getSynchronousCursor(coll.find({}));
  if (synchronousCursor) {
    namespace.SynchronousCursor = synchronousCursor.constructor;
    // Meteor 3 automatically exposes the AsynchronousCursor in place of the SynchronousCursor.
    // TODO: Check how this evolves in the Meteor codebase, the references might be renamed as
    // the AsyncCursor is now the default.
    namespace.AsynchronousCursor = namespace.SynchronousCursor;
  }
}

async function exposeMultiplexer(namespace, coll) {
  const multiplexer = await _getMultiplexer(coll.find({}));

  if (multiplexer) {
    namespace.Multiplexer = multiplexer.constructor;
  }
}
