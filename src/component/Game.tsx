import {createRef, useEffect, useState} from "react";

function Game() {

	const CANVAS_WIDTH = 512;
	const CANVAS_HEIGHT = 512;

	const [context, setContext] = useState<null|CanvasRenderingContext2D>();
	const canvasRef = createRef<HTMLCanvasElement>();

	useEffect(() => {
		if (canvasRef.current) {
				setContext(canvasRef.current.getContext('2d'))
			}
	}, [canvasRef.current])

	if (context) {
			const image = new Image();
			image.src = 'assets/tiles.png'
			image.onload = () => {
				context.drawImage(
					image, 0,0)
			};
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
