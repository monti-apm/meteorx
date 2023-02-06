export const isFibersInstalled = isInstalled('fibers');

export function isInstalled (x) {
  try {
    return Boolean(require(x));
  } catch (e) {
    return false;
  }
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
