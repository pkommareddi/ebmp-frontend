import { time } from "@tensorflow/tfjs"
import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"

export default function Player({ accessToken, songUri, fetchNextTrack }) {
    const [play, setPlay] = useState(false)
    const [timeoutID, setTimeOutID] = useState(undefined)

    useEffect(() => setPlay(true), [songUri])

    if (!accessToken) return null
    return (
        <SpotifyPlayer
            token={accessToken}
            showSaveIcon
            callback={state => {
                if (!state.isPlaying) setPlay(false);
                else {
                    if (typeof timeoutID === 'number') clearTimeout(timeoutID);
                    console.log(state.track.durationMs - state.progressMs - 15000)
                    setTimeOutID(setTimeout(() => fetchNextTrack(), state.track.durationMs - state.progressMs - 15000));
                }
            }}
            play={play}
            uris={songUri ? [songUri] : []}
            styles={{
                activeColor: '#fff',
                bgColor: '#333',
                color: '#fff',
                loaderColor: '#fff',
                sliderColor: '#1cb954',
                trackArtistColor: '#ccc',
                trackNameColor: '#fff',
            }}
        />
    )
}
