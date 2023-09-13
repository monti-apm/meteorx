import { exposeMongoLivedata } from "./mongo-livedata";
import { runWithAFiber } from "./utils";
import { exposeMongoAsync } from "./fiberless/mongo";

/**
 * @namespace MeteorX
 */
MeteorX = {};

MeteorX._mongoInstalled = Package.hasOwnProperty("mongo");
MeteorX._readyCallbacks = [];
MeteorX._ready = false;
MeteorX._fibersDisabled = Meteor.isFibersDisabled;

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

Meteor.startup(MeteorX._fibersDisabled ? initAsync : initSync);



