# MeteorX

[![github issues][github-issues-image]][github-issues-url]
[![build status][travis-image]][github-project-url]

Exposing internal Meteor APIs to hack Meteor easily, fork from [meteorhacks/meteorx](https://github.com/meteorhacks/meteorx).
I will maintain it and update it in the future. If you find an error, please open the issue in this project!

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

read more in [atmospherejs](https://atmospherejs.com/lamhieu/meteorx)

```bash
$ meteor add lamhieu:meteorx
```

## What you can do with this

Think about your meteor related issues and fix them. Some of them are:

- Unblock Subscriptions
- Remove MergeBox

[github-project-url]: https://github.com/lamhieu-vk/meteorx
[travis-image]: https://travis-ci.com/lamhieu-vk/meteorx.svg?branch=master
[github-issues-image]: https://img.shields.io/github/issues/lamhieu-vk/meteorx.svg
[github-issues-url]: https://github.com/lamhieu-vk/meteorx/issues
