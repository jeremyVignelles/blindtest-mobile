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
bun --watch run index.ts
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

NOTE: for the "Directions column":

- S means Server
- A means Admin socket
- G means Game socket
- T means all Game sockets in a specific Team

| Event        | Direction | Description                                                                        | Payload           | Response          |
| ------------ | --------- | ---------------------------------------------------------------------------------- | ----------------- | ----------------- |
| `createTeam` | G -> S    | Creates a new team                                                                 | `name: string`    | `teamId: string`  |
| `join`       | G -> S    | Joins a team                                                                       | `teamId: string`  | `success:boolean` |
| `register`   | G -> S    | Registers a new player by its name. Once done, the server sends an unicast `state` | `name: string`    |                   |
| `reset`      | A -> S    | Resets the game and the game sockets                                               |                   |                   |
| `reset`      | S -> G    | This game is over, reset your state and disconnect                                 |                   |                   |
| `state`      | S -> A    | Notifies that the game state has changed. Gives the new state                      | `GlobalGameState` |                   |
| `state`      | S -> T    | Notifies that the visible state for this team has changed. Gives the new state     | `TeamState`       |                   |
| `teams`      | S -> G    | Sends the list of teams and their players                                          | `Team[]`          |                   |
