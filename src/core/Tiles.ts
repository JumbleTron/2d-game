import { loadImage } from "../utils/getImage.ts";

export abstract class Tiles
{
	public static INDEX_EMPTY = -1;

	protected layers: number[][][] = [[[]]];

	protected src: string = '';

	public getLayers() {
		return this.layers;
	}

	public async getTileImage(): Promise<CanvasImageSource>
	{
		return await loadImage(this.src)
	}
}