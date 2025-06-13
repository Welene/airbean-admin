import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import {
	getAllCarts,
	getCartById,
	updateCart,
} from '../services/cartServices.js';
import validateCartInput from '../middleware/validateCartInput.js';
import { validateProdId } from '../middleware/validateProdId.js';
import validateToken from '../middleware/validateToken.js';
import optionalTokenValidation from '../middleware/optionalTokenValidation.js';

const router = Router();

// GET all carts (admin)
router.get('/', async (req, res, next) => {
	const carts = await getAllCarts(); //hämtar alla carts
	if (carts && carts.length > 0) {
		res.json({
			success: true,
			carts: carts,
		});
	} else {
		next({ status: 404, message: 'No carts were found' });
	}
});

// GET cart by cartId
router.get('/:cartId', async (req, res, next) => {
	const { cartId } = req.params;
	const cart = await getCartById(cartId);
	if (cart) {
		res.json({
			success: true,
			cart: cart,
		});
	} else {
		next({ status: 404, message: 'No cart found' });
	}
});

// PUT update cart
router.put(
	'/',
	optionalTokenValidation,
	validateCartInput,
	validateProdId,
	async (req, res, next) => {
		// Hent userId fra req.user (fra validateToken) om noen er inloggad, ellers null
		const userId = req.user ? req.user.userId : null;
		const { prodId, qty, cartId, guestId } = req.body;

		try {
			// Skicka alla id:n vidare till service-funktionen
			const cart = await updateCart({
				cartId,
				userId,
				guestId,
				prodId,
				qty,
			});
			res.json({ success: true, cart });
		} catch (error) {
			next({ status: 500, message: error.message });
		}
	}
);

export default router;
