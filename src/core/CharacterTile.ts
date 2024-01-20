import { Tiles } from "./Tiles.ts";

export class CharacterTiles extends Tiles
{
	public static TILE_WIDTH = 64;
	public static TILE_HEIGHT = 64;
	constructor() {
		super();
		this.src = 'assets/character.png';
	}

	public async animate(canvasContext: CanvasRenderingContext2D, positionX: number, positionY: number, direction: string) {
		/*const background = canvasContext.getImageData(
			positionX,
			positionY,
			64,
			64
		);*/

		let sx = 64;
		let sy = 128;

		if (direction === 'down') {
			sy = 128;
			sx = 64;
		}

		if (direction === 'up') {
			sy = 0;
			sx = 0;
		}

		if (direction === 'left') {
			sy = 64;
			sx = 0;
		}

		if (direction === 'right') {
			sy = 192;
			sx = 0;
		}

		const characterImage = await this.getTileImage();
		//const currentFrame = 1
		//setInterval(() => {
			//if (currentFrame === 7) {
			//	currentFrame = 0;
			//}
			//canvasContext.putImageData(background, positionX, positionY);
			canvasContext.drawImage(
				characterImage,
				sx,
				sy,
				64,
				64,
				positionX,
				positionY,
				64,
				64
			)
			//currentFrame++;
	//	}, 1000/10)
	}
}