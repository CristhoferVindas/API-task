var express = require('express');
var router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
	try {
		const [rows] = await db.query('SELECT * FROM tasks_labels');
		res.json(rows);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

router.post('/', async (req, res) => {
	try {
		const {task_id, label_id} = req.body;

		const [result] = await db.query('INSERT INTO tasks_labels (task_id, label_id) VALUES (?, ?)', [
			task_id,
			label_id,
		]);

		res.status(201).json({
			task_id,
			label_id,
			message: 'Label successfully associated with task',
		});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

router.delete('/', async (req, res) => {
	try {
		const {task_id, label_id} = req.body;

		const [result] = await db.query('DELETE FROM tasks_labels WHERE task_id = ? AND label_id = ?', [
			task_id,
			label_id,
		]);

		if (result.affectedRows > 0) {
			res.status(204).send();
		} else {
			res.status(404).json({message: 'Relationship not found'});
		}
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

module.exports = router;
