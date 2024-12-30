# Telegram Actions

Provides some actions for ease of use with Telegram.

## Current Features

- Mass Delete your messages from multiple Chats

## Download

Download the latest version from [Releases](https://github.com/enyineer/telegramactions/releases).

## Development

1. Install dependencies:
```bash
bun install
```

2. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

3. After that, edit the values in your `.env` file and fill it out with the values from https://my.telegram.org/apps.

4. Run it:
```bash
bun run src/index.ts
```

## Releasing

1. Create Tag:
```bash
git tag -a vX.X.X -m "Release vX.X.X"
```

2. Push Tag:
```bash
git push origin vX.X.X
```