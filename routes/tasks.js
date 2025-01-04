var express = require('express');
var router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
	try {
		const [rows] = await db.query(`
      SELECT 
        t.task_id, 
        t.title, 
        t.description, 
        t.priority, 
        t.status, 
        t.creation_date, 
        t.due_date, 
        p.name AS project_name, 
        u.name AS assigned_user 
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.project_id
      LEFT JOIN users u ON t.user_id = u.user_id
    `);
		res.json(rows);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

router.post('/', async (req, res) => {
	try {
		const {title, description, priority, status, due_date, project_id, user_id} = req.body;

		const [result] = await db.query(
			`INSERT INTO tasks (title, description, priority, status, due_date, project_id, user_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[title, description, priority, status, due_date, project_id, user_id]
		);

		res.status(201).json({
			task_id: result.insertId,
			title,
			description,
			priority,
			status,
			due_date,
			project_id,
			user_id,
		});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

router.get('/:id', async (req, res) => {
	try {
		const [rows] = await db.query(
			`SELECT 
        t.task_id, 
        t.title, 
        t.description, 
        t.priority, 
        t.status, 
        t.creation_date, 
        t.due_date, 
        p.name AS project_name, 
        u.name AS assigned_user 
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.project_id
      LEFT JOIN users u ON t.user_id = u.user_id
      WHERE t.task_id = ?`,
			[req.params.id]
		);

		if (rows.length > 0) {
			res.json(rows[0]);
		} else {
			res.status(404).json({message: 'Task not found'});
		}
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

router.put('/:id', async (req, res) => {
	try {
		const {title, description, priority, status, due_date, project_id, user_id} = req.body;

		const [result] = await db.query(
			`UPDATE tasks 
       SET title = ?, description = ?, priority = ?, status = ?, due_date = ?, project_id = ?, user_id = ? 
       WHERE task_id = ?`,
			[title, description, priority, status, due_date, project_id, user_id, req.params.id]
		);

		if (result.affectedRows > 0) {
			res.json({message: 'Task updated successfully'});
		} else {
			res.status(404).json({message: 'Task not found'});
		}
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const [result] = await db.query('DELETE FROM tasks WHERE task_id = ?', [req.params.id]);

		if (result.affectedRows > 0) {
			res.status(204).send();
		} else {
			res.status(404).json({message: 'Task not found'});
		}
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

module.exports = router;
