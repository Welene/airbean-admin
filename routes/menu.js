import { Router } from 'express';
import Menu from '../models/menu.js';
import checkAdmin from '../middleware/checkIfAdmin.js';

const router = Router();

router.get('/menu', async (req, res, next) => {
	try {
		const menu = await Menu.find();
		res.status(200).json({
			success: true,
			message: 'This is the menu:',
			data: menu,
		});
	} catch (error) {
		next({
			status: 500,
			message: 'Failed to fetch menu - server error.',
		});
	}
});

// ---------------------------------------------------------------------------------------------------------------

// NYE ANROP TIL INDIVUELL OPPGAVE

// ADD NEW ITEM TO MENU
router.post('/menu', checkAdmin, async (req, res, next) => {
	try {
		let { products } = req.body;

		const menu = await Menu.findOne();
		res.status(200).json({
			success: true,
			message: 'You added a new item to the menu now',
			data: menu,
		});
	} catch (error) {
		next({
			status: 500,
			message: 'Failed to add to menu - server error',
		});
	}
});

// CHANGE ITEM IN MENU
router.put('/menu/:prodId', checkAdmin, async (req, res, next) => {
	try {
		const menu = await Menu.find();
		res.status(200).json({
			success: true,
			message: 'Item has been updated!',
			data: menu,
		});
	} catch (error) {
		next({
			status: 500,
			message: 'Failed to update menu - server error',
		});
	}
});

// DELETE ITEM FROM MENU
router.delete('/menu/:prodId', checkAdmin, async (req, res, next) => {
	try {
		const menu = await Menu.find();
		res.status(200).json({
			success: true,
			message: 'Item has been removed from menu.',
			data: menu,
		});
	} catch (error) {
		next({
			status: 500,
			message: 'Failed to delete item from menu - server error',
		});
	}
});

export default router;
