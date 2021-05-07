interface User {
	id: string;
	email: string;
	username: string;
	contacts: {
		phone?: string;
		address?: string;
	};
	country: string;
}

export default User;
