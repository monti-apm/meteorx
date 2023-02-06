import { exposeMongoLivedata } from "./mongo-livedata";
import { isFibersInstalled, runWithAFiber } from "./utils";
import { exposeMongoAsync } from "./fiberless/mongo";

/**
 * @namespace MeteorX
 */
MeteorX = {};

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

if (isFibersInstalled) {
  Meteor.startup(function() {
    runWithAFiber(() => {
      exposeMongoLivedata(MeteorX);
    });

    MeteorX._readyCallbacks.map(runWithAFiber);
    MeteorX._ready = true;
  });
} else {
  Meteor.startup(async function() {
    await exposeMongoAsync(MeteorX);

    for (const cb of MeteorX._readyCallbacks) {
      await cb();
    }

    MeteorX._ready = true;
  })
}



