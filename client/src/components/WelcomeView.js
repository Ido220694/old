import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import randomCodeGenerator from '../utils/randomCodeGenerator'
import { ContentWrap } from './contentStyles'
const WelcomeView = () => {
    const [roomCode, setRoomCode] = useState('')

    return (
        <ContentWrap>
        <div className='Homepage'>
            <div className='homepage-menu'>
                {/* <img src={require('../assets/logo.png').default} width='200px' /> */}
                <div className='homepage-form'>
                    <div className='homepage-join'>
                        <input type='text' placeholder='Game Code' onChange={(event) => setRoomCode(event.target.value)} />
                        <Link to={`/play?roomCode=${roomCode}`}><button className="game-button green">JOIN GAME</button></Link>
                    </div>
                    <h3>OR</h3>
                    <div className='homepage-create'>
                        <Link to={`/play?roomCode=${randomCodeGenerator(5)}`}><button className="game-button orange">CREATE GAME</button></Link>
                    </div>
                </div>
            </div>
        </div>
        </ContentWrap>
    )
}

export default WelcomeView
