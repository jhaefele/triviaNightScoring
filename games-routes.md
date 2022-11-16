# `games` Routes

The `games` routes allow CRUD operations for games.

## `GET /api/games`

Returns all active games

`GET /api/games`  
Return:  
```json
{
    "games": [
        {
            "game-id": 2,
            "game-name": "Test game #2",
            "link": "/api/games/2"
        },
        {
            "game-id": 4,
            "game-name": "Test game #4",
            "link": "/api/games/4"
        }
    ]
}
```

## `GET /api/games/:gameId`

Returns details about game `gameId`

`GET /api/games/2`  
Return:  
```json
{
    "game-info": {
        "game-id": "2",
        "game-name": "Test game #2"
    },
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

## `POST /api/games`

Adds a new game

`POST /api/games`  
Body:
```json
{
    "game-name": "Test game #6"
}
```

Return:  
```json
{
    "message": "Game created"
}
```

## `PUT /api/games/:gameId`

Updates details for game `:gameId`

`PUT /api/games/5`
Body:  
```json
{
    "game-name": "PTO Fundraiser"
}
```

Return:  
```json
{
    "message": "Game updated"
}
```

## `DELETE /api/games/:gameId`

Deletes game `:gameId`

`DELETE /api/games/1`  
Return:  
```json
{
    "message": "Game deleted"
}
```