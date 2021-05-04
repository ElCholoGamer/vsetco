interface ObjectWithId {
	_id?: string;
	id?: string;
}

interface ObjectWithVotes {
	upvotes: string[] | number;
	downvotes: string[] | number;
}

function jsonReplacer(key: string, value: unknown) {
	if (typeof value === 'object' && value) {
		// Transform _id to id
		if ('_id' in value) {
			const objectWithId = value as ObjectWithId;

			objectWithId.id = objectWithId._id;
			delete objectWithId._id;
		}

		// Trasnform vote ID lists to vote number

		if ('upvotes' in value && 'downvotes' in value) {
			const objectWithVotes = value as ObjectWithVotes;

			objectWithVotes.upvotes = (objectWithVotes.upvotes as string[]).length;
			objectWithVotes.downvotes = (objectWithVotes.downvotes as string[]).length;
		}
	} else if (['password', '__v'].includes(key)) {
		// Remove some fields
		return undefined;
	}

	return value;
}

export default jsonReplacer;
