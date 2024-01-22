import { loadImage } from "../utils/getImage.ts";

export abstract class Tiles
{
	public static INDEX_EMPTY = -1;

	protected layers: number[][][] = [[[]]];

	protected src: string = '';

	protected image?: CanvasImageSource;

	public getLayers() {
		return this.layers;
	}

	public async getTileImage(): Promise<CanvasImageSource>
	{
		const image = await loadImage(this.src);
		this.image = image

		return image
	}
}