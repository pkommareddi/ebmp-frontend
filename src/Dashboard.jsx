import React from 'react'
import useAuth from './useAuth'
import { useState, useEffect } from 'react'
import axios from "axios"
import TrackResult from './TrackResult'
import Player from './Player'
import SendVideo from './SendVideo'

import { Container, Form } from "react-bootstrap"

function Dashboard({ code }) {
    const accessToken = useAuth(code);
    const [topTracks, setTopTracks] = useState([])
    const [playingSong, setPlayingSong] = useState()

    function chooseTrack(track) {
        setPlayingSong(track)
    }

    // console.log(playingSong?.uri)

    useEffect(() => {
        axios.post('http://localhost:8000/songs', {
            accessToken,
        }).then(res => {
            console.log(res.data)
            setTopTracks(
                res.data.map(track => {
                    // let track = item.track
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
                    }
                })
            )
            // setTopTracks(res.data.map(track => {
            //     const smallImage = track.album.images.reduce(
            //         (smallest, image) => {
            //             if (image.height < smallest.height) return image
            //             return smallest
            //         },
            //         track.album.images[0]
            //     )
            //     return {
            //         artist: track.artists[0].name,
            //         title: track.name,
            //         uri: track.uri,
            //         albumUrl: smallImage.url,
            //     }

            // }))
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
                <Player accessToken={accessToken} songUri={playingSong?.uri} />
            </div>
            <SendVideo />
        </Container>
    )
}

export default Dashboard