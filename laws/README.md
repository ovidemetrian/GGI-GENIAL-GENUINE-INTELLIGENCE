# GGI Protocol v1.0 — The Ten Laws of AI, as code

Concept & Laws: **Ovidiu Mircea Demetrian (Ovi)** · https://10lawsofai.com
Programmed with Claude · *Lumină, nu vrăjală*

> Trust but verify — and save so it can be verified again tomorrow.

## What's in the box

| File | What it is | Who uses it |
|---|---|---|
| `GGI-SYSTEM-PROMPT.md` | The Ten Laws (both editions, verbatim) + machine-checkable operating rules | Paste into **any** AI as its system/custom instructions |
| `ggi-protocol.json` | The Laws as structured data, each tagged with how it is enforced | Any program, any language |
| `ggi-enforcer.js` | The checker, the record log and the prompt builders | Browser or Node |
| `index.html` + `manifest.json` + `sw.js` | GGI Law Checker — installable phone app (PWA), works offline | You |

## Three layers of enforcement

1. **Instruct** — `GGI-SYSTEM-PROMPT.md` tells the AI how to behave.
2. **Verify** — `GGI.check()` grades the reply. Tags per law:
   - `lint` — checked by code (pleasantries, question echo, fake empathy, loops, unsourced absolutes, dark patterns)
   - `arbiter` — needs a second model or a human (truth, humor). `GGI.arbiterPrompt()` writes that request.
   - `record` — satisfied by the sealed log
3. **Record** — `GGI.record()` seals every exchange into a SHA-256 hash chain; `GGI.verifyChain()` proves nothing was edited later.

## Use in code

```js
const GGI = require("./ggi-enforcer.js");          // or <script src="ggi-enforcer.js"> → window.GGI
const system = GGI.buildSystemPrompt("both");      // "human" | "developer" | "both"
const result = GGI.check(reply, { prompt, previous });
// → { score: 0-100, verdicts: [{law, name, status, note}], needsArbiter: [3, 9] }
const log = [];
await GGI.record(log, { model: "Claude", prompt, response: reply, result });
await GGI.verifyChain(log);                         // → { ok: true, brokenAt: null }
```

## Honest limits (Law Nine — the 1% doubt)

- Code can catch **style** violations reliably. It cannot prove a claim is **true** — that is why Laws 3, 6 and 9 hand off to an arbiter.
- Pattern lists are English-only and will miss creative phrasings; extend `P` in `ggi-enforcer.js`.
- The system prompt guides a model; it does not override the model's own training or safety rules.
- The record lives in the browser (localStorage) until you **Export JSON**. Export to keep it.

## Run the app

Live at https://ovidemetrian.github.io/GGI-GENIAL-GENUINE-INTELLIGENCE/laws/ — open it on the phone, then "Add to Home Screen".
