# MeteorX ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/monti-apm/meteorx/Test?style=flat-square)
Exposes internal Meteor APIs.

Based on [lamhieu-vk/meteorx](https://github.com/lamhieu-vk/meteorx).

## Available APIs on Server-side

```js
MeteorX {
  Server: [Function: Server],
  // livedata
  Session: [Function: Session],
  Subscription: [Function: Subscription],
  SessionCollectionView: [Function: SessionCollectionView],
  SessionDocumentView: [Function: SessionDocumentView],
  // mongo-livedata
  MongoConnection: { [Function: MongoConnection] _isCannotChangeIdError: [Function] },
  MongoCursor: [Function: Cursor],
  MongoOplogDriver: { [Function: OplogObserveDriver] cursorSupported: [Function] },
  MongoPollingDriver: [Function: PollingObserveDriver],
  Multiplexer: [Function: ObserveMultiplexer],
  SynchronousCursor: [Function: SynchronousCursor],
}
```

## Installation

read more in [atmospherejs](https://atmospherejs.com/montiapm/meteorx)

```bash
$ meteor add montiapm:meteorx
```

## What you can do with this

Think about your meteor related issues and fix them. Some of them are:

- Unblock Subscriptions
- Remove MergeBox
