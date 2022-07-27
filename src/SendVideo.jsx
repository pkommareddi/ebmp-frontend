import React, { useEffect, useState, useRef } from 'react';
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as blazemodel from "@tensorflow-models/blazeface";


function SendVideo() {

    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const runBlazeFace = async (ws) => {
        const model = await blazemodel.load();
        setInterval(async () => {

            if (
                typeof webcamRef.current !== "undefined" &&
                webcamRef.current !== null &&
                webcamRef.current.video.readyState === 4 && model) {
                // Get Video Properties
                const video = webcamRef.current.video;
                const videoWidth = webcamRef.current.video.videoWidth;
                const videoHeight = webcamRef.current.video.videoHeight;

                // Set video width
                webcamRef.current.video.width = videoWidth;
                webcamRef.current.video.height = videoHeight;

                // Set canvas height and width
                canvasRef.current.width = videoWidth;
                canvasRef.current.height = videoHeight;

                console.log("hello")
                const ctx = canvasRef.current.getContext("2d");
                ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
                let type = "image/png"
                let data = canvasRef.current.toDataURL(type);
                data = data.replace('data:' + type + ';base64,', ''); //split off junk at the beginning
                
                data = data + "$$$$"
                const predictions = await model.estimateFaces(video, false);
                if(predictions.length != 0) {
                    const start = predictions[0].topLeft.map(Math.floor);
                    const end = predictions[0].bottomRight.map(Math.floor);
                    const size = [end[0] - start[0] + 20, end[1] - start[1] + 60];
                    data = data + (start[0] - 20) + "," + (start[1] - 40) + "," + (size[0]) + "," + (size[1])
                }
                console.log(data)
                ws.send(data)
            }

        }, 5000)
    }


    useEffect(() => {
        var ws = new WebSocket("ws://127.0.0.1:8000/ws");
        ws.onopen = () => {
            // on connecting, do nothing but log it to the console
            console.log('connected')
        }
        ws.onmessage = evt => {
            // listen to data sent from the websocket server
            const image_id = document.getElementById('image');
            image_id.src = evt.data;
            // console.log(evt.data)
        }

        ws.onclose = () => {
            console.log('disconnected')
            // automatically try to reconnect on connection loss

        }
        runBlazeFace(ws)

    }, [])

    return (
        <div>
            <Webcam
                ref={webcamRef}
                muted={true}
                style={{
                    // position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zindex: 9,
                    width: 640,
                    height: 480,
                    // display: "none"
                }}
            />

            <canvas
                ref={canvasRef}
                style={{
                    // position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zindex: 8,
                    width: 640,
                    height: 480,
                    display: "none"
                }}
            />
            {/* <canvas id="canvasOutput" height={480} width={640}></canvas> */}
            <img id="image" alt=""></img>
        </div>
    );
}


export default SendVideo;
