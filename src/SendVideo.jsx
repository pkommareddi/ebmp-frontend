import React, { useEffect, useState, useRef } from 'react';
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as blazemodel from "@tensorflow-models/blazeface";


function SendVideo({ setEmotionHistory }) {

    const webcamRef = useRef(null);

    const runBlazeFace = async (ws) => {
        const model = await blazemodel.load();
        setInterval(async () => {

            if (
                typeof webcamRef.current !== "undefined" &&
                webcamRef.current !== null &&
                webcamRef.current.video.readyState === 4 && model) {
                // Get Video Properties
                const video = webcamRef.current.video;

                let type = "image/png";
                let data = webcamRef.current.getScreenshot();
                data = data.replace('data:' + type + ';base64,', '');

                data = data + "$$$$"
                const predictions = await model.estimateFaces(video, false);
                if (predictions.length != 0) {
                    const start = predictions[0].topLeft.map(Math.floor);
                    const end = predictions[0].bottomRight.map(Math.floor);
                    const size = [end[0] - start[0] + 20, end[1] - start[1] + 60];
                    data = data + (start[0] - 20) + "," + (start[1] - 40) + "," + (size[0]) + "," + (size[1]);
                }
                ws.send(data)
            }
        }, 1000)
    }


    useEffect(() => {
        var ws = new WebSocket("ws://127.0.0.1:8000/ws");
        ws.onopen = () => {
            // on connecting, do nothing but log it to the console
            console.log('WS Connection Opened')
        }
        ws.onmessage = evt => {
            // listen to data sent from the websocket server
            // const image_id = document.getElementById('image');
            // image_id.src = evt.data;
            setEmotionHistory(evt.data);
            console.log(evt.data);
        }

        // ws.onclose = () => {
        //     console.log('disconnected')
        //     // automatically try to reconnect on connection loss
        // }

        runBlazeFace(ws);

        return () => {
            ws.close();
            console.log('WS Connection Terminated');
        }
    }, [])

    return (
        <div>
            <Webcam
                ref={webcamRef}
                forceScreenshotSourceSize={true}
                screenshotFormat="image/png"
                muted={true}
                style={{
                    // position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zindex: 9,
                    width: 0,
                    height: 0,
                    // display: "none"
                }}
            />

            {/* <img id="image" alt=""></img> */}
        </div>
    );
}


export default SendVideo;
