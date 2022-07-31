import React from 'react';
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
import { millisToMinutesAndSeconds } from './utils';


export default function TrackResult({ track, chooseTrack }) {

  function handlePlay() {
    chooseTrack(track)
  }

  return (
    // <div
    //   className="d-flex m-2 align-items-center"
    //   style={{ cursor: "pointer" }}
    //   onClick={handlePlay}
    // >
    //   <img src={track.albumUrl} style={{ height: "64px", width: "64px" }} />
    //   <div className="ml-3">
    //     <div>{track.title}</div>
    //     <div className="text-muted">{track.artist}</div>
    //   </div>
    // </div>
    <Box key={track.id}>
      <ListItem
        alignItems="flex-start"
        button
        onClick={handlePlay}
      >
        <ListItemAvatar>
          <Avatar
            alt="Remy Sharp"
            src={track.albumUrl}
          />
        </ListItemAvatar>
        <ListItemText
          primary={track.name}
          secondary={
            <React.Fragment>
              {track.artist} · {track.album}
            </React.Fragment>
          }
        />
        <ListItemSecondaryAction>
          {millisToMinutesAndSeconds(track.duration_ms)}
        </ListItemSecondaryAction>
      </ListItem>
      
    </Box>
  )

}