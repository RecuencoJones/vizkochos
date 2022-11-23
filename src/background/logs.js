const { PassThrough } = require('stream');
const { EventEmitter } = require('events');
const { Log } = require('@kubernetes/client-node');
const { loadKubeConfig } = require('./kubernetes');

const instances = new Map();

const createLogStreamName = (namespace, podName, containerName) => `logs:${ namespace }:${ podName }:${ containerName }`;

class LogsEmitter extends EventEmitter {
  constructor(context, podName, containerName) {
    super();

    this.context = context;
    this.podName = podName;
    this.containerName = containerName;
  }

  async init() {
    const config = await loadKubeConfig(this.context);
    const log = new Log(config);

    this._stream = new PassThrough();

    this._stream.on('data', (chunk) => {
      this.emit('data', chunk.toString());
    });

    this._request = await log.log(
      this.context.namespace,
      this.podName,
      this.containerName,
      this._stream,
      { follow: true, tailLines: 20 }
    );
  }

  stop() {
    this._stream.destroy();
    this._request.abort();
  }
}

async function getLogEmitter(context, podName, containerName) {
  const streamName = createLogStreamName(context, podName, containerName);

  if (!instances.has(streamName)) {
    const instance = new LogsEmitter(context, podName, containerName);

    instances.set(streamName, instance);

    await instance.init();
  }

  return instances.get(streamName);
}

function stopLogEmitter(context, podName, containerName) {
  const streamName = createLogStreamName(context, podName, containerName);

  if (instances.has(streamName)) {
    const emitter = instances.get(streamName);

    emitter.stop();

    instances.delete(streamName);
  }
}

module.exports = { getLogEmitter, stopLogEmitter };
