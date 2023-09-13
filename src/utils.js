export function runWithAFiber (cb) {
  if (Meteor.isFibersDisabled) {
    cb();
    return;
  }

  const Fibers = require('fibers');

  if (Fibers.current) {
    cb();
  } else {
    new Fiber(cb).run();
  }
}
