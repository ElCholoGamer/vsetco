/// <reference types="react-scripts" />

declare module 'country-codes-list' {
	/**
	 * Returns a custom object with the passed key as object key and a value made up with
	 * values set in the placeholders of the label variable
	 * @param {*} key - Key used to construct the object to return
	 * @param {*} label - Placeholder like string, with all the fields that you want to use
	 */
	declare function customList(
		key: string,
		label: string
	): { [key: string]: string };
}
