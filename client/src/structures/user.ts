interface User {
	id: string;
	username: string;
	contacts: {
		email?: string;
		phone?: string;
		address?: string;
	};
	country: string;
}

export default User;
