 import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
    x: number
     y: number 
    name: string
     gameOver: boolean
}

const Contestant = (props: Props) => {

    const { x, y, name, gameOver } = props
    const [visible, setVisible] = useState(true)
    
    useEffect(() => {
        if (gameOver) {
// Play bullet sound effect 
            const bulletSound = new Audio('/sounds/MLG sniper sound effect.mp3')
            bulletSound.play()
// Remove player after explosion animation
            setTimeout(() => setVisible(false), 1000)
        }
    }, [gameOver])
    if (!visible) return null
    // Hide the player after explosion 
    
    return (
        <AnimatePresence>
            
            <motion.div
               
                className="absolute"
                key={name}
                style={{ left: `${x}px`, top: `${y}px` }}
                initial={{ opacity: 1, scale: 1 }}
                animate={gameOver ? { scale: [1, 1.5, 0], opacity: [1, 0.5, 0] } :
                    {}} transition={{ duration: 1, ease: 'easeOut' }}
                exit={{ opacity: 0 }}
                // Fade out when removed
            >
            <div className="">
                {gameOver ? ( 
                        // Explosion animation when the player is eliminated
                    <img
                        src={'/kill-blood.png'}
                        alt={'explosion'}
                        width={50}
                        height={50}
                        className='max-sm:w-10 max-sm:h-12'
                    />) : ( 
                            // Normal player image
                            <img 
                            src={'/player.png'}
                             alt={'player'}
                             width={40} 
                            height={40} 
                            className='max-sm:w-10 max-sm:h-12' 
                            />
                    )}

                    <div 
                        className="absolute inset-0 top-2 flex justify-center items-center text-white text-xs md:font-bold max-md:text-[6px]"
                    >
                        {name}
                    </div>
   
                </div> 
  
            </motion.div>
  
        </AnimatePresence >
    )
}

export default Contestant