import { createContext, ReactNode, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import challenges from '../../challenges.json'
import { LevelUpModal } from '../components/LevelUpModal';



interface Challenge
{
    type: 'body' | 'eye';
    description: string;
    amount:      number;
}

interface ChallengesProviderProps
{
    children:            ReactNode;
    level:               number;
    currentExperience:   number;
    challengesCompleted: number;
}

interface ChallengeContextData
{
    level :                 number;
    currentExperience :     number; 
    challengesCompleted :   number;
    experienceToNextLevel:  number;
    activeChallenge:        Challenge;
    levelUp:                () => void;
    startNewChallenge :     () => void;
    resetChallenge:         () => void;
    completeChallenge:      () => void;
    closeLevelUpModal:      () => void;
}

export const ChallengesContext = createContext({} as ChallengeContextData);

export function ChallengesProvider( {
    children,
    ...rest

}: ChallengesProviderProps ) 
{
    const [level, setLevel] = useState(rest.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    function levelUp()
    {
        setLevel(level + 1);
        setIsLevelUpModalOpen(true);
    }

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

    useEffect(() => 
    {
        Notification.requestPermission();
    }, []);

    useEffect(() =>
    {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengesCompleted', String(challengesCompleted));

    }, [level, currentExperience, challengesCompleted]);

    function startNewChallenge()
    {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex];
        setActiveChallenge(challenge);

        new Audio("notification.mp3").play()

        if(Notification.permission === 'granted')
        {
            new Notification("Novo desafio 🎉", {
                body: `Valendo ${challenge.amount}xp!`
            })
        }
    }

    function resetChallenge()
    {
        setActiveChallenge(null);
    }

    function closeLevelUpModal()
    {
        setIsLevelUpModalOpen(false);
    }

    function completeChallenge()
    {
        if (!activeChallenge)
        {
            return;
        }

        const xp = activeChallenge.amount;
        let finalXP = currentExperience + xp;

        if(finalXP >= experienceToNextLevel)
        {
            finalXP -= experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalXP);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);

    }

    return(
        <ChallengesContext.Provider value={{
            level, 
            currentExperience, 
            challengesCompleted,
            experienceToNextLevel,
            activeChallenge,
            levelUp,
            startNewChallenge,
            resetChallenge,
            completeChallenge,
            closeLevelUpModal }}
            > {children}
            {isLevelUpModalOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    )
}