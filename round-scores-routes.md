# `round-scores` Routes

The `round-scores` routes allow CRUD operations for scoring rounds.

## `GET /api/games/:gameId/teams/:teamId/round-scores`

Returns all scores for team `:teamId` in game `:gameId`

`GET /api/games/2/teams/4/round-scores`  
Return:  
```json
{
    "total-score": 17,
    "round-scores": [
        {
            "round": 1,
            "round-total": 8,
            "mulligan-used": 0,
            "double-down": 0
        },
        {
            "round": 2,
            "round-total": 9,
            "mulligan-used": 1,
            "double-down": 0
        }
    ]
}
```

## `GET /api/games/:gameId/teams/:teamId/round-scores/:roundNum`

Returns details about round `:roundNum` for team `:teamId` in game `:gameId`

`GET /api/games/2/teams/4/round-scores/2`  
Return:  
```json
{
    "game-id": 2,
    "team-id": 4,
    "round-num": 2,
    "q1": 1,
    "q2": 0,
    "q3": 1,
    "q4": 1,
    "q5": 1,
    "q6": 1,
    "q7": 1,
    "q8": 1,
    "q9": 1,
    "q10": 1,
    "mulligan-used": 1,
    "double-down": 0,
    "round-total": 9
}
```

## `POST /api/games/:gameId/teams/:teamId/round-scores`

Score a round for team `:teamId` in game `:gameId`

`POST /api/games/2/teams/4/round-scores`  
Body:
```json
{
    "round_num": 3,
    "q1": 1,
    "q2": 1,
    "q3": 1,
    "q4": 1,
    "q5": 1,
    "q6": 0,
    "q7": 1,
    "q8": 0,
    "q9": 1,
    "q10": 1,
    "mulligan_used": 1,
    "double_down": 0
}
```

Return:  
```json
{
    "message": "Round score submitted"
}
```

## `PUT /api/games/:gameId/teams/:teamId/round-scores/:roundNum`

Updates score for round `:roundNum` for team `:teamId` in game `:gameId`

`PUT /api/games/2/teams/4/round-scores/3`
Body:  
```json
{
    "q1": 1,
    "q2": 1,
    "q3": 0,
    "q4": 1,
    "q5": 1,
    "q6": 0,
    "q7": 1,
    "q8": 0,
    "q9": 1,
    "q10": 1,
    "mulligan_used": 1,
    "double_down": 0
}
```

Return:  
```json
{
    "message": "Round score updated"
}
```

## `DELETE /api/games/:gameId/teams/:teamId/round-scores/:roundNum`

Deletes score for round `:roundNum` for team `:teamId` from game `:gameId`

`DELETE /api/games/2/teams/4/round-scores/3`  
Return:  
```json
{
    "message": "Round score deleted"
}
```