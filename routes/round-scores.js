const logger = require('../logger');
const express = require('express');
const {queryDatabase} = require('../services/db');

module.exports = app => {

    app.post('/api/games/:gameId/teams/:teamId/round-scores', async (req, res) => {
        const gameId = req.params.gameId
        const teamId = req.params.teamId
        const submittedBody = req.body
        const submittedScore = { game_id: gameId, team_id: teamId, }
        for (let field in submittedBody) {
            submittedScore[field] = submittedBody[field]
        }
        const sqlQuery = `
            INSERT
                INTO rounds
                (${Object.keys(submittedScore).join(', ')})
                VALUES (${Object.values(submittedScore).join(', ')})
        `
        try {
            await queryDatabase(sqlQuery)
        } catch (err) {
            logger.error(`ERROR: Unable to submit score for game ${gameId},
                        team (id) ${teamId}, round ${submittedScore['round_num']}:
                        \n\t${err}`)
            return res.status(400).json({ error: 'Unable to submit round score', 'error-number': err.errno })
        }
        logger.info(`Score submitted/updated for game ${gameId},
                    team (id) ${teamId}, round ${submittedScore['round_num']}`)
        return res.status(201).json({ message: 'Round score submitted' })
    });

    app.put('/api/games/:gameId/teams/:teamId/round-scores/:roundNum', async (req, res) => {
        const gameId = req.params.gameId
        const teamId = req.params.teamId
        const roundNum = req.params.roundNum
        const submittedBody = req.body
        const updateSubqueryArray = []

        for (let field in submittedBody) {
            updateSubqueryArray.push(`${field} = ${submittedBody[field]}`)
        }
        const sqlQuery = `
            UPDATE
                rounds
                SET ${updateSubqueryArray.join(', ')}
                WHERE game_id = ${gameId} AND team_id = ${teamId} AND round_num = ${roundNum}
        `
        try {
            await queryDatabase(sqlQuery)
        } catch (err) {
            logger.error(`ERROR: Unable to update score for game ${gameId},
                        team (id) ${teamId}, round ${roundNum}:
                        \n\t${err}`)
            return res.status(400).json({ error: 'Unable to update round score', 'error-number': err.errno, })
        }
        logger.info(`Score submitted/updated for game ${gameId},
                    team (id) ${teamId}, round ${roundNum}`)
        return res.status(200).json({ message: 'Round score updated' })
    });

    app.get('/api/games/:gameId/teams/:teamId/round-scores', async (req, res) => {
        const gameId = req.params.gameId
        const teamId = req.params.teamId
        let roundScorePayload = {}
        let roundScorePayloadData = []

        const sqlQuery = `
            SELECT
                game_id AS 'game-id',
                team_id AS 'team-id',
                round_num AS 'round-num',
                q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
                mulligan_used AS 'mulligan-used',
                double_down AS 'double-down'
                FROM rounds
                WHERE game_id = ${gameId} AND team_id = ${teamId}
        `
        try {
            queryResult = await queryDatabase(sqlQuery)
        } catch (err) {
            logger.error(`ERROR: Unable to get scores for game ${gameId},
                        team (id) ${teamId}:\n\t${err}`)
            return res.status(400).json({ error: 'Unable to get round scores', })
        }
        if (queryResult.length) {
            let totalScore = 0
            roundScorePayloadData = queryResult.map(row => {
                let roundTotal = 0
                for (let qNum of ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10']) {
                    roundTotal += row[qNum]
                }
                totalScore += roundTotal
                return {
                    round: row['round-num'],
                    'round-total': roundTotal,
                    'mulligan-used': row['mulligan-used'],
                    'double-down': row['double-down'],
                }
            })
            roundScorePayload['total-score'] = totalScore
            roundScorePayload['round-scores'] = roundScorePayloadData
            return res.status(200).json(roundScorePayload)
        } else {
            logger.error(`ERROR: Unable to get score for game ${gameId},
                        table ${tableNum}:\n\t${err}`)
            return res.status(400).json({ error: 'Unable to get round scores' })
        }
    });

    app.get('/api/games/:gameId/teams/:teamId/round-scores/:roundNum', async (req, res) => {
        const gameId = req.params.gameId
        const teamId = req.params.teamId
        const roundNum = req.params.roundNum
        let roundScorePayload = {}
        const sqlQuery = `
            SELECT
                game_id AS 'game-id',
                team_id AS 'team-id',
                round_num AS 'round-num',
                q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
                mulligan_used AS 'mulligan-used',
                double_down AS 'double-down'
                FROM rounds
                WHERE game_id = ${gameId} AND team_id = ${teamId} AND round_num = ${roundNum}
        `
        try {
            queryResult = await queryDatabase(sqlQuery)
        } catch (err) {
            logger.error(`ERROR: Unable to get score for game ${gameId},
                        team (id) ${teamId}, round ${roundNum}:\n\t${err}`)
            return res.status(400).json({ error: 'Unable to get round score', })
        }
        if (queryResult.length) {
            roundScorePayload = queryResult[0]
            roundScorePayload['round-total'] = 0
            for (let qNum of ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10']) {
                roundScorePayload['round-total'] += roundScorePayload[qNum]
            }
            return res.status(200).json(roundScorePayload)
        } else {
            logger.error(`ERROR: Unable to get score for game ${gameId},
                        table ${tableNum}, round ${roundNum}:\n\t${err}`)
            return res.status(400).json({ error: 'Unable to get round score' })
        }
    });

    app.delete('/api/games/:gameId/teams/:teamId/round-scores/:roundNum', async (req, res) => {
        const gameId = req.params.gameId
        const teamId = req.params.teamId
        const roundNum = req.params.roundNum

        const sqlQuery = `
            DELETE
                FROM rounds
                WHERE team_id = ${teamId} AND round_num = ${roundNum}
        `
        try {
            await queryDatabase(sqlQuery)
        } catch (err) {
            logger.error(`ERROR: Unable to delet score for game ${gameId},
                        team (id) ${teamId}, round ${roundNum}:
                        \n\t${err}`)
            return res.status(400).json({ error: 'Unable to delete round score', 'error-number': err.errno })
        }
        logger.info(`Score deleted for game ${gameId},
                    team (id) ${teamId}, round ${roundNum}`)
        return res.status(200).json({ message: 'Round score deleted' })
    });
}