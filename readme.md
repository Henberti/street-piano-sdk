# **Street Piano SDK**

A lightweight TypeScript/Node.js SDK for connecting securely to the** ** **Street Piano MQTT Broker** , receiving MIDI events, and reacting to piano activity in real time.

This SDK is used internally by** ****Street Piano** and by integrators who receive access credentials and a unique** ****Piano ID**from the company.

---

## 🚀 Installation

<pre class="overflow-visible!" data-start="446" data-end="497"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>npm install @chenberti/street-piano-sdk
</span></span></code></div></div></pre>

Or with yarn:

<pre class="overflow-visible!" data-start="514" data-end="562"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-bash"><span><span>yarn add @chenberti/street-piano-sdk
</span></span></code></div></div></pre>

---

## 📦 Quick Start Example

<pre class="overflow-visible!" data-start="596" data-end="1268"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-ts"><span><span>import</span><span> { </span><span>ClinetInfo</span><span>, </span><span>SubCB</span><span>, initializeClient } </span><span>from</span><span></span><span>'@chenberti/street-piano-sdk'</span><span>
</span><span>import</span><span> dotenv </span><span>from</span><span></span><span>'dotenv'</span><span>

dotenv.</span><span>config</span><span>()

</span><span>const</span><span></span><span>clientInfo</span><span>: </span><span>ClinetInfo</span><span> = {
  </span><span>password</span><span>: process.</span><span>env</span><span>.</span><span>MQTT_PASSWORD</span><span> || </span><span>''</span><span>,
  </span><span>broker</span><span>: process.</span><span>env</span><span>.</span><span>MQTT_BROKER</span><span> || </span><span>''</span><span>,
  </span><span>port</span><span>: process.</span><span>env</span><span>.</span><span>MQTT_PORT</span><span> ? </span><span>parseInt</span><span>(process.</span><span>env</span><span>.</span><span>MQTT_PORT</span><span>) : </span><span>8883</span><span>,
  </span><span>username</span><span>: process.</span><span>env</span><span>.</span><span>MQTT_USERNAME</span><span> || </span><span>''</span><span>,
}

</span><span>const</span><span></span><span>callback</span><span>: </span><span>SubCB</span><span> = </span><span>(topic, payload, packet</span><span>) => {
  </span><span>console</span><span>.</span><span>log</span><span>(</span><span>`New message on topic: ${topic}</span><span>`)
  </span><span>console</span><span>.</span><span>log</span><span>(</span><span>`Payload: ${payload.toString()}</span><span>`)
  </span><span>console</span><span>.</span><span>log</span><span>(</span><span>`Packet: ${JSON</span><span>.stringify(packet)}`)
}

</span><span>const</span><span></span><span>main</span><span> = </span><span>async</span><span> (</span><span></span><span>) => {
  </span><span>await</span><span></span><span>initializeClient</span><span>(clientInfo, </span><span>'1234'</span><span>, callback)
}

</span><span>main</span><span>()
</span></span></code></div></div></pre>

---

## 🎹 Understanding the SDK

### `initializeClient(clientInfo, pianoId, callback)`

This is the main function provided by the SDK.

#### **Parameters**

| Parameter      | Type           | Description                                                  |
| -------------- | -------------- | ------------------------------------------------------------ |
| `clientInfo` | `ClinetInfo` | Connection information for the MQTT broker.                  |
| `pianoId`    | `string`     | The unique Piano ID provided by Street Piano.                |
| `callback`   | `SubCB`      | Function that fires whenever a new MIDI message is received. |

#### What** **`initializeClient` does

* Establishes a secure MQTT connection.
* Authenticates using your credentials.
* Subscribes to the topic belonging to the given piano ID.
* Listens for incoming messages.
* Triggers your callback automatically for each new MIDI event.

---

## 🧩 Types

### `ClinetInfo`

Connection settings required to authenticate:

