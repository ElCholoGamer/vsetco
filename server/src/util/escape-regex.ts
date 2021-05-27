// thanks stackoverflow
function escapeRegex(str: string) {
	return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}

export default escapeRegex;
