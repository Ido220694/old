import React, { useEffect, useRef, useState } from 'react';
//import { ReactDOM } from 'react-dom';

const Canva = (props) => {
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
        context.strokeStyle = props.color
        context.lineWidth = props.size
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

export default Canva;


