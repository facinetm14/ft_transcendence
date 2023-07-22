import React, { useState, useEffect, useRef } from 'react'
import Ball from './Ball'
import Paddle from './Paddle'
import VictoryLoss from './VictoryLoss';
import Boost from './Boost';

interface PongProps {
	difficulty: number;
	isGameActive: boolean;
	isReset: boolean;
	playerScore: number;
	botScore: number;
	isGameOver: boolean;
	setIsGameOver: (boolean: boolean) => void;
	playerPoint: () => void;
	botPoint: () => void;
	setReset: (boolean: boolean) => void;
  }

const Pong: React.FC<PongProps> = ({ difficulty, isGameActive, isGameOver, setIsGameOver, isReset, playerScore, botScore, playerPoint, botPoint, setReset }) => {

	const itsdifficult = (difficulty + 2) * 2
	const PongRef = useRef<HTMLDivElement>(null);
	const paddleLengths = [200, 150, 100, 80, 50]
	const botpaddleLengths = [50, 60, 70, 80, 90]
	const [playerScore2, setPlayerScore2] = useState(0);
	const [speedX, setSpeedX] = useState(-(itsdifficult));
	const [speedY, setSpeedY] = useState(-(itsdifficult));
	const [isBoost, setIsBoost] = useState(false);
	const [playerPaddleDirection, setPlayerPaddleDirection] = useState<number>(0);
	const [playerPaddleSpeed, setPlayerPaddleSpeed] = useState(18 - (difficulty * 2));
	const [botPaddleSpeed, setBotPaddleSpeed] = useState(0.5 + (difficulty));
	const [leftPaddleY, setLeftPaddleY] = useState(0);
	const [rightPaddleY, setRightPaddleY] = useState(0);
	var startX = 50;
	var startY = 50;
	if (PongRef.current) {
		startX = (PongRef.current?.clientWidth - 30) / 2 // The 30 here is somewhat a random value, but seems to be neccessary to calculate the exact location the screen ends.
		startY = (PongRef.current?.clientHeight - 30) / 2
	}
	const [ballX, setBallX] = useState(startX);
	const [ballY, setBallY] = useState(startY);

	const checkCollision = () => {
		// Ball boundaries
		const ballLeft = ballX;
		const ballRight = ballX + 8; // Ball width is 8 pixels
		const ballCenter = ballY + 4; // half the diameter = radius
	  
		// Left Paddle boundaries
		const leftPaddleRight = 10; // Paddle width is 10 pixels
		const leftPaddleTop = leftPaddleY;
		const leftPaddleBottom = leftPaddleY + paddleLengths[difficulty];
	  
		// Container boundaries
		const containerTop = 0;
		var containerBottom = 800;

		// Right Paddle boundaries
		var rightPaddleLeft = 500;
		if (PongRef.current) {
			rightPaddleLeft = PongRef.current?.clientWidth - 30;// Paddle width is 10 pixels
			containerBottom = PongRef.current?.clientHeight - 30;
		}
		const rightPaddleTop = rightPaddleY;
		const rightPaddleBottom = rightPaddleY + botpaddleLengths[difficulty];

		// Calculate relative position of ball within the left paddle
		const relativePosition = (ballCenter - leftPaddleTop) / (paddleLengths[difficulty]);

		// Map relative position to an angle between -45 and +45 degrees
		const mappedAngle = (relativePosition * 45) / 2;
	  
		// Calculate the new Y-velocity component based on the mapped angle
		const newSpeedY = speedX < 0 ? -itsdifficult * Math.sin((mappedAngle * Math.PI) / 180) : itsdifficult * Math.sin((mappedAngle * Math.PI) / 180);
	
		const randomnessFactor = (difficulty / 4); // You can adjust this value to control the amount of randomness
    	const randomSpeedY = newSpeedY * (1 + Math.random() * randomnessFactor);

		// Check collision with left paddle
		// Check whether Bot made a point
		if (ballLeft <= (leftPaddleRight + itsdifficult * 3) &&
			ballLeft >= (leftPaddleRight - (itsdifficult * 3)) &&
			speedX < 0 &&
			ballCenter >= leftPaddleTop - (itsdifficult) &&
			ballCenter <= leftPaddleBottom + (itsdifficult)
		) {
			if (isBoost) {
				setSpeedX(prevSpeedX => prevSpeedX * 0.66);
				setIsBoost(false);
			}
			setSpeedX(-speedX * 1.2)
			setSpeedY(randomSpeedY * 1.2);
		} else if (ballRight < leftPaddleRight && !isReset) {
			botPoint();
			setSpeedX(-speedX)
			setReset(true);
		}

		// Check collision with right paddle
		// Check whether Player made a point
		if (ballRight >= (rightPaddleLeft - (itsdifficult * 3)) &&
			ballRight <= (rightPaddleLeft + itsdifficult * 3) &&
			speedX > 0 &&
			ballCenter >= rightPaddleTop - (itsdifficult) && 
			ballCenter <= rightPaddleBottom + (itsdifficult)
		) {
			if (isBoost) {
				setSpeedX(prevSpeedX => prevSpeedX * 0.66);
				setIsBoost(false);
			}
			setSpeedX(-speedX * 0.8)
			setSpeedY(newSpeedY * 0.8);
		} else if (ballLeft > (rightPaddleLeft) && !isReset) {
			playerPoint();
			setPlayerScore2(playerScore2 + 1);
			setReset(true);
			setSpeedX(-speedX)
		}
		
		// collision with container top
		if (ballY < 0 && speedY < 0){
			setSpeedY(-speedY)
		}
		
		// collision with container bottom
		if (ballY > containerBottom && speedY > 0) {
			setSpeedY(-speedY)
		}
	};
	const moveBall = () => {
		const boostStartX = startX - 40; // Centered horizontally
		const boostEndX = boostStartX + 80;
		const boostStartY = startY - 40; // Centered vertically
		const boostEndY = boostStartY + 80;
		const ballCenterX = ballX + 4;
		const ballCenterY = ballY + 4;
		
		const isInBoostRegion =
		ballCenterX >= boostStartX &&
		ballCenterX <= boostEndX &&
		ballCenterY >= boostStartY &&
		ballCenterY <= boostEndY;

		// setIsBoost(isInBoostRegion)
		// Ball is inside the Boost region, increase speed by 50%
		if (isInBoostRegion && !isBoost) {
			setSpeedX(prevSpeedX => prevSpeedX * 2.5);
			setSpeedY(prevSpeedY => prevSpeedY * 2.5);
			setIsBoost(true);
		}

		setBallX((prevX) => prevX + speedX);
		setBallY((prevY) => prevY + speedY);
	};

	const movePaddles = () => {
		setLeftPaddleY((prevY) => {
		  let newY = prevY + playerPaddleDirection * playerPaddleSpeed;
	  
		  // Ensure the paddle stays within the valid range
		  if (newY < 0) {
			newY = 0;
		  } else if (newY > (startY * 2) + 30 - paddleLengths[difficulty]) {
			newY = (startY * 2) + 30 - paddleLengths[difficulty]; // Maximum paddle height is div height - paddle length
		  }
	  
		  return newY;
		})

		setRightPaddleY((prevY) => {
			// Track the ball's position
			const ballCenter = ballY + 4; // half the diameter = radius
		
			// Calculate the difference between the current position and the target position (the ball's center)
			const diff = ballCenter - (prevY + botpaddleLengths[difficulty] / 2);
		
			// Adjust the paddle's movement speed based on difficulty (higher difficulty = faster movement)
			const adjustedPaddleSpeed = botPaddleSpeed + difficulty;
		
			// Move the paddle towards the ball's position

			var newY = prevY;
			if (Math.abs(diff) > (botpaddleLengths[difficulty] - difficulty * 18)) {
				newY = prevY + Math.sign(diff) * Math.min(Math.abs(diff), adjustedPaddleSpeed);
			}
		
			// Ensure the paddle stays within the valid range
			if (newY < 0) {
			  newY = 0;
			} else if (newY > (startY * 2) + 30 - paddleLengths[difficulty]) {
			  newY = (startY * 2) + 30 - paddleLengths[difficulty];
			}
		
			return newY;
		})
	}

	useEffect(() => {
		const gameLoop = setInterval(() => {
			if (isGameActive && !isGameOver) {
				movePaddles();
				moveBall();
				checkCollision();
			}
			if (playerScore >= 5 || botScore >= 5) {
				setIsGameOver(true);
			}
			if (isReset && !isGameOver) {
				setBallX(startX);
				setBallY(startY);
				setSpeedX(Math.sign(speedX) * itsdifficult);
				setSpeedY(Math.sign(speedY) * itsdifficult);
				setIsBoost(true);
				setReset(false);
			}
		}, 1000 / 60);

		return () => clearInterval(gameLoop);
	}, [isGameActive, isGameOver, isReset, isBoost, difficulty, playerScore2, ballX, ballY, speedX, speedY, leftPaddleY, rightPaddleY, checkCollision, moveBall, movePaddles]);

	// Track player key input
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'w' || event.key === 'ArrowUp') {
				setPlayerPaddleDirection(-1); // Move paddle up
			} else if (event.key === 's' || event.key === 'ArrowDown') {
				setPlayerPaddleDirection(1); // Move paddle down
			}
		};
	  
		const handleKeyUp = (event: KeyboardEvent) => {
			if (event.key === 'w' || event.key === 'ArrowUp' || event.key === 's' || event.key === 'ArrowDown') {
				setPlayerPaddleDirection(0); // Stop paddle movement
			}
		};
	  
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);
	  
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	}, [isGameActive, isReset, isBoost, ballX, ballY, speedX, speedY, leftPaddleY, movePaddles]);

	
	

	return (
		<div className="relative w-full h-full" ref={PongRef}>
			<Paddle yPosition={leftPaddleY} paddleHeight={paddleLengths[difficulty]} style={{ left: 0 }}/>
			<Paddle yPosition={rightPaddleY} paddleHeight={botpaddleLengths[difficulty]} style={{ right: 0 }}/>
			<div className="relative bg-slate-900">
    			<Ball xPosition={ballX} yPosition={ballY} />
    		</div>
			<div>
				<Boost />
			</div>
			{isGameOver ? (
					<div className="absolute inset-0 bg-black bg-opacity-80">
						<VictoryLoss isVictory={playerScore === 5}/>
					</div>
				) : null
			}
		</div>
	)
}

export default Pong



