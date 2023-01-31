import { exposeMongoLivedata } from "./mongo-livedata";
import { isInstalled } from "./utils";

const isFibersInstalled = isInstalled("fibers");

console.log({ isFibersInstalled})

MeteorX = {};

MeteorX._readyCallbacks = [];
MeteorX._ready = false;
MeteorX._isFibersInstalled = isFibersInstalled;
MeteorX._started = false;

console.log({ isFibersInstalled }, 2)

MeteorX._expose = async function() {

}

console.log({ isFibersInstalled }, 3)


// MeteorX.onReady = function(cb) {
//   if (MeteorX._ready) {
//     return runWithAFiber(cb);
//   }
//
//   this._readyCallbacks.push(cb);
// };

console.log(Meteor.server);


console.log({ isFibersInstalled }, 4)

// exposeLivedata(MeteorX);

// before using any other MeteorX apis we need to hijack Mongo related code
// that'w what we are doing here.

console.log('Adding startup callback')



Meteor.startup(async function() {
  MeteorX._started = true;

  runWithAFiber(function() {
    exposeMongoLivedata(MeteorX);
  });

  MeteorX._readyCallbacks.forEach(function(fn) {
    runWithAFiber(fn);
  });

  MeteorX._ready = true;
}, 'MeteorX');

function runWithAFiber(cb) {
  console.log({ isFibersInstalled })

  if (!isFibersInstalled) {
    cb();
    return;
  }

  const Fibers = Npm.require("fibers");

  if (Fibers.current) {
    cb();
  } else {
    new Fiber(cb).run();
  }
}
