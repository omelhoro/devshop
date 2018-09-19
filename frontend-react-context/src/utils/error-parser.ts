export default async function errorParser(error) {
	try {
		if (error.json) {
			const json = await error.json();
			if (json.message) {
				return json.message;
			} else {
				console.info('Server returned an unresolved error', json);
				return 'An unknown error happened';
			}
		}
	} catch (err) {
		console.info('Could not decode error', error);
		return 'An unknown error happened';
	}
}
