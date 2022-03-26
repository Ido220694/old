import React, { useEffect, useState, useRef } from 'react';
// import shuffleArray from '../utils/shuffleArray'
import io from 'socket.io-client';
import queryString from 'query-string';
// import Canva from './Canva';
import Board from './Board';
import StreamForm from './StreamForm';


let socket
const ENDPOINT = 'http://localhost:5000'

// const ENDPOINT = 'https://uno-online-multiplayer.herokuapp.com/'

const Game = (props) => {

    const data = queryString.parse(props.location.search)

    //initialize socket state
    const [room, setRoom] = useState(data.roomCode)
    const [roomFull, setRoomFull] = useState(false)
    const [users, setUsers] = useState([])
    const [currentUser, setCurrentUser] = useState('')
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    useEffect(() => {
        const connectionOptions =  {
            "forceNew" : true,
            "reconnectionAttempts": "Infinity", 
            "timeout" : 10000,                  
            "transports" : ["websocket"]
        }
        socket = io.connect(ENDPOINT, connectionOptions)

        socket.emit('join', {room: room}, (error) => {
            if(error)
                setRoomFull(true)
        })

        //cleanup on component unmount
        return function cleanup() {
            socket.emit('disconnect')
            //shut down connnection instance
            socket.off()
        }
    }, [])

    
    const [points, setPoints] = useState(0)

    const [didChoseLevel, setDidChoseLevel] = useState(true)
    const [didChoseWord, setDidChoseWord] = useState(true)
    const [finishDrawing, setFinishDrawing] = useState(true)

    const [chosenLevel, setChosenLevel] = useState('')
    const [chosenWord, setChosenWord] = useState('')
    const [draw, setDraw] = useState(null)
    const [word1, setWord1] = useState('')
    const [word2, setWord2] = useState('')
    const [word3, setWord3] = useState('')
    const [level, setLevel] = useState('')

    const [isDraw, setIsDraw] = useState(true)

    const [gameOver, setGameOver] = useState(true)

    // const [winner, setWinner] = useState('')
    const [turn, setTurn] = useState('')

    //runs once on component mount
    useEffect(() => {

        //send initial state to server
        socket.emit('initGameState', {
            gameOver: false,
            turn: 'Player 1',
            didChoseLevel:false,
            didChoseWord:false,
            finishDrawing:false,
            points:0
        })
    }, [])


    useEffect(() => {
        socket.on('initGameState', ({ gameOver, turn, didChoseLevel, didChoseWord ,finishDrawing, points}) => {
            setGameOver(gameOver)
            setTurn(turn)
            setDidChoseLevel(didChoseLevel)
            setDidChoseWord(didChoseWord)
            setFinishDrawing(finishDrawing)
            setPoints(points)
            // setPlayer1Deck(player1Deck)
            // setPlayer2Deck(player2Deck)
            // setCurrentColor(currentColor)
            // setCurrentNumber(currentNumber)
            // setPlayedCardsPile(playedCardsPile)
            // setDrawCardPile(drawCardPile)
        })

        socket.on('updateGameState', ({ gameOver, turn, chosenWord, level , didChoseLevel, didChoseWord, finishDrawing, points}) => {
            console.log("Update")
            gameOver && setGameOver(gameOver)
            // gameOver===true && playGameOverSound()
            // winner && setWinner(winner)
            turn && setTurn(turn)
            chosenWord && setChosenWord(chosenWord)
            level && setChosenLevel(level)
            didChoseLevel && setDidChoseLevel(didChoseLevel)
            didChoseWord && setDidChoseWord(didChoseWord)
            finishDrawing && setFinishDrawing(finishDrawing)
            points && setPoints(points)

            // player1Deck && setPlayer1Deck(player1Deck)
            // player2Deck && setPlayer2Deck(player2Deck)
            // currentColor && setCurrentColor(currentColor)
            // currentNumber && setCurrentNumber(currentNumber)
            // playedCardsPile && setPlayedCardsPile(playedCardsPile)
            // drawCardPile && setDrawCardPile(drawCardPile)
            // setUnoButtonPressed(false)
        })

        socket.on('drawing', ({ draw }) => {
            console.log("YAHAV")
            draw && setDraw(draw)
        })


        socket.on("roomData", ({ users }) => {
            setUsers(users)
        })

        socket.on('currentUserData', ({ name }) => {
            setCurrentUser(name)
        })

        socket.on('message', message => {
            setMessages(messages => [ ...messages, message ])

            const chatBody = document.querySelector('.chat-body')
            chatBody.scrollTop = chatBody.scrollHeight
        })
    }, [])

    const Canva = () => {

        // var socket = props;
        const canvasRef = useRef(null)
        const contextRef = useRef(null)
        const [isDrawing, setisDrawing] = useState(false)
        
        useEffect(()=>{
            const canvas = canvasRef.current;
            canvas.width = window.innerWidth *2;
            canvas.height = window.innerHeight *2;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            const context = canvas.getContext("2d");
            context.scale(2,2)
            context.lineCap ="round"
            context.strokeStyle = "black"
            context.lineWidth = 5
            contextRef.current = context;


        },[])
    
        const startDraw= ({nativeEvent}) => {

    
            const {offsetX, offsetY} = nativeEvent

            contextRef.current.beginPath()
            contextRef.current.moveTo(offsetX, offsetY)
            setisDrawing(true)

    
        }
    
        const endDraw = () => {
            

            contextRef.current.closePath()
            setisDrawing(false)
        }
    
        const draw = ({nativeEvent}) => {
            if(!isDrawing){
                return
            }
            const {offsetX, offsetY} = nativeEvent;
            contextRef.current.lineTo(offsetX, offsetY)
            contextRef.current.stroke()
        }
    
        return(
            <canvas
            onMouseDown={startDraw}
            onMouseUp={endDraw}
            onMouseMove={draw}
            ref={canvasRef}
            />
        );
        
    
    }


    const onChoosingLevel = (lev) => {
        setLevel(lev)
        console.log("YAYA");
        var w1 ;
        var w2 ;
        var w3 ;

        if (lev =='Easy'){

        }
        else if (lev == 'Medium'){

        }
        else{

        }
        
        w1 = chooseWord();
        w2 = chooseWord();
        w3 = chooseWord();
        setWord1(w1);
        setWord2(w2);
        setWord3(w3);
        setDidChoseLevel(true);
        socket.emit('updateGameState', {
            gameOver: checkGameOver(false),
            // winner: checkWinner(player2Deck, 'Player 2'),
            turn: 'Player 1',
            chosenWord: '',
            level:level,
            didchoselevel:true,
            didChoseWord:false,
            finishDrawing:false,
            points:points

            // playedCardsPile: [...playedCardsPile.slice(0, playedCardsPile.length), played_card, ...playedCardsPile.slice(playedCardsPile.length)],
            // player2Deck: [...player2Deck.slice(0, removeIndex), ...player2Deck.slice(removeIndex + 1)],
            // currentColor: colorOfPlayedCard,
            // currentNumber: numberOfPlayedCard
        })


    }

    const onChoosingWord = (word, level) => {
        socket.emit('updateGameState', {
            gameOver: checkGameOver(false),
            // winner: checkWinner(player2Deck, 'Player 2'),
            turn: 'Player 1',
            chosenWord: word,
            level:level,
            didchoselevel:true,
            didChoseWord:true,
            finishDrawing:false,
            points:points

            // playedCardsPile: [...playedCardsPile.slice(0, playedCardsPile.length), played_card, ...playedCardsPile.slice(playedCardsPile.length)],
            // player2Deck: [...player2Deck.slice(0, removeIndex), ...player2Deck.slice(removeIndex + 1)],
            // currentColor: colorOfPlayedCard,
            // currentNumber: numberOfPlayedCard
        })

    }

    const onDrawing = () => {

    }

    const onSendingDraw = () => {
        socket.emit('updateGameState', {
            gameOver: checkGameOver(false),
            // winner: checkWinner(player2Deck, 'Player 2'),
            turn: 'Player 1',
            chosenWord: chosenWord,
            level:level,
            didchoselevel:true,
            didChoseWord:true,
            finishDrawing:true,
            points:points

            // playedCardsPile: [...playedCardsPile.slice(0, playedCardsPile.length), played_card, ...playedCardsPile.slice(playedCardsPile.length)],
            // player2Deck: [...player2Deck.slice(0, removeIndex), ...player2Deck.slice(removeIndex + 1)],
            // currentColor: colorOfPlayedCard,
            // currentNumber: numberOfPlayedCard
        })


    }

    

    //some util functions
    const checkGameOver = (ans) => {
        return ans
        // return arr.length === 1
    }
    
    const checkWinner = (arr, player) => {
        return arr.length === 1 ? player : ''
    }

    const chooseWord= () =>{
        var randomWords = require('random-words');

        // console.log(randomWords());
        var v= randomWords();
        return v;

    }

    const onSuccess = () =>{

        //switch players
        //offset all parameters
        var new_points;
        if(level == "Easy"){
            new_points = points + 1;
        }
        else if(level == "Medium"){
            new_points = points + 3;
        }
        else{
            new_points = points + 5;
        }
        setPoints(new_points);

        
        socket.emit('updateGameState', {
            gameOver: checkGameOver(false),
            // winner: checkWinner(player2Deck, 'Player 2'),
            turn: 'Player 1',
            chosenWord: '',
            level:'',
            didchoselevel:false,
            didChoseWord:false,
            finishDrawing:false,
            points:points

            // playedCardsPile: [...playedCardsPile.slice(0, playedCardsPile.length), played_card, ...playedCardsPile.slice(playedCardsPile.length)],
            // player2Deck: [...player2Deck.slice(0, removeIndex), ...player2Deck.slice(removeIndex + 1)],
            // currentColor: colorOfPlayedCard,
            // currentNumber: numberOfPlayedCard
        })


    }


    return(<div>
        {(!roomFull)? <>
        <div>
            <h1>Game Code: {room}</h1>
            <h1>Points: {points}</h1>

        </div>
        {users.length===1 && currentUser === 'Player 2' && <h1 className='topInfoText'>Player 1 has left the game.</h1> }
        {users.length===1 && currentUser === 'Player 1' && <h1 className='topInfoText'>Waiting for Player 2 to join the game.</h1> }
        {users.length===2 &&   <>
        {!didChoseLevel ? 
                <div>
                {/* PLAYER 1 VIEW At Begining*/}
                {currentUser === 'Player 1' && <>
    
                <div>
                    <h1>Please select a level</h1>
                    <button onClick={() => onChoosingLevel("Hard")}>Hard</button>
                    <button onClick={() => onChoosingLevel("Medium")}>Medium</button>
                    <button onClick={() => onChoosingLevel("Easy")}>Easy</button>
    
                </div>
    
                </>}
    
    
                {/* PLAYER 2 VIEW At Begining */}
                {currentUser === 'Player 2' && <>
                <div>
                    <h1> Waiting for the other Player</h1>
                </div>
                
                </>}
    
    
            </div>
    
        
        :
        !didChoseWord?
        <div>
        {/* PLAYER 1 VIEW At Begining*/}
        {currentUser === 'Player 1' && <>

        <div>
            <h1>Please select a word</h1>
            <button onClick={() => onChoosingWord(word1, level)}>{word1}</button>
            <button onClick={() => onChoosingWord(word2, level)}>{word2}</button>
            <button onClick={() => onChoosingWord(word3, level)}>{word3}</button>
        </div>

        </>}


        {/* PLAYER 2 VIEW At Begining */}
        {currentUser === 'Player 2' && <>
        <div>
            <h1> Waiting for the other Player1 </h1>
        </div>
        
        </>}


        </div>

        :
        !finishDrawing?
        <div>
        {/* PLAYER 1 VIEW At Begining*/}

        {currentUser === 'Player 1' && <>
        <Canva />

        <button onClick={()=>onSendingDraw()}>Send</button>
        
        </>}


        {/* PLAYER 2 VIEW At Begining */}
        {currentUser === 'Player 2' && <>
        <div>
            <h1> Waiting for the other Player2 </h1>
        </div>
        
        </>}


        </div>
        :
        <div>
        {/* PLAYER 1 VIEW At Begining*/}

        {currentUser === 'Player 1' && <>
        <div>
            <h1> Waiting for the other Player3 </h1>
        </div>
        
        </>}


        {/* PLAYER 2 VIEW At Begining */}
        {currentUser === 'Player 2' && <>
        <div>
            
            {/*Here is the draw*/}

            <h1> Guess the word! </h1>
            <StreamForm onSubmit={onSuccess} word={chosenWord}/>
        </div>
        
        </>}

        </div>

        }
        </> }
        </> : <h1>Room full</h1>}

        <br />
        <a href='/'><button className="game-button red">QUIT</button></a>

    </div>
    
    );



}



export default Game;
