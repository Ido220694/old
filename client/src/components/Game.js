import React, { useEffect, useState, useRef } from 'react';
// import shuffleArray from '../utils/shuffleArray'
import io from 'socket.io-client';
import queryString from 'query-string';
import Canva, {canvasRef} from './Canva';
import Board from './Board';
import StreamForm from './StreamForm';
import contentStyles, { ContentWrap } from './contentStyles';
import './App.css'
import Container from './Container';

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

    
    const [didChoseL, setDidChoseL] = useState(true)
    const [didChoseWord, setDidChoseWord] = useState(true)
    const [finishDrawing, setFinishDrawing] = useState(true)
    const [chosenWord, setChosenWord] = useState('')
    const [draw, setDraw] = useState(null)
    const [word1, setWord1] = useState('')
    const [word2, setWord2] = useState('')
    const [word3, setWord3] = useState('')
    const [level, setLevel] = useState('')
    const [points, setPoints] = useState(0)

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
            didChoseL:false,
            didChoseWord:false,
            finishDrawing:false,
            points:0
        })
    }, [])


    useEffect(() => {
        socket.on('initGameState', ({ gameOver, turn, didChoseL, didChoseWord ,finishDrawing, points}) => {
            setGameOver(gameOver)
            setTurn(turn)
            setDidChoseL(didChoseL)
            setDidChoseWord(didChoseWord)
            setFinishDrawing(finishDrawing)
            setPoints(points)
        })
        
        socket.on('updateGameState', ({ gameOver, turn, chosenWord, level , didChoseL, didChoseWord, finishDrawing, points, draw}) => {
            console.log({ gameOver, turn, chosenWord, level , didChoseL, didChoseWord, finishDrawing, points})
            gameOver && setGameOver(gameOver)
            turn && setTurn(turn)
            chosenWord && setChosenWord(chosenWord)
            level && setLevel(level)
            didChoseL && setDidChoseL(didChoseL)
            didChoseWord && setDidChoseWord(didChoseWord)
            finishDrawing && setFinishDrawing(finishDrawing)
            points && setPoints(points)
            setDraw(draw)
        })
        socket.on('switchPositions', ({ user }) => {

            if(currentUser === user){
                setCurrentUser('Player 2')
            }
            else{
                setCurrentUser('Player 1')
            }
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
            <div className=''>
            {/* <Container/> */}
            <canvas
            onMouseDown={startDraw}
            onMouseUp={endDraw}
            onMouseMove={draw}
            ref={canvasRef}
            />
            <button onClick={()=>onSendingDraw(canvasRef)}>Send</button>

            </div>


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
        // setDidChoseLevel(true);
        socket.emit('updateGameState', {
            gameOver: checkGameOver(false),
            turn: 'Player 1',
            chosenWord: '',
            level:lev,
            didChoseL: true,
            didChoseWord: false,
            finishDrawing: false,
            points:points,
            draw:null

        })



    }

    const onChoosingWord = (word, level) => {
        socket.emit('updateGameState', {
            gameOver: checkGameOver(false),
            turn: 'Player 1',
            chosenWord: word,
            level:level,
            didChoseL:true,
            didChoseWord:true,
            finishDrawing:false,
            points:points,
            draw:null

        })

    }

    const onDrawing = () => {

    }

    const onSendingDraw = (canvasRef) => {
        var canvas1 = canvasRef.current;
        var image = canvas1.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.

        socket.emit('updateGameState', {
            gameOver: checkGameOver(false),
            turn: 'Player 1',
            chosenWord: chosenWord,
            level:level,
            didChoseL:true,
            didChoseWord:true,
            finishDrawing:true,
            points:points,
            draw:image
        })

        

        

    }

    

    //some util functions
    const checkGameOver = (ans) => {
        return ans
        // return arr.length === 1
    }

    const onGameOver = () => {
        if(currentUser === 'Player 2'){
            setCurrentUser('Player 1')
        }
        else{
            setCurrentUser('Player 2')
        }
        setGameOver(false)

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
        console.log(points)
        console.log(currentUser)

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

        socket.emit('initGameState', {
            gameOver: checkGameOver(true),
            turn: 'Player 1',
            didChoseL:false,
            didChoseWord:false,
            finishDrawing:false,
            points:new_points
        })
        console.log("Checking")

    }

    return(
        <ContentWrap>
        <div>
        {(!roomFull)? <>
        <div>
            <h3>Guess and Draw {room}</h3>

            <h3>Game Code: {room}</h3>
            <h3>Points: {points}</h3>

        </div>
        {users.length===1 && currentUser === 'Player 2' && <h1 className='topInfoText'>Player 1 has left the game.</h1> }
        {users.length===1 && currentUser === 'Player 1' && <h1 className='topInfoText'>Waiting for Player 2 to join the game.</h1> }
        {users.length===2 &&   <>
        { gameOver? onGameOver():
            !didChoseL ? 
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
            <h1> Waiting for the other Player </h1>
        </div>
        
        </>}


        </div>

        :
        !finishDrawing?
        <div>
        {/* PLAYER 1 VIEW At Begining*/}

        {currentUser === 'Player 1' && <>
        <div className='Board'>
            <Canva />
        </div>

        
        </>}


        {/* PLAYER 2 VIEW At Begining */}
        {currentUser === 'Player 2' && <>
        <div>
            <h1> Waiting for the other Player </h1>
        </div>
        
        </>}


        </div>
        :
        <div>
        {/* PLAYER 1 VIEW At Begining*/}

        {currentUser === 'Player 1' && <>
        <div>
            <h1> Waiting for the other Player </h1>
        </div>
        
        </>}


        {/* PLAYER 2 VIEW At Begining */}
        {currentUser === 'Player 2' && <>
        <div>
            <div className='picture'>
                <img src ={draw}/>
            </div>

            {/* <h1> Guess the word! </h1> */}
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
    </ContentWrap>);



}



export default Game;
