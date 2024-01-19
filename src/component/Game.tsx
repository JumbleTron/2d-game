import {createRef, useEffect, useState} from "react";
import { MapTiles } from "../core/MapTiles.ts";
import {CharacterTiles} from "../core/CharacterTile.ts";

function Game() {

	const CANVAS_WIDTH = 1024;
	const CANVAS_HEIGHT = 1024;
	//const [isMove, setIsMove] = useState(false);
	const [characterPositionY, setCharacterPositionY] = useState(30);
	const [characterPositionX, setCharacterPositionX] = useState(64 * 3);
	const [context, setContext] = useState<null|CanvasRenderingContext2D>();
	const canvasRef = createRef<HTMLCanvasElement>();
	const mapTile = new MapTiles();
	const characterTile = new CharacterTiles();

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'ArrowDown') {
			setCharacterPositionY(characterPositionY  => characterPositionY + 30);
			//setIsMove(isMove => !isMove);
		}
		if (e.key === 'ArrowUp') {
			setCharacterPositionY(characterPositionY => characterPositionY - 30);
			//setIsMove(isMove => !isMove);
		}
		if (e.key === 'ArrowLeft') {
			setCharacterPositionX(characterPositionX => characterPositionX - 30);
			//setIsMove(isMove => !isMove);
		}
		if (e.key === 'ArrowRight') {
			setCharacterPositionX(characterPositionX => characterPositionX + 30);
			//setIsMove(isMove => !isMove);
		}
	};

	/*const handleKeyUp = (e: KeyboardEvent) => {
		console.log('ipps')
		if (e.key === 'ArrowDown') {
			setIsMove(isMove => !isMove);
		}
		if (e.key === 'ArrowUp') {
			setIsMove(isMove => !isMove);
		}
		if (e.key === 'ArrowLeft') {
			setIsMove(isMove => !isMove);
		}
		if (e.key === 'ArrowRight') {
			setIsMove(isMove => !isMove);
		}
	};*/

	useEffect(() => {
		if (canvasRef.current) {
			setContext(canvasRef.current.getContext('2d'))
		}
	}, [canvasRef.current])

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		//window.addEventListener('keyup', handleKeyUp);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			//window.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

	if (context) {
		mapTile.getTileImage().then(async (image) => {
			const mapLayers = mapTile.getLayers();
			for (let layer = 0; layer < mapLayers.length; layer++) {
				for (let i = 0; i < mapLayers[layer].length; i++) {
					for (let j = 0; j < mapLayers[layer][i].length; j++) {
						if (mapLayers[layer][i][j] === -1) {
							continue;
						}

						context.drawImage(
							image,
							mapLayers[layer][i][j] * MapTiles.TILE_WIDTH,
							0,
							MapTiles.TILE_WIDTH,
							MapTiles.TILE_HEIGHT,
							j * MapTiles.TILE_WIDTH,
							i * MapTiles.TILE_HEIGHT,
							MapTiles.TILE_WIDTH,
							MapTiles.TILE_HEIGHT,
						)
					}
				}
			}

			await characterTile.animate(context, characterPositionX, characterPositionY)
		})
	}

	return (
		<>
			<canvas
				ref={canvasRef}
				width={CANVAS_WIDTH}
				height={CANVAS_HEIGHT}
			/>
		</>
	)
}

export default Game
