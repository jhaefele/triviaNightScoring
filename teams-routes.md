# `teams` Routes

The `teams` routes allow CRUD operations for teams.

## `GET /api/games/:gameId/teams`

Returns all teams for game `:gameId`

`GET /api/games/2/teams`  
Return:  
```json
{
    "teams": [
        {
            "table-num": 2,
            "team-name": "Team 2",
            "link": "/api/games/2/teams/4"
        },
        {
            "table-num": 6,
            "team-name": null,
            "link": "/api/games/2/teams/8"
        }
    ]
}
```

## `GET /api/games/:gameId/teams/:teamId`

Returns details about team `:teamId` in game `:gameId`

`GET /api/games/2/teams/4`  
Return:  
```json
{
    "table-num": 2,
    "team-name": "Team 2",
    "rounds-scored": 2,
    "link": "/api/games/2/teams/4/round-scores"
}
```

## `POST /api/games/:gameId/teams`

Adds a new team to game `:gameId`

`POST /api/games/2/teams`  
Body:
```json
{
    "table_num": 7,
    "team_name": "Trivia GOATs"
}
```

Return:  
```json
{
    "message": "Team created"
}
```

## `PUT /api/games/:gameId/teams/:teamId`

Updates details for team `:teamId` in game `:gameId`

`PUT /api/games/2/teams/10`
Body:  
```json
{
    "team_name": "Know-it-Alls"
}
```

Return:  
```json
{
    "message": "Team updated"
}
```

## `DELETE /api/games/:gameId/teams/:teamId`

Deletes a team `:teamId` from game `:gameId`

`DELETE /api/games/2/teams/10`  
Return:  
```json
{
    "message": "Team deleted"
}
```