var express = require('express');
var router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
	try {
		const [rows] = await db.query('SELECT * FROM activity_log');
		res.json(rows);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

router.post('/', async (req, res) => {
	try {
		const {action, user_id, task_id} = req.body;

		const [result] = await db.query(
			'INSERT INTO activity_log (action, user_id, task_id) VALUES (?, ?, ?)',
			[action, user_id, task_id]
		);

		res.status(201).json({
			log_id: result.insertId,
			action,
			user_id,
			task_id,
			message: 'Activity log successfully created',
		});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

router.get('/user/:user_id', async (req, res) => {
	try {
		const [rows] = await db.query('SELECT * FROM activity_log WHERE user_id = ?', [req.params.user_id]);
		res.json(rows);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

router.get('/task/:task_id', async (req, res) => {
	try {
		const [rows] = await db.query('SELECT * FROM activity_log WHERE task_id = ?', [req.params.task_id]);
		res.json(rows);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

router.delete('/:log_id', async (req, res) => {
	try {
		const [result] = await db.query('DELETE FROM activity_log WHERE log_id = ?', [req.params.log_id]);
		if (result.affectedRows > 0) {
			res.status(204).send();
		} else {
			res.status(404).json({message: 'Activity log not found'});
		}
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

module.exports = router;
