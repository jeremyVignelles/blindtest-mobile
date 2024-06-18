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

```bash
bun run dev
```

This will launch the back, the admin and the game concurrently

## Events

NOTE: for the "Directions column":

- S means Server
- A means Admin socket
- G means Game socket
- T means all Game sockets in a specific Team

| Event              | Direction | Description                                                                        | Payload                            | Response              |
| ------------------ | --------- | ---------------------------------------------------------------------------------- | ---------------------------------- | --------------------- |
| `createTeam`       | G -> S    | Creates a new team                                                                 | `name: string`                     | `teamId: string`      |
| `join`             | G -> S    | Joins a team                                                                       | `teamId: string`                   | `success:boolean`     |
| `guess`            | G -> S    | Guesses a song                                                                     | `guess: string`                    | `result: GuessResult` |
| `load`             | A -> S    | Loads a game from a file                                                           | `steps: GameStep[]`                |                       |
| `nextTurn`         | A -> S    | Start the next turn                                                                |                                    |                       |
| `register`         | G -> S    | Registers a new player by its name. Once done, the server sends an unicast `state` | `name: string`                     | `userId: string`      |
| `reset`            | A -> S    | Resets the game and the game sockets                                               |                                    |                       |
| `reset`            | S -> G    | This game is over, reset your state and disconnect                                 |                                    |                       |
| `setScore`         | A -> S    | Sets the score for a team                                                          | `teamId: string, score:number`     |                       |
| `setTitleCorrect`  | A -> S    | Sets the title as (in)correct                                                      | `guess: string, isCorrect:boolean` |                       |
| `setArtistCorrect` | A -> S    | Sets the artist as (in)correct                                                     | `guess: string, isCorrect:boolean` |                       |
| `setRefused`       | A -> S    | Sets the guess as refused (both title and artist will be set incorrect)            | `guess: string, isRefused:boolean` |                       |
| `state`            | S -> A    | Notifies that the game state has changed. Gives the new state                      | `GlobalGameState`                  |                       |
| `state`            | S -> T    | Notifies that the visible state for this team has changed. Gives the new state     | `TeamState`                        |                       |
| `stopTurn`         | A -> S    | Stops the turn                                                                     |                                    |                       |
| `teams`            | S -> G    | Sends the list of teams and their players                                          | `Team[]`                           |                       |
