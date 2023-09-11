Package.describe({
  summary: "Exposes internal Meteor APIs",
  version: "2.3.0",
  git: "https://github.com/montiapm/meteorx.git",
  name: "montiapm:meteorx",
});

Package.onUse(function(api) {
  configurePackage(api);
  api.export(["MeteorX"]);
});

Package.onTest(function(api) {
  configurePackage(api);
  api.use(["tinytest"], "server");
  api.addFiles(["test/server.js"], "server");
});

function configurePackage(api) {
  api.versionsFrom("METEOR@1.4");
  api.use(["random", "ecmascript"], "server");

  /**
   * @todo Switch to `weak` dependency once the issue has been fixed.
   */
  api.use(["mongo", "ddp-server"], "server");
  api.addFiles(["src/livedata.js", "src/mongo-livedata.js", "src/server.js"], "server");
}
