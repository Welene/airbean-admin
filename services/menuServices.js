import Menu from '../models/menu.js';

export async function getAllMenuItems() {
	return await Menu.find();
}

export async function addMenuItem(title, desc, price) {
	const newMenuItem = new Menu({
		title: title,
		desc: desc,
		price: price,
	});
	await newMenuItem.save();
	return newMenuItem;
}

export async function updateMenuItem(id, { title, desc, price }) {
	const updatedMenuItem = await Menu.findByIdAndUpdate(
		id,
		{ title, desc, price },
		{ new: true, runValidators: true }
	);
	return updatedMenuItem;
}

export async function deleteMenuItem(id) {
	const deletedMenuItem = await Menu.findByIdAndDelete(id);
	return deletedMenuItem;
}
