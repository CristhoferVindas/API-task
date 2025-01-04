var express = require('express');
var router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
	try {
		const [rows] = await db.query('SELECT * FROM projects');
		res.json(rows);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

router.post('/', async (req, res) => {
	try {
		const {name, description, user_id} = req.body;

		const [result] = await db.query(
			'INSERT INTO projects (name, description, user_id) VALUES (?, ?, ?)',
			[name, description, user_id]
		);

		res.status(201).json({
			project_id: result.insertId,
			name,
			description,
			user_id,
		});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

router.get('/:id', async (req, res) => {
	try {
		const [rows] = await db.query('SELECT * FROM projects WHERE project_id = ?', [req.params.id]);

		if (rows.length > 0) {
			res.json(rows[0]);
		} else {
			res.status(404).json({message: 'Project not found'});
		}
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

router.put('/:id', async (req, res) => {
	try {
		const {name, description, user_id} = req.body;

		const [result] = await db.query(
			'UPDATE projects SET name = ?, description = ?, user_id = ? WHERE project_id = ?',
			[name, description, user_id, req.params.id]
		);

		if (result.affectedRows > 0) {
			res.json({message: 'Project updated successfully'});
		} else {
			res.status(404).json({message: 'Project not found'});
		}
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const [result] = await db.query('DELETE FROM projects WHERE project_id = ?', [req.params.id]);

		if (result.affectedRows > 0) {
			res.status(204).send();
		} else {
			res.status(404).json({message: 'Project not found'});
		}
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

module.exports = router;
