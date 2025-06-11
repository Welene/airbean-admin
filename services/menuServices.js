import Menu from '../models/menu.js';
import { v4 as uuidv4 } from 'uuid';

export async function getAllMenuItems() {
	return await Menu.find();
}

export async function addMenuItem(title, desc, price) {
	const makeProdId = 'prod-' + uuidv4().slice(0, 5);

	const newMenuItem = new Menu({
		prodId: makeProdId,
		title: title,
		desc: desc,
		price: price,
	});
	await newMenuItem.save();
	return newMenuItem;
}

export async function updateMenuItem(prodIdToFind, { title, desc, price }) {
	const updatedMenuItem = await Menu.findOneAndUpdate(
		{ prodId: prodIdToFind },
		{ title, desc, price },
		{ new: true, runValidators: true }
	);
	return updatedMenuItem;
}
export async function deleteMenuItem(prodIdToFind) {
	const deletedMenuItem = await Menu.findOneAndDelete({
		prodId: prodIdToFind,
	});
	return deletedMenuItem;
}
