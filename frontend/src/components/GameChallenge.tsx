import { Game } from '../types';
import { Button } from './ui/Button';

interface GameChallengeProps{
    game: Game,
}

const GameChallenge: React.FC<GameChallengeProps> = ({ game }) => {


    return (
        <div className='h-full w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-slate-900 bg-opacity-70'>
			<div className='rounded h-1/2 w-1/2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-slate-900 dark:bg-slate-200'>
				<div className="h-full p-4 flex-cols text-center justify-between space-y-4">
                    <Button>
                        Accept Challenge!
                    </Button>
                    <Button>
                        Decline Challenge!
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default GameChallenge