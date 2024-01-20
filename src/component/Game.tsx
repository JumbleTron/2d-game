import { createRef, useEffect, useState } from "react";
import { MapTiles } from "../core/MapTiles.ts";
import { CharacterTiles } from "../core/CharacterTile.ts";

function Game() {

	const CANVAS_WIDTH = 1024;
	const CANVAS_HEIGHT = 1024;

	const [characterDirection, setCharacterDirection] = useState('down');
	const [characterPositionY, setCharacterPositionY] = useState(64);
	const [characterPositionX, setCharacterPositionX] = useState(64 * 3);
	const [context, setContext] = useState<null|CanvasRenderingContext2D>();

	const canvasRef = createRef<HTMLCanvasElement>();
	const canvasWrapperRef = createRef<HTMLDivElement>();

	const mapTile = new MapTiles();
	const characterTile = new CharacterTiles();

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'ArrowDown') {
			setCharacterDirection('down');
			if (mapTile.isSolid(characterPositionX, characterPositionY + 64)) {
				return;
			}
			setCharacterPositionY(characterPositionY  => characterPositionY + 64);
		}
		if (e.key === 'ArrowUp') {
			setCharacterDirection('up');
			if (mapTile.isSolid(characterPositionX, characterPositionY - 64)) {
				return;
			}
			setCharacterPositionY(characterPositionY => characterPositionY - 64);
		}
		if (e.key === 'ArrowLeft') {
			setCharacterDirection('left');
			if (mapTile.isSolid(characterPositionX - 64, characterPositionY)) {
				return;
			}
			setCharacterPositionX(characterPositionX => characterPositionX - 64);
		}
		if (e.key === 'ArrowRight') {
			setCharacterDirection('right');
			if (mapTile.isSolid(characterPositionX + 64, characterPositionY)) {
				return;
			}
			setCharacterPositionX(characterPositionX => characterPositionX + 64);
		}
	};

	useEffect(() => {
		if (canvasRef.current) {
			setContext(canvasRef.current.getContext('2d'))
		}
	}, [canvasRef.current])

	useEffect(() => {
		if(characterPositionY) {
			window.addEventListener('keydown', handleKeyDown);
		} else {
			window.removeEventListener('keydown', handleKeyDown)
		}
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [characterPositionY, setCharacterPositionY, characterPositionX, setCharacterPositionX]);

	if (context) {
		mapTile.getTileImage().then(async (image) => {
			/*const startColumn = Math.floor(characterPositionX / 64);
			const endColumn = startColumn + (512 / 64) + 64;
			const startRow = Math.floor(characterPositionY / 64);
			const endRow = startRow + (512 / 64) + 64;*/
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
			canvasWrapperRef.current?.scroll({
				top: characterPositionY - 128,
				left: characterPositionX - 128
			})
			await characterTile.animate(context, characterPositionX, characterPositionY, characterDirection)
		})
	}

	return (
		<div className="canvasWrapper" ref={canvasWrapperRef}>
			<canvas
				ref={canvasRef}
				width={CANVAS_WIDTH}
				height={CANVAS_HEIGHT}
			/>
		</div>
	)
}

export default Game
