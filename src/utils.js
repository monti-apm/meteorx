export const isFibersInstalled = isInstalled('fibers');

export const isMongoInstalled = Package.hasOwnProperty('mongo');

export function isInstalled (x) {
  try {
    return Boolean(require(x));
  } catch (e) {
    return false;
  }
}

export function wrapFn(fn, wrapper) {
  return function (...args) {
    return wrapper.call(this, fn, args);
  };
}

export function runWithAFiber (cb) {
  if (!isFibersInstalled) {
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
