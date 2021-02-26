import { useContext } from 'react'
import { ChallengesContext } from '../contexts/ChallengesContext'
import styles from '../styles/components/Profile.module.css'

export function Profile()
{
    const {level} = useContext(ChallengesContext);
    return(
        <div className={styles.profileContainer}>
            <img src="https://github.com/gabrielLV-BR.png" alt="Gabriel Lovato"/>
            <div>
                <strong>Gabriel Lovato Vianna</strong>
                <p><img src="icons/level.svg" alt="level-arrow"></img>
                    Level {level}</p>
            </div>
        </div>
    )
}