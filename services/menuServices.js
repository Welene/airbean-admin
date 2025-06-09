import Menu from '../models/menu.js';
import { v4 as uuidv4 } from 'uuid';

export async function addMenuItem() {
	const menu = await Menu.findOne();

	if (!menu) {
		const error = new Error('could not find any menu - your fault!');
		error.status = 404;
		throw error;
	}

	const newMenuItem = new Menu({
		adminId: 'order-' + uuidv4().slice(0, 5),
		products: products.title,
		products: products.desc,
		products: products.price,
		// Vid POST-anrop måste man specifikt säga vad som ska finnas med i menyn.
		// Det finns redan en blueprint (Schema), men vid POST måste man ändå
		// säga till koden att "det här måste du faktiskt ha med".
	});
}
