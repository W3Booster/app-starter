# My W3Booster app

Your own TypeScript app, created from the public W3Booster starter. No official app IDs are included.

## Run

Use Node.js 22.22.3 or newer:

```sh
npm ci
npm run dev
```

Open http://localhost:5173/. Look for two players, a clock, DEMO DATA, and Connected · synchronized.

Edit `src/render.ts` to change player cards, `src/style.css` for styles, and the heading in `src/main.ts`. Use the scenario selector to test waiting, missing data, teams, and finished matches. Diagnostics show the SDK connection and available capabilities.

## Connect your own app

1. In W3Booster, enable Developer Mode and open Apps → Developer → Create app.
2. Configure an application surface with `http://localhost:5173/?demo=0`. The minimal scopes and configuration are in `app-definition.json`.
3. Run `npx w3booster-settings init YOUR_CLIENT_ID --endpoint https://api.w3booster.com`.
4. Commit `package.json` and `src/w3booster.generated.ts`.
5. Use Test locally, then launch your app through W3Booster. A direct browser visit does not authorize live data.

The default URL runs synthetic demo data. Live surface URLs must include `demo=0`. Live errors never fall back to demo data. No active match is a normal waiting state. Host actions require an authenticated W3Booster host.

## Check and ship

```sh
npm run check
npm run build
npx playwright install chromium
npm run test:browser
```

Deploy `dist/` to your HTTPS static host and update your app URLs with `?demo=0`. After editing the app definition, explicitly run `npm run w3booster:sync`. Never store launch tokens or database credentials in browser code. Keep URL fragments for SDK authorization.

[Full tutorial](https://website.w3booster.com/developer/first-app/) · [Focused examples](https://website.w3booster.com/developer/examples/) · [Complex Angular starting point](https://github.com/W3Booster/app-match-vision/blob/main/docs/START_FROM_MATCH_VISION.md)

Source is MIT licensed; retain LICENSE when reusing it.

Shared game context is included by SDK 1.1.0 without a scope. Use `gameContext(state)` from `@w3booster/sdk/selectors` for HUD scale (default 1), chat visibility, and team-color mode. Do not request the retired `overlay:read` scope.
