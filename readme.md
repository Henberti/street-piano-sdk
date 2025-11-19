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

All messages received through this SDK originate from the Street Piano system and contain** ** **MIDI events** .

The payload comes from the** ** **Mido Python library** , which runs on the piano hardware.

Typical events include:

* Note pressed
* Note released
* Control change (pedals, etc.)
* Program change
* Velocity information

You can simplify by logging the string:

<pre class="overflow-visible!" data-start="2945" data-end="2973"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-ts"><span><span>payload.</span><span>toString</span><span>()
</span></span></code></div></div></pre>

Or parse into a structured MIDI object if needed.

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

📧** **`support@streetpiano.io`
(Or your internal Street Piano engineering contact)

---

## ❤️ Contributions

This SDK is maintained internally.
Feel free to open issues or PRs for improvements.
