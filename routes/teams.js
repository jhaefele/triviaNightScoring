const logger = require('../logger');
const express = require('express');
const pool = require('../services/db');

async function queryDatabase(sqlString, params) {
    const conn = await pool.getConnection()
    let dbQueryResult = await conn.query(sqlString, params)
    conn.end()
    return dbQueryResult
}

module.exports = app => {

    app.post('/api/games/:gameId/teams', async (req, res) => {
        const gameId = req.params.gameId
        const submittedTeamDetails = req.body

        const sqlQuery = `
            INSERT
                INTO teams
                (game_id, ${Object.keys(submittedTeamDetails).join(', ')})
                VALUES (${gameId}, '${Object.values(submittedTeamDetails).join(`', '`)}')
        `
        try {
            await queryDatabase(sqlQuery)
        } catch (err) {
            logger.error(`Unable to create team:\n\t${err}`)
            return res.status(400).json({ error: 'Unable to create team', 'error-number': err.errno, })
        }
        logger.info(`Created team: table-num ${submittedTeamDetails['table-num']}, team-name ${submittedTeamDetails['team-name']}`)

        return res.status(201).json({ message: 'Team created' })
    });

    app.put('/api/games/:gameId/teams/:teamId', async (req, res) => {
        const gameId = req.params.gameId
        const teamId = req.params.teamId
        const submittedTeamDetails = req.body
        let updateSubqueryArray = []
        for (let field in submittedTeamDetails) {
            updateSubqueryArray.push(`${field} = '${submittedTeamDetails[field]}'`)
        }

        const sqlQuery = `
            UPDATE
                teams
                SET ${updateSubqueryArray.join(', ')}
                WHERE game_id = ${gameId} AND team_id = ${teamId}
        `
        try {
            await queryDatabase(sqlQuery)
        } catch (err) {
            logger.error(`Unable to update team:\n\t${err}`)
            return res.status(400).json({ error: 'Unable to update team', 'error-number': err.errno, })
        }
        logger.info(`Updated team: table-num ${submittedTeamDetails['table_num']}, team-name ${submittedTeamDetails['team_name']}`)
        return res.status(200).json({ message: 'Team updated' })
    });

    app.get('/api/games/:gameId/teams', async (req, res) => {
        const gameId = req.params.gameId
        const teamsPayload = {}
        let teamsPayloadData = []

        const sqlQuery = `
            SELECT
                t.team_id,
                t.table_num AS 'table-num',
                t.team_name AS 'team-name'
                FROM teams t
                JOIN games g ON g.game_id = t.game_id
                WHERE g.game_id = ${gameId} AND g.status = 1
                ORDER BY t.table_num ASC
        `
        let queryResult
        try {
            queryResult = await queryDatabase(sqlQuery)
        } catch (err) {
            logger.error(`Unable to get teams:\n\t${err}`)
            return res.status(400).json({ error: 'Unable to get teams', 'error-number': err.errno, })
        }
        if (queryResult.length) {
            for (let row of queryResult) {
                teamsPayloadData.push({
                    'table-num': row['table-num'],
                    'team-name': row['team-name'],
                    link: `/api/games/${gameId}/teams/${row['team_id']}`,
                })
            }
        } else {
            logger.error('Unable to get teams')
            return res.status(400).json({ error: 'Unable to get teams' })
        }
        teamsPayload['teams'] = teamsPayloadData
        return res.status(200).json(teamsPayload)
    });

    app.get('/api/games/:gameId/teams/:teamId', async (req, res) => {
        const gameId = req.params.gameId
        const teamId = req.params.teamId
        let teamPayload

        const sqlQuery = `
            SELECT
                r.round_num,
                t.table_num AS 'table-num',
                t.team_name AS 'team-name'
                FROM teams t
                JOIN games g ON g.game_id = t.game_id
                JOIN rounds r ON r.team_id = t.team_id
                WHERE t.team_id = ${teamId}
        `
        let queryResult
        try {
            queryResult = await queryDatabase(sqlQuery)
        } catch (err) {
            logger.error(`Unable to get team info:\n\t${err}`)
            return res.status(400).json({ error: 'Unable to get team info', 'error-number': err.errno, })
        }
        if (queryResult.length) {
            teamPayload = {
                'table-num': queryResult[0]['table-num'],
                'team-name': queryResult[0]['team-name'],
                'rounds-scored': queryResult.length,
                link: `/api/games/${gameId}/teams/${teamId}/round-scores`,
            }
        } else {
            logger.error('Unable to get team info (queryResult.length = 0)')
            return res.status(400).json({ error: 'Unable to get team info' })
        }
        return res.status(200).json(teamPayload)
    });

    app.delete('/api/games/:gameId/teams/:teamId', async (req, res) => {
        const teamId = req.params.teamId
        const sqlQuery = `
            DELETE
                FROM teams
                WHERE team_id = ${teamId}
        `
        try {
            await queryDatabase(sqlQuery)
        } catch (err) {
            logger.error(`Unable to delete team:\n\t${err}`)
            return res.status(400).json({ error: 'Unable to delete team', 'error-number': err.errno, })
        }

        logger.info(`Deleted team ${teamId}`)
        return res.status(200).json({ message: 'Team deleted' })
    });
}