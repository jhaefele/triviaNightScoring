const logger = require('../logger');
const express = require('express');
const {queryDatabase} = require('../services/db');

module.exports = app => {

    app.post('/api/games', async (req, res) => {
        const submittedGameDetails = req.body
        const sqlQuery = `
            INSERT
                INTO games
                (game_name)
                VALUES ('${submittedGameDetails['game-name']}')
        `
        try {
            await queryDatabase(sqlQuery)
        } catch (err) {
            logger.error(`Unable to create game:\n\t${err}`)
            return res.status(400).json({ error: 'Unable to create game', 'error-number': err.errno, })
        }
        logger.info(`Created game ${submittedGameDetails['game-name']}`)
        return res.status(201).json({ message: 'Game created' })
    });

    app.put('/api/games/:gameId', async (req, res) => {
        const gameId = req.params.gameId
        const submittedGameDetails = req.body

        const sqlQuery = `
            UPDATE
                games
                SET game_name = '${submittedGameDetails['game-name']}'
                WHERE game_id = ${gameId}
        `
        try {
            await queryDatabase(sqlQuery)
        } catch (err) {
            logger.error(`Unable to update game:\n\t${err}`)
            return res.status(400).json({ error: 'Unable to update game', 'error-number': err.errno, })
        }
        logger.info(`Updated game ${submittedGameDetails['game-name']}`)
        return res.status(200).json({ message: 'Game updated' })
    });

    app.get('/api/games', async (req, res) => {
        const gamesPayload = {}
        const gamesPayloadData = []

        const sqlQuery = `
            SELECT
                game_id,
                game_name
                FROM games
                WHERE status = 1
                ORDER BY game_id
        `
        let queryResult
        try {
            queryResult = await queryDatabase(sqlQuery)
        } catch (err) {
            logger.error(`Unable to get games:\n\t${err}`)
            return res.status(400).json({ error: 'Unable to get games', 'error-number': err.errno, })
        }
        if (queryResult.length) {
            for (let row of queryResult) {
                gamesPayloadData.push({
                    'game-id': row['game_id'],
                    'game-name': row['game_name'],
                    link: `/api/games/${row['game_id']}`
                })
            }
        } else {
            logger.error('Unable to get games')
            return res.status(400).json({ error: 'Unable to get games' })
        }
        gamesPayload['games'] = gamesPayloadData
        return res.status(200).json(gamesPayload)
    });

    app.get('/api/games/:gameId', async (req, res) => {
        const gameId = req.params.gameId
        const gamePayload = {}
        const gamePayloadData = []

        const sqlQuery = `
            SELECT
                g.game_id AS 'game-id',
                g.game_name AS 'game-name',
                t.team_id AS 'team-id',
                t.table_num AS 'table-num',
                t.team_name AS 'team-name'
                FROM games g
                JOIN teams t ON t.game_id = g.game_id
                WHERE g.game_id = ${gameId}
                ORDER BY t.table_num
        `
        let queryResult
        try {
            queryResult = await queryDatabase(sqlQuery)
        } catch (err) {
            logger.error(`Unable to get game info:\n\t${err}`)
            return res.status(400).json({ error: 'Unable to get game info', 'error-number': err.errno, })
        }
        if (queryResult.length) {
            for (let row of queryResult) {
                gamePayloadData.push({
                    'table-num': row['table-num'],
                    'team-name': row['team-name'],
                    link: `/api/games/${gameId}/teams/${row['team-id']}`
                })
            }
        } else {
            logger.error('Unable to get game info (queryResult.length = 0)')
            return res.status(400).json({ error: 'Unable to get game info' })
        }
        gamePayload['game-info'] = { 'game-id': gameId, 'game-name': queryResult[0]['game-name'] }
        gamePayload['teams'] = gamePayloadData
        return res.status(200).json(gamePayload)
    });

    app.delete('/api/games/:gameId', async (req, res) => {
        const gameId = req.params.gameId
        const sqlQuery = `
            DELETE
                r, t, g
                FROM rounds r
                JOIN teams t ON t.team_id = r.team_id
                JOIN games g ON g.game_id = t.game_id
                WHERE g.game_id = ${gameId}
        `
        try {
            await queryDatabase(sqlQuery)
        } catch (err) {
            logger.error(`Unable to delete game:\n\t${err}`)
            return res.status(400).json({ error: 'Unable to delete game', 'error-number': err.errno, })
        }

        logger.info(`Deleted game ${gameId}`)
        return res.status(200).json({ message: 'Game deleted' })
    });
}