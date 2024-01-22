import { createRef, useEffect, useState } from "react";
import { MapTiles } from "../core/MapTiles.ts";
import { CharacterTiles } from "../core/CharacterTile.ts";

function Game() {

	const CANVAS_WIDTH = 1024;
	const CANVAS_HEIGHT = 1024;

	let frameStart = 0;
	let frame = 0;

	const [characterDirection, setCharacterDirection] = useState('down');
	const [characterPositionY, setCharacterPositionY] = useState(64);
	const [characterPositionX, setCharacterPositionX] = useState(64 * 3);
	const [context, setContext] = useState<null|CanvasRenderingContext2D>();
	const [mapImage, setMapImage] = useState<null|CanvasImageSource>();
	const [characterImage, setCharacterImage] = useState<null|CanvasImageSource>();

	const canvasRef = createRef<HTMLCanvasElement>();
	const canvasWrapperRef = createRef<HTMLDivElement>();

	const mapTile = new MapTiles();
	const characterTile = new CharacterTiles();

	const renderMap = (mapLayers: number[][][], mapImage: CanvasImageSource, context: CanvasRenderingContext2D) => {
		for (let layer = 0; layer < mapLayers.length; layer++) {
			for (let i = 0; i < mapLayers[layer].length; i++) {
				for (let j = 0; j < mapLayers[layer][i].length; j++) {
					if (mapLayers[layer][i][j] === -1) {
						continue;
					}
					context.drawImage(
						mapImage,
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
	}

	const renderCharacter = (context: CanvasRenderingContext2D, characterImage: CanvasImageSource, frame: number) => {
		let sy = 10;

		if (characterDirection === 'down') {
			sy = 10;
		}

		if (characterDirection === 'up') {
			sy = 8;
		}

		if (characterDirection === 'left') {
			sy = 9;
		}

		if (characterDirection === 'right') {
			sy = 11;
		}

		context.drawImage(
			characterImage,
			64 * frame,
			sy * 64,
			64,
			64,
			characterPositionX,
			characterPositionY,
			64,
			64
		)
	}

	const animate = () => {
		window.requestAnimationFrame(animate)
		const now = new Date().getTime();
		const passed = now - frameStart;
		if (context && mapImage) {
			const mapLayers = mapTile.getLayers();
			renderMap(mapLayers, mapImage, context);
			if (characterImage) {
				if (passed > 60) {
					frame = (frame + 1)%9;
					renderCharacter(context, characterImage, frame);
					frameStart = now;
				}
				renderCharacter(context, characterImage, frame);
			}
		}
	}

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

	const resizeCanvas = () => {
		if (context) {
			context.canvas.width  =  window.innerWidth;
			context.canvas.height = window.innerHeight;
		}
	}

	useEffect(() => {
		if (canvasRef.current) {
			setContext(canvasRef.current.getContext('2d'))
			resizeCanvas()
		}

		async function getMapImage() {
			const map = await mapTile.getTileImage();
			setMapImage(map);
		}
		if (!mapImage) {
			getMapImage();
		}
		async function getCharacterImage() {
			const character = await characterTile.getTileImage();
			setCharacterImage(character);
		}
		if (!characterImage) {
			getCharacterImage();
		}
		window.addEventListener('resize', resizeCanvas);
		return () => window.removeEventListener('resize', resizeCanvas);
	}, [])

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [characterPositionY, setCharacterPositionY, characterPositionX, setCharacterPositionX]);

	animate()

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
