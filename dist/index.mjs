// src/clients/mqtt-client.ts
import mqtt from "mqtt";
function normalizeFilter(filter) {
  if (filter.startsWith("$share/")) {
    const parts = filter.split("/");
    if (parts.length >= 3) {
      return parts.slice(2).join("/");
    }
  }
  return filter;
}
function isWildcardTopic(filter) {
  return filter.includes("+") || filter.includes("#");
}
function mqttFilterToRegex(filter) {
  const real = normalizeFilter(filter);
  const escaped = real.split("/").map((part) => {
    if (part === "+") return "[^/]+";
    if (part === "#") return ".*";
    return part.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  }).join("/");
  return new RegExp(`^${escaped}$`);
}
var MQTTClient = class _MQTTClient {
  constructor() {
    this.client = null;
    this.clientId = "";
    // exact matches: topic -> callbacks[]
    this.exactSubs = /* @__PURE__ */ new Map();
    // wildcard matches
    this.wildcardSubs = [];
    // לשחזור subscriptions אחרי reconnect
    this.allSubs = [];
    this.connected = false;
  }
  static {
    this.instance = null;
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new _MQTTClient();
    }
    return this.instance;
  }
  isConnected() {
    return this.connected;
  }
  async connectAndWait({ clientId, username, password, broker, port, connection_timeout = 1e4 }) {
    return new Promise((resolve, reject) => {
      const url = `mqtts://${broker}:${port}/mqtt`;
      const options = {
        clientId,
        username,
        password,
        keepalive: 60,
        clean: true,
        protocolVersion: 5,
        rejectUnauthorized: true,
        properties: { userProperties: { client_id: clientId } }
      };
      this.clientId = clientId;
      console.log(`Connecting to MQTT broker at ${broker}:${port}...`);
      const client = mqtt.connect(url, options);
      this.client = client;
      const timer = setTimeout(() => {
        client.end(true);
        reject(new Error(`MQTT connect timeout after ${connection_timeout}ms`));
      }, connection_timeout);
      client.on("connect", (packet) => {
        clearTimeout(timer);
        this.connected = true;
        console.log("\u{1F50C} MQTT connected");
        this.resubscribeAll();
        resolve(client);
      });
      client.on("message", (topic, payload, packet) => {
        this.dispatchMessage(topic, payload, packet);
      });
      client.on("reconnect", () => {
        console.log("MQTT reconnecting...");
      });
      client.on("close", () => {
        console.log("MQTT connection closed");
        this.connected = false;
      });
      client.on("end", () => {
        console.log("MQTT connection ended");
        this.connected = false;
      });
      client.on("error", (err) => {
        console.error("MQTT connection error:", err);
        if (!this.connected) {
          clearTimeout(timer);
          client.end(true);
          reject(err);
        }
      });
    });
  }
  dispatchMessage(topic, payload, packet) {
    const exactCallbacks = this.exactSubs.get(topic);
    if (exactCallbacks) {
      for (const cb of exactCallbacks) cb(topic, payload, packet);
    }
    if (this.wildcardSubs.length > 0) {
      for (const sub of this.wildcardSubs) {
        if (sub.regex && sub.regex.test(topic)) {
          sub.callback(topic, payload, packet);
        }
      }
    }
  }
  addSubscribe(subscribe) {
    console.log("Trying to subscribe to topic:", subscribe.topic);
    const filter = normalizeFilter(subscribe.topic);
    const stored = {
      originalTopic: subscribe.topic,
      filter,
      callback: subscribe.callback,
      regex: void 0
    };
    if (isWildcardTopic(filter)) {
      stored.regex = mqttFilterToRegex(subscribe.topic);
      this.wildcardSubs.push(stored);
    } else {
      const arr = this.exactSubs.get(filter) ?? [];
      arr.push(subscribe.callback);
      this.exactSubs.set(filter, arr);
    }
    this.allSubs.push(stored);
    if (this.connected && this.client) {
      this.client.subscribe(subscribe.topic, { qos: 0 }, (err) => {
        if (!err) {
          console.log(`Subscribed to topic: ${subscribe.topic}`);
        } else {
          console.error(`Failed to subscribe to topic: ${subscribe.topic}`, err);
        }
      });
    }
  }
  resubscribeAll() {
    if (!this.client) return;
    for (const sub of this.allSubs) {
      this.client.subscribe(sub.originalTopic, { qos: 0 }, (err) => {
        if (err) {
          console.error("Resubscribe failed:", sub.originalTopic, err);
        }
      });
    }
  }
  publish(topic, payload, qos = 0, retain = false) {
    return new Promise((resolve, reject) => {
      if (!this.client || !this.connected) {
        return reject(new Error("MQTT client not connected"));
      }
      const data = typeof payload === "string" || Buffer.isBuffer(payload) ? payload : JSON.stringify(payload);
      this.client.publish(
        topic,
        data,
        {
          qos,
          retain,
          properties: this.clientId ? { userProperties: { client_id: this.clientId } } : void 0
        },
        (err) => err ? reject(err) : resolve()
      );
    });
  }
};

// src/init.ts
import { v4 as uuidv4 } from "uuid";
async function initializeClient(clientInfo, piano_id, cb, shared, consumer_group) {
  if (!piano_id) {
    throw new Error("Piano ID is required to initialize the MQTT client.");
  }
  const mqttClient = MQTTClient.getInstance();
  const subscribation = buildSubscribation(piano_id, cb, shared, consumer_group);
  mqttClient.addSubscribe(subscribation);
  await mqttClient.connectAndWait({ ...clientInfo, clientId: uniqueClient(piano_id) });
}
var uniqueClient = (piano_id) => {
  const uuid = uuidv4();
  return `${piano_id}_${uuid}`;
};
var buildSubscribation = (piano_id, cb, shared, consumer_group) => {
  if (shared && consumer_group) {
    return {
      topic: `$share/${consumer_group}/piano/play/${piano_id}`,
      callback: cb
    };
  } else {
    return {
      topic: `piano/play/${piano_id}`,
      callback: cb
    };
  }
};
export {
  initializeClient
};
//# sourceMappingURL=index.mjs.map