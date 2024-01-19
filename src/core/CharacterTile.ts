import { Tiles } from "./Tiles.ts";

export class CharacterTiles extends Tiles
{
	public static TILE_WIDTH = 64;
	public static TILE_HEIGHT = 64;
	constructor() {
		super();
		this.src = 'assets/character.png';
	}

	public async animate(canvasContext: CanvasRenderingContext2D, positionX: number, positionY: number) {
		/*const background = canvasContext.getImageData(
			positionX,
			positionY,
			64,
			64
		);*/

		const characterImage = await this.getTileImage();
		let currentFrame = 1
		//setInterval(() => {
			if (currentFrame === 7) {
				currentFrame = 0;
			}
			//canvasContext.putImageData(background, positionX, positionY);
			canvasContext.drawImage(
				characterImage,
				currentFrame * 64,
				64 * 2,
				64,
				64,
				positionX,
				positionY,
				64,
				64
			)
			currentFrame++;
	//	}, 1000/10)
	}
}