# BlindTestMobile

## Prerequisites

The easiest way to install all dependencies is to use vscode in devcontainer mode

## Installation

```bash
bun install
pushd client
bun install
popd
pushd admin
bun install
popd
```

## Running

Server:

```bash
bun run index.ts
```

Frontend game:

```bash
cd client
bun run dev
```

Frontend admin:

```bash
cd admin
bun run dev
```

## Events

| Event | Direction | Description | Payload |
| ----- | --------- | ----------- | ------- |
