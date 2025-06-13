import { Router } from 'express';
import Menu from '../models/menu.js';
import validateToken from '../middleware/validateToken.js';
import checkAdmin from '../middleware/checkIfAdmin.js';
import {
	addMenuItem,
	getAllMenuItems,
	updateMenuItem,
	deleteMenuItem,
} from '../services/menuServices.js';

const router = Router();

router.get('/menu', async (req, res, next) => {
	try {
		const menu = await getAllMenuItems();

		res.status(200).json({
			success: true,
			message: 'This is the menu:',
			data: menu,
		});
	} catch (error) {
		console.error('Error fetching menu via service:', error);
		next({
			status: 500,
			message: 'Failed to fetch menu - server error.',
		});
	}
});

// ADD NEW ITEM TO MENU
router.post('/menu', validateToken, checkAdmin, async (req, res, next) => {
	try {
		const { title, desc, price } = req.body;

		if (!title || !desc || !price) {
			return res.status(400).json({
				success: false,
				message: 'Missing title, description, or price.',
			});
		}
		const newMenuItem = await addMenuItem(title, desc, price);

		res.status(201).json({
			success: true,
			message: 'New menu item added successfully!',
			data: newMenuItem,
		});
	} catch (error) {
		console.error('Error adding menu item via service:', error);
		// Sjekk for Mongoose ValidationErrors spesifikt
		if (error.name === 'ValidationError') {
			return res.status(400).json({
				success: false,
				message: 'Validation failed: ' + error.message,
			});
		}
		next({
			status: 500,
			message: 'Failed to add to menu - server error',
		});
	}
});

// CHANGE ITEM IN MENU
router.put(
	'/menu/:prodId',
	validateToken,
	checkAdmin,
	async (req, res, next) => {
		try {
			const { prodId } = req.params;
			const { title, desc, price } = req.body;

			const updatedMenuItem = await updateMenuItem(prodId, {
				title,
				desc,
				price,
			});

			if (!updatedMenuItem) {
				return res.status(404).json({
					success: false,
					message: 'Could not find menu item .',
				});
			}

			res.status(200).json({
				success: true,
				message: 'Menu item has been updated!',
				data: updatedMenuItem,
			});
		} catch (error) {
			console.error('Cannot update menu item:', error);
			if (error.name === 'ValidationError') {
				return res.status(400).json({
					success: false,
					message: 'Validation failed: ' + error.message,
				});
			}
			next({
				status: 500,
				message: 'Cannot update menu - server error',
			});
		}
	}
);

// DELETE ITEM FROM MENU
router.delete(
	'/menu/:prodId',
	validateToken,
	checkAdmin,
	async (req, res, next) => {
		try {
			const { prodId } = req.params;

			const deletedMenuItem = await deleteMenuItem(prodId);

			if (!deletedMenuItem) {
				return res.status(404).json({
					success: false,
					message: 'Menu item could not be found.',
				});
			}

			res.status(200).json({
				success: true,
				message: 'Menu item has been removed from menu.',
				data: deletedMenuItem,
			});
		} catch (error) {
			console.error('Cannot delete menu item:', error);
			next({
				status: 500,
				message: 'Failed to delete item from menu - server error',
			});
		}
	}
);

export default router;
