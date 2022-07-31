import React from 'react'
import useAuth from './useAuth'
import { useState, useEffect } from 'react'
import axios from "axios"
import TrackResult from './TrackResult'
import Player from './Player'
import SendVideo from './SendVideo'

// import { Container } from "react-bootstrap"

import {
    Container,
    Typography,
    Avatar,
    Box,
    List,
    Divider,
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListSubheader,
    ListItemSecondaryAction,
    Tabs,
    Tab,
    Grid,
    Button,
    Hidden,
  } from '@material-ui/core';
  import { makeStyles } from '@material-ui/core/styles';

  const useStyles = makeStyles(theme => ({
    list: {
      width: '100%',
    },
    header: {
      marginBottom: theme.spacing(1),
    },
    title: {
      fontWeight: 'bold',
    },
    tabs: {
      backgroundColor: theme.palette.action.active,
    },
    buttons: {
      marginTop: theme.spacing(3),
    },
    listSubHeaderRoot: {
      backgroundColor: '#E5E5E5',
      color: '#252525'
      /* To change the font, use the fontFamily rule */
    }
  }));

function Dashboard({ code }) {
    const classes = useStyles();
    const accessToken = useAuth(code);
    const [topTracks, setTopTracks] = useState([])
    const [playingSong, setPlayingSong] = useState();
    const [emotion, setEmotion] = useState();
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
        let emotion = 'Happy' 
        setShowWebcam(true);
        setTimeout(() => {
            setShowWebcam(false);
            let tracks = JSON.parse(JSON.stringify(topTracks));
            for (let i = 0; i < tracks.length; i++) {
                if (tracks[i].mood === emotion && !tracks[i].played) {
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
                    mood: track.mood,
                    played: false,
                    name: track.name,
                    album: track.album.name,
                    id: track.id,
                    duration_ms: track.duration_ms
                }
            });
            // console.log(tracks);
            // const interval = setInterval(() => {
            //     if (emotion) {
            //         setShowWebcam(false);
            //         for (let i = 0; i < tracks.length; i++) {
            //             if (tracks[i].mood === emotion && !tracks[i].played) {
            //                 setPlayingSong(tracks[i]);
            //                 tracks[i].played = true;
            //                 break;
            //             }
            //         }
            //         clearInterval(interval);
            //     }
            //     else console.log("Emotion not yet detected");
            // }, 5000);

            setTopTracks(tracks);
        })

    }, [accessToken]);

    useEffect(() => {
        console.log(emotion)
    }, [emotion])

    return (
        // <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
        //     <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        //         {topTracks.map(track => (
        //             <TrackResult
        //                 track={track}
        //                 key={track.uri}
        //                 chooseTrack={chooseTrack}
        //             />
        //         ))}
        //     </div>
        //     <div>
        //         <Player accessToken={accessToken} songUri={playingSong?.uri} fetchNextTrack={fetchNextTrack} />
        //     </div>
        //     {showWebcam ? <SendVideo setEmotion={setEmotion} /> : <></>}
        //     {/* <button onClick={() => setShowWebcam(!showWebcam)}>Capture photo</button> */}
        // </Container>
        <React.Fragment>

        <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
  
          <Box className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
  
            <Grid container spacing={2} direction="row" alignItems="flex-start" justify="space-between" >
              <Grid item xs={3}>
                <div>
                  <Box style={{ padding: 10, textAlign: 'center' }}>
                    <img
                      alt="logo"
  
                      style={{ width: '40%' }}
                    />
                  </Box>
                  {/* <div className={classes.toolbar} /> */}
                  <Divider />
  
                  <List
                    sx={{
                      width: '100%',
                      maxWidth: 360,
                      bgcolor: 'background.paper',
                      position: 'relative',
                      overflow: 'auto',
                      maxHeight: 300,
                      '& ul': { padding: 0 },
                    }}
                    subheader={<li />}
                  >
                    {['Happy', 'Sad', 'Calm', 'Angry'].map((mood) => (
  
                      <li key={`section-${mood}`}>
                        <ul ul class="list-group">
                          <ListSubheader >
                            <div>
                              <Typography variant="h4" style={{ color: 'white' }} >
                                {mood}
                              </Typography>
                            </div>
                          </ListSubheader>
                          <Divider color='red'></Divider>
                          {topTracks.map((item, idx) => {
                            if (item.mood !== mood) {
                              return
                            }
                            return (
                              <ListItem key={`item-${mood}-${item}`}>
                                <ListItemText primary={`${item.name}`} primaryTypographyProps={{
                                  fontSize: 20,
                                  fontWeight: 'medium',
                                  lineHeight: '20px',
                                  mb: '2px',
                                }} />
                              </ListItem>
                            )
                          })}
  
                        </ul>
                      </li>
                    ))}
                  </List>
                </div>
  
              </Grid>
              <Grid item xs={9}>
                <div>
                  <Typography variant="h4" className={classes.title}>
                    All Songs
                  </Typography>
                </div>
                <List className={classes.list}>
                  {topTracks.map((track, idx) => {
                    return (
                      <TrackResult
                      track={track}
                      key={track.uri}
                      chooseTrack={chooseTrack}
                    />
                    );
                  })}
                </List>
  
              </Grid>
            </Grid>
            
           
          </Box>
          <div>
            <Player  accessToken={accessToken} songUri={playingSong?.uri} />
          </div>
        </Container>
      </React.Fragment>
    )
}

export default Dashboard