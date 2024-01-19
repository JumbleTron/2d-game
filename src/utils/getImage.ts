export const loadImage = (src: string): Promise<HTMLImageElement> => {
	const image = new Image();
	image.src = src
	return new Promise((resolve) => {
		image.onload = () => {
			resolve(image);
		};

		image.onerror = () => {
			image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAm0lEQVRoQ+" +
				"3YMRWAMBQEwcRT/Cv4nuAhYYtQDQaAyXIFe2aedfk65+zLt1jbiwRiJxKwpBWwlrSClrQClrQKlrSKltUKWtIKW" +
				"FarYEmraFmtoCWtgGW1Cpa0ipbVClrXf5x9z/LHvzMvEk7diRQsaRUtH3vQklbAsloFS1pFy2oFLWkFLKtVsKRVt" +
				"KxW0JJWwLJaBUtaRctqBa0X1+W43qGn25cAAAAASUVORK5CYII="
			resolve(image)
		};
	})
}