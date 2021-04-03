function jsonReplacer(key: string, value: unknown) {
	if (typeof value === 'object' && value && '_id' in value) {
		const obj = value as { _id?: string; id?: string };
		obj.id = obj._id;
		delete obj._id;
	} else if (['password', '__v'].includes(key)) {
		return undefined;
	}

	return value;
}

export default jsonReplacer;
