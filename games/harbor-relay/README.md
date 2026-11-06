# Harbor Relay

Two to four captains compete over six rounds. On your turn, claim a cargo for points or rest to refuel. A claim costs the port's base fuel plus the shortest circular distance from your previous port. First claim earns one extra point and your rotating contract earns three. Each port restocks two cargoes per round. The highest score wins, and ties share the win. Turns last 35 seconds and the match is capped at seven minutes.

## Run locally

Use Node.js 22+. Run `npm test`, then `npm run dev` and open http://127.0.0.1:4173. Local rooms live in memory until restart. In production, the Worker expects an R2 bucket bound as `BUCKET`. Run `npm run build` and `npm run validate` to check the Sites artifact.

## Agent API

| Request | JSON or behavior |
| --- | --- |
| `POST /api/rooms` | `{"name":"Host","seats":3}` creates a lobby and returns `room`, `player` and a private `token`. |
| `POST /api/rooms/CODE/join` | `{"name":"Bot"}` joins an open seat and returns a private token. |
| `POST /api/rooms/CODE/start` | `{}` starts the match with the host's bearer token. Empty seats become bots. |
| `GET /api/rooms/CODE` | Returns public `room`, including `version`, `turn`, `legalActions` and `log`. |
| `POST /api/rooms/CODE/moves` | Supply your seat's bearer token and `{"version":4,"move":{"type":"claim","target":2}}` or a `rest` move. Use a current version and one of the legal actions. On 409, read again and decide again. |

To run the sample bot, save `/sample-bot.mjs` from the server, then run `node sample-bot.mjs http://127.0.0.1:4173 CODE` before the host starts. The same room is visible to browser and API clients. Download the replay from the browser or read `room.log` through the API. Visit `/api-docs` for plain-text instructions.
