import { useState, useEffect } from 'react';

const VISITOR_ID_KEY = 'tahinlikabak_visitor_id';
const VISITOR_NAME_KEY = 'tahinlikabak_visitor_name';

const funnyNames = [
	'Meraklı Kabak',
	'Gizemli Tahin',
	'Gezgin Bal',
	'Düşünceli Ceviz',
	'Neşeli Badem',
	'Şaşkın Fındık',
	'Hayalperest Hurma',
	'Maceracı Zeytin',
	'Bilge Susam',
	'Kaşif Kaju',
	'Muzır Muz',
	'Uykucu Üzüm',
	'Atılgan Ananas',
	'Cesur Çilek',
	'Dalgın Dut',
];

function generateVisitorId(): string {
	return 'v_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function generateVisitorName(): string {
	return funnyNames[Math.floor(Math.random() * funnyNames.length)];
}

export function useVisitorId() {
	const [visitorId, setVisitorId] = useState<string>('');
	const [visitorName, setVisitorName] = useState<string>('');

	useEffect(() => {
		let id = localStorage.getItem(VISITOR_ID_KEY);
		let name = localStorage.getItem(VISITOR_NAME_KEY);

		if (!id) {
			id = generateVisitorId();
			localStorage.setItem(VISITOR_ID_KEY, id);
		}

		if (!name) {
			name = generateVisitorName();
			localStorage.setItem(VISITOR_NAME_KEY, name);
		}

		setVisitorId(id);
		setVisitorName(name);
	}, []);

	return { visitorId, visitorName };
}
