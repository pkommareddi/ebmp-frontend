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
    const [emotion, setEmotion] = useState({counter: 0});
    const [showWebcam, setShowWebcam] = useState(false);

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
        setShowWebcam(true);
    }

    useEffect(() => {
        let tracks = JSON.parse(JSON.stringify(topTracks));
        for (let i = 0; i < tracks.length; i++) {
            if (tracks[i].emotion === emotion.mood && !tracks[i].played) {
                setPlayingSong(tracks[i]);
                tracks[i].played = true;
                break;
            }
        }
        setTopTracks(tracks);
    }, [emotion])

    useEffect(() => {
        axios.post('http://localhost:8000/songs', {
            accessToken,
        }).then(res => {
            let tracks = res.data.map(track => {
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
                    emotion: track.mood === "aggressive"? "angry": track.mood === "calm"? "neutral" : track.mood,
                    played: false
                }
            })
            setTopTracks(tracks);
            setShowWebcam(true);
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
            {showWebcam ? <SendVideo setEmotion={setEmotion} setShowWebcam={setShowWebcam} /> : <></>}
        </Container>
    )
}

export default Dashboard