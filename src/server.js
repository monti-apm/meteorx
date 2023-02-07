import { exposeMongoLivedata } from "./mongo-livedata";
import { isFibersInstalled, isMongoInstalled, runWithAFiber, wrapFn } from "./utils";
import { exposeMongoAsync } from "./fiberless/mongo";
import { installMongoDetector } from "./mongo-detector";

/**
 * @namespace MeteorX
 */
MeteorX = {};

MeteorX._hasInitializedMongo = false;
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

installMongoDetector(MeteorX);

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



