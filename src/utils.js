export function isInstalled(x) {
  try {
    return Boolean(Npm.require(x));
  } catch (e) {
    return false;
  }
}
