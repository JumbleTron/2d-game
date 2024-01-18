export const loadImage = async (src: string) => {

	const image = new Image();
	const promise = new Promise((resolve, reject) => {
		image.onload = () => {
			resolve(image);
		};

		image.onerror = () => {
			reject("Could not load image: " + src);
		};
	});

	image.src = src;

	try {
		await promise;
		return image;
	} catch (e) {
		return null;
	}
};
