import { isFibersInstalled, isMongoInstalled, wrapFn } from "./utils";
import { exposeMongoLivedata } from "./mongo-livedata";
import { exposeMongoAsync } from "./fiberless/mongo";

export function installMongoDetector(MeteorX) {
  if (isMongoInstalled) {
    const { MongoInternals } = require('meteor/mongo');

    MongoInternals.defaultRemoteCollectionDriver = wrapFn(MongoInternals.defaultRemoteCollectionDriver, function (fn, args) {
      if (!MeteorX._hasInitializedMongo) {

        const driver = fn.apply(this, args);

        if (MeteorX._ready) {
          if (isFibersInstalled) {
            exposeMongoLivedata(MeteorX);
          } else {
            exposeMongoAsync(MeteorX).catch(console.error);
          }
        }

        MeteorX._hasInitializedMongo = true;

        return driver;
      }

      return fn.apply(this, args);
    })
  }
}
