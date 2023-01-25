Package.describe({
  summary: "Exposes internal Meteor APIs",
  version: "2.2.0",
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
  api.versionsFrom("METEOR@1.0");
  api.use(["random", "ecmascript"], "server");
  api.use("mongo", "server", { weak: true });
  api.addFiles(["src/livedata.js", "src/mongo-livedata.js", "src/server.js"], "server");
}
