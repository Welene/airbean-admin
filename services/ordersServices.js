// src/services/ordersServices.js

import Order from '../models/order.js';
import Cart from '../models/cart.js';
import Menu from '../models/menu.js';
import { v4 as uuidv4 } from 'uuid';

// ----------------------------------------------------------------------------------------

// (GET) - RETURNS ALL ORDERS BY ALL USERS/GUESTS
export async function getAllOrders() {
	return await Order.find();
}

// ----------------------------------------------------------------------------------------

// (GET) - RETURNS ALL ORDERS FOR THAT USER/ID
export async function getOrdersByUser(idParam) {
	// Denne funksjonen kan hente ordrer for både userId og guestId.
	// Den bruker $or for å søke etter ordrer der 'userId' ELLER 'guestId' i databasen matcher 'idParam'.
	const query = {
		$or: [
			{ userId: idParam }, // Sjekker om ordrens userId matcher ID-en fra URL-en
			{ guestId: idParam }, // Sjekker om ordrens guestId matcher ID-en fra URL-en
		],
	};
	const orders = await Order.find(query);
	return orders;
}

// ----------------------------------------------------------------------------------------

// (POST) - CREATES ORDER FOR CART(id) RECEIVED
export async function createOrderFromCart(cartId) {
	const cart = await Cart.findOne({ cartId });

	if (!cart) {
		const error = new Error('could not find cart');
		error.status = 404;
		throw error;
	}

	// Henter alle prodId fra handlevognen
	const prodIds = cart.products.map((item) => item.prodId);

	// Henter korrekte produkter fra menyen
	const menuItems = await Menu.find({ prodId: { $in: prodIds } });

	// Beregner totalpris basert på "priceMap" og antall
	const priceMap = {};
	menuItems.forEach((menuItem) => {
		priceMap[menuItem.prodId] = menuItem.price;
	});

	// Beregner totalpris basert på "priceMap" og antall
	const total = cart.products.reduce((sum, item) => {
		const price = priceMap[item.prodId] || 0;
		return sum + price * item.qty;
	}, 0);

	const newOrder = new Order({
		orderId: 'order-' + uuidv4().slice(0, 5),
		userId: cart.userId, // Vil være null for gjester, eller bruker-ID for innloggede
		guestId: cart.guestId, // Denne linjen sikrer at guestId fra handlekurven lagres på ordren
		cartId: cart.cartId,
		products: cart.products,
		total,
	});
	await newOrder.save();

	return newOrder;
}
