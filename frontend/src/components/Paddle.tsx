import React from "react";

interface PaddleProps {
	style?: React.CSSProperties;
	paddleHeight: number;
	yPosition: number;
}

const Paddle: React.FC<PaddleProps> = ({ yPosition, paddleHeight, style }) => {
	
	return (
		<div
			className="absolute bg-slate-900 dark:bg-white"
			style={{
				height: `${paddleHeight}px`,
				top: `${yPosition}px`,
				width:`8px`,
				...style,
			}}
		/>
	)
}

export default Paddle