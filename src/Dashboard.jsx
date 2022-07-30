import React from 'react'
import useAuth from './useAuth'
import { useState, useEffect } from 'react'
import axios from "axios"
import TrackResult from './TrackResult'
import Player from './Player'
import SendVideo from './SendVideo'

import { Container } from "react-bootstrap"

function Dashboard({ code }) {
    const accessToken = useAuth(code);
    const [topTracks, setTopTracks] = useState([])
    const [playingSong, setPlayingSong] = useState();
    const [emotionHistory, setEmotionHistory] = useState([]);
    const [showWebcam, setShowWebcam] = useState(true);

    function chooseTrack(track) {
        setPlayingSong(track);
        let tracks = JSON.parse(JSON.stringify(topTracks));
        for (let i = 0; i < tracks.length; i++) {
            if (tracks[i].uri === track.uri) {
                tracks[i].played = true;
                break
            }
        }
        setTopTracks(tracks);
        setShowWebcam(false);
    }

    function fetchNextTrack() {
        console.log("Should Set Next Track")
        setShowWebcam(true);
        setTimeout(() => {
            setShowWebcam(false);
            let emotion = "Happy";
            let tracks = JSON.parse(JSON.stringify(topTracks));
            for (let i = 0; i < tracks.length; i++) {
                if (tracks[i].emotion === emotion && !tracks[i].played) {
                    setPlayingSong(tracks[i]);
                    console.log("Song Set")
                    tracks[i].played = true;
                    break;
                }
            }
            setTopTracks(tracks)
        }, 15000)
    }

    useEffect(() => {
        axios.post('http://localhost:8000/songs', {
            accessToken,
        }).then(res => {
            setTopTracks(
                res.data.map(track => {
                    const smallImage = track.album.images.reduce(
                        (smallest, image) => {
                            if (image.height < smallest.height) return image
                            return smallest
                        },
                        track.album.images[0]
                    )
                    return {
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        albumUrl: smallImage.url,
                        emotion: track.mood,
                        played: false
                    }
                })
            )
        })

    }, [accessToken]);

    return (
        <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
            <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
                {topTracks.map(track => (
                    <TrackResult
                        track={track}
                        key={track.uri}
                        chooseTrack={chooseTrack}
                    />
                ))}
            </div>
            <div>
                <Player accessToken={accessToken} songUri={playingSong?.uri} fetchNextTrack={fetchNextTrack} />
            </div>
            {showWebcam ? <SendVideo setEmotionHistory={setEmotionHistory} /> : <></>}
            {/* <button onClick={() => setShowWebcam(!showWebcam)}>Capture photo</button> */}
        </Container>
    )
}

export default Dashboard