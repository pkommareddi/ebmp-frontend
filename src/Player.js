import { useState, useEffect } from "react"
import SpotifyPlayer from "react-spotify-web-playback"

export default function Player({ accessToken, songUri }) {
  const [play, setPlay] = useState(false)

  console.log(songUri)
  useEffect(() => setPlay(true), [songUri])

  if (!accessToken) return null
  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={state => {
        if (!state.isPlaying) setPlay(false)
      }}
      play={play}
      uris={songUri ? [songUri] : []}
    />
  )
}