<pre class="overflow-visible!" data-start="2129" data-end="2233"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-ts"><span><span>interface</span><span></span><span>ClinetInfo</span><span> {
  </span><span>username</span><span>: </span><span>string</span><span>
  </span><span>password</span><span>: </span><span>string</span><span>
  </span><span>broker</span><span>: </span><span>string</span><span>
  </span><span>port</span><span>: </span><span>number</span><span>
}
</span></span></code></div></div></pre>

These are usually taken from environment variables.

---

### `SubCB`

Callback definition for incoming messages:

<pre class="overflow-visible!" data-start="2350" data-end="2426"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-ts"><span><span>type</span><span></span><span>SubCB</span><span> = </span><span>(topic: string</span><span>, payload: Buffer, packet: </span><span>any</span><span>) => </span><span>void</span><span>
</span></span></code></div></div></pre>

* `topic` → MQTT topic
* `payload` → Buffer containing the MIDI message
* `packet` → Raw MQTT packet

---

## 🎵 MIDI Payload Explanation

All messages received through this SDK originate from the Street Piano system and contain **MIDI events**.

### ✅ Topic format

Incoming messages are published to:

```
piano/play/<piano_id>
```

Example topic:

```
piano/play/68ce6762f775e17b114e899d
```

### ✅ How to parse the message

Your callback receives the MQTT `payload` as a **Buffer**.  
To extract the structured data, you **must** parse it like this:

```ts
const { payload, timestamp, topic } = JSON.parse(payload.toString());
```

### Example parsed payload

```json
{
  "payload": {
    "type": "note_on",
    "time": 0,
    "note": 91,
    "velocity": 34,
    "channel": 0
  },
  "timestamp": 1763795201.983794,
  "topic": "piano/play/68ce6762f775e17b114e899d"
}
```

---

### Field explanations

#### `payload` (MIDI message)

This object is a standard MIDI event produced by the piano.

- **`type`**
  - `note_on`: a key was pressed.
  - `note_off`: a key was released.

- **`note`**
  MIDI note number (`0–127`).  
  Each value maps to a musical pitch on the keyboard.  
  Example: `91` is a high note.

- **`velocity`**
  How strongly the key was pressed (`0–127`).  
  Higher velocity = louder / stronger press.  
  **Note:** a `note_on` with velocity `0` is often treated as `note_off`.

- **`channel`**
  MIDI channel (`0–15`).  
  Most pianos use channel `0`, but setups with multiple instruments may use others.

- **`time`**
  Delta time (seconds) relative to the previous MIDI event.  
  In real-time streaming it is often `0`.

#### `timestamp`

Unix timestamp (seconds, including fractions) indicating **when the event was produced/sent** by the piano system.  
Useful for ordering events, measuring latency, or syncing visuals.

#### `topic`

The MQTT topic the message arrived on:

```
piano/play/<piano_id>
```


---

## 🎹 Piano ID (IMPORTANT)

You must pass a valid** ****Piano ID** when calling** **`initializeClient`:

<pre class="overflow-visible!" data-start="3128" data-end="3190"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-ts"><span><span>await</span><span></span><span>initializeClient</span><span>(clientInfo, </span><span>"1234"</span><span>, callback)
</span></span></code></div></div></pre>

This** **`"1234"` is a unique ID assigned by Street Piano.

* Each piano has its own ID
* You can only subscribe to pianos you were authorized to access
* If you do not know your piano ID, contact Street Piano support

---

## ❗ Error Handling

The SDK automatically protects your application from:

* Duplicate MQTT clientId issues
* Reconnect storms
* Forced disconnections
* Session takeover events

If a fatal problem occurs, the SDK** ****stops reconnecting** and informs you through logs/events.

---

## 🤝 Support

For credentials, piano IDs, or integration help:

📧** **henb@software-berti-tech.com
(Or your internal Street Piano engineering contact)

---

## ❤️ Contributions

This SDK is maintained internally.
Feel free to open issues or PRs for improvements.
