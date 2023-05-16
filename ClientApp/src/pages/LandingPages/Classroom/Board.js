import React from "react"
import {useEffect,useState} from "react"

function Board({ ctx_, color, size, socket, data, canvasData, canvasRef,changeboard,annotate }) {
    // const [updateColor, setUpdateColor] = useState(color);
    // const [updateSize, setUpdateSize] = useState(size);
  // const [whiteBoardAnnotate,setWhiteBoardAnnotate]=useState(annotate)
    let timeOut;
    // var ctx;
    // let socket=io.connect("http://localhost:5000")
    //   useEffect(()=>{
    //      drawOnCanvas()
    //   },[])
    useEffect(() => {
      //  console.log(" use effect call")
      drawOnCanvas();
    }, []);
    // console.log(annotate,"annotate in board useEffect")
    // console.log(conference," conference in  board use effect")
    useEffect(()=>{
      console.log(annotate,"annotate in board useEffect")
      // setWhiteBoardAnnotate(annotate)
    },[annotate])
    useEffect(() => {
      var image = new Image();
      var canvas = document.querySelector("#board");
      var ctx = canvas.getContext("2d");
      image.crossOrigin = "Anonymous";
      image.onload = function () {
        ctx.drawImage(image, 0, 0);
      };
      image.src = canvasData;
    }, [canvasData]);
    const drawOnCanvas = () => {
      var canvas = document.querySelector("#board");
      var sketch = document.querySelector("#sketch");
      var sketch_style = getComputedStyle(sketch);
      canvas.width = parseInt(sketch_style.getPropertyValue("width"));
      canvas.height = parseInt(sketch_style.getPropertyValue("height"));
      var ctx = canvas.getContext("2d");
      var mouse = { x: 0, y: 0 };
      var last_mouse = { x: 0, y: 0 };
      canvas.addEventListener(
        "mousemove",
        function (e) {
          let bounds = sketch.getBoundingClientRect();
          last_mouse.x = mouse.x;
          last_mouse.y = mouse.y;
          //  console.log(last_mouse);
          mouse.x = e.clientX - bounds.left;
          mouse.y = e.clientY - bounds.top;
        },
        false
      );
  
      /* Drawing on Paint App */
      ctx.lineWidth = size;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = color;
      ctx_.current = ctx;
      canvas.addEventListener(
        "mousedown",
        function (e) {
          canvas.addEventListener("mousemove", onPaint, false);
        },
        false
      );
  
      canvas.addEventListener(
        "mouseup",
        function () {
          canvas.removeEventListener("mousemove", onPaint, false);
        },
        false
      );
      // debugger;
      // console.log(timeOut);
      if (timeOut !== undefined) clearTimeout(timeOut);
      var onPaint = function () {
        // debugger;
        if (data.role == 1) {
          ctx.beginPath();
          ctx.moveTo(last_mouse.x, last_mouse.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.closePath();
          ctx.stroke();
          timeOut = setTimeout(() => {
            var base64imageData = canvas.toDataURL("image/png");
            // console.log(base64imageData);
            // debugger;
            socket.emit("canvas-data", { data: base64imageData, room: data?.className });
          }, 1000);
        } 
        else {
          // annotate.muteObj[localStorage.getItem("myId")]=annotate.status;
          if (annotate.muteObj[localStorage.getItem("myId")]) {
            ctx.beginPath();
            ctx.moveTo(last_mouse.x, last_mouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();
            timeOut = setTimeout(() => {
              var base64imageData = canvas.toDataURL("image/png");
              // console.log(base64imageData);
              // debugger;
              socket.emit("canvas-data", { data: base64imageData, room: data?.className });
            }, 1000);
          }
        }
       
      };
    };
  
    const clearCanvas = () => {
     
      const canvas = document.getElementById("board")
      const context = canvas.getContext("2d");
      
context.beginPath();
context.clearRect(0, 0, canvas.width, canvas.height);
var base64imageData = canvas.toDataURL("image/png");
          
            setTimeout(()=>{
            socket.emit("canvas-data", { data: base64imageData, room: data?.className });
          }, 1000)

    };
  
  useEffect(()=>{
    clearCanvas()
    // console.log("in useEffect clear white Board")
  },[changeboard])
  
  
    useEffect(() => {
      ctx_.current.strokeStyle = color;
      ctx_.current.lineWidth = size;
    }, [color, size]);
    return (
      <>
        <div className="sketch" id="sketch">
          <canvas ref={canvasRef} className="board" id="board"></canvas>
        </div>
      </>
    );
  }

  export default Board