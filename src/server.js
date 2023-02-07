import { exposeMongoLivedata } from "./mongo-livedata";
import { isFibersInstalled, isMongoInstalled, runWithAFiber, wrapFn } from "./utils";
import { exposeMongoAsync } from "./fiberless/mongo";

/**
 * @namespace MeteorX
 */
MeteorX = {};

MeteorX._hasInitializedMongo = false;

if (isMongoInstalled) {
  const { MongoInternals } = require('meteor/mongo');

  MongoInternals.defaultRemoteCollectionDriver = wrapFn(MongoInternals.defaultRemoteCollectionDriver, function (fn, args) {
    MeteorX._hasInitializedMongo = true;

    return fn.apply(this, args);
  })
}

MeteorX._readyCallbacks = [];
MeteorX._ready = false;
MeteorX._isFibersInstalled = isFibersInstalled;

MeteorX.onReady = function(cb) {
  if (MeteorX._ready) {
    return runWithAFiber(cb);
  }

  this._readyCallbacks.push(cb);
};

MeteorX.Server = Meteor.server.constructor;

exposeLivedata(MeteorX);

function initSync() {
  runWithAFiber(() => {
    exposeMongoLivedata(MeteorX);
  });

  MeteorX._readyCallbacks.map(runWithAFiber);
  MeteorX._ready = true;
}

async function initAsync() {
  await exposeMongoAsync(MeteorX);

  for (const cb of MeteorX._readyCallbacks) {
    await cb();
  }

  MeteorX._ready = true;
}

Meteor.startup(isFibersInstalled ? initSync : initAsync);



