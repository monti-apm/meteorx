exposeMongoLivedata = function(namespace) {
  const MongoColl = typeof Mongo !== "undefined" ? Mongo.Collection : Meteor.Collection;
  const coll = new MongoColl("__dummy_coll_" + Random.id());
  // we need wait until db get connected with meteor, .findOne() does that
  coll.findOne();

  namespace.MongoConnection = MongoInternals.defaultRemoteCollectionDriver().mongo.constructor;
  const cursor = coll.find();
  namespace.MongoCursor = cursor.constructor;
  exposeOplogDriver(namespace, coll);
  exposePollingDriver(namespace, coll);
  exposeMultiplexer(namespace, coll);
  exposeSyncronousCursor(namespace, coll);
};

function exposeSyncronousCursor(namespace, coll) {
  const synchronousCursor = _getSyncronousCursor(coll.find({}));
  if (synchronousCursor) {
    namespace.SyncronousCursor = synchronousCursor.constructor;
  }
}

function exposeOplogDriver(namespace, coll) {
  const driver = _getObserverDriver(coll.find({}));
  // verify observer driver is an oplog driver
  if (driver && typeof driver.constructor.cursorSupported === "function") {
    namespace.MongoOplogDriver = driver.constructor;
  }
}

function exposePollingDriver(namespace, coll) {
  const cursor = coll.find({}, { limit: 20, _disableOplog: true });
  const driver = _getObserverDriver(cursor);
  // verify observer driver is a polling driver
  if (driver && typeof driver.constructor.cursorSupported === "undefined") {
    namespace.MongoPollingDriver = driver.constructor;
  }
}

function exposeMultiplexer(namespace, coll) {
  const multiplexer = _getMultiplexer(coll.find({}));
  if (multiplexer) {
    namespace.Multiplexer = multiplexer.constructor;
  }
}

function _getObserverDriver(cursor) {
  const multiplexer = _getMultiplexer(cursor);
  if (multiplexer && multiplexer._observeDriver) {
    return multiplexer._observeDriver;
  }
}

function _getMultiplexer(cursor) {
  const handler = cursor.observeChanges({ added: Function.prototype });
  handler.stop();
  return handler._multiplexer;
}

function _getSyncronousCursor(cursor) {
  cursor.fetch();
  const synchronousCursor = cursor._synchronousCursor;
  if (synchronousCursor) {
    return synchronousCursor;
  }
}
