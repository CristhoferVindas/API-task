var express = require('express');
var router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
	try {
		const [rows] = await db.query('SELECT user_id, name, email, creation_date FROM users');
		res.json(rows);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});
router.post('/', async (req, res) => {
	try {
		const {name, email, password} = req.body;

		const hashedPassword = await bcrypt.hash(password, 10);

		const [result] = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
			name,
			email,
			hashedPassword,
		]);

		res.status(201).json({user_id: result.insertId, name, email});
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

router.get('/:id', async (req, res) => {
	try {
		const [rows] = await db.query(
			'SELECT user_id, name, email, creation_date FROM users WHERE user_id = ?',
			[req.params.id]
		);
		if (rows.length > 0) {
			res.json(rows[0]);
		} else {
			res.status(404).json({message: 'User not found'});
		}
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

router.put('/:id', async (req, res) => {
	try {
		const {name, email, password} = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);

		const [result] = await db.query(
			'UPDATE users SET name = ?, email = ?, password = ? WHERE user_id = ?',
			[name, email, hashedPassword, req.params.id]
		);

		if (result.affectedRows > 0) {
			res.json({message: 'User updated successfully'});
		} else {
			res.status(404).json({message: 'User not found'});
		}
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const [result] = await db.query('DELETE FROM users WHERE user_id = ?', [req.params.id]);
		if (result.affectedRows > 0) {
			res.status(204).send();
		} else {
			res.status(404).json({message: 'User not found'});
		}
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

module.exports = router;
