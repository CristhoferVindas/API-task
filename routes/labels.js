var express = require('express');
var router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
	try {
		const [rows] = await db.query('SELECT * FROM labels');
		res.json(rows);
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

router.post('/', async (req, res) => {
	try {
		const {name} = req.body;

		const [result] = await db.query('INSERT INTO labels (name) VALUES (?)', [name]);

		res.status(201).json({
			label_id: result.insertId,
			name,
		});
	} catch (error) {
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(400).json({error: 'Label name must be unique'});
		} else {
			res.status(500).json({error: error.message});
		}
	}
});

router.get('/:id', async (req, res) => {
	try {
		const [rows] = await db.query('SELECT * FROM labels WHERE label_id = ?', [req.params.id]);

		if (rows.length > 0) {
			res.json(rows[0]);
		} else {
			res.status(404).json({message: 'Label not found'});
		}
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

router.put('/:id', async (req, res) => {
	try {
		const {name} = req.body;

		const [result] = await db.query('UPDATE labels SET name = ? WHERE label_id = ?', [
			name,
			req.params.id,
		]);

		if (result.affectedRows > 0) {
			res.json({message: 'Label updated successfully'});
		} else {
			res.status(404).json({message: 'Label not found'});
		}
	} catch (error) {
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(400).json({error: 'Label name must be unique'});
		} else {
			res.status(500).json({error: error.message});
		}
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const [result] = await db.query('DELETE FROM labels WHERE label_id = ?', [req.params.id]);

		if (result.affectedRows > 0) {
			res.status(204).send();
		} else {
			res.status(404).json({message: 'Label not found'});
		}
	} catch (error) {
		res.status(500).json({error: error.message});
	}
});

module.exports = router;
