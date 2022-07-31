import React from 'react';
import { Container } from "react-bootstrap"
import { Typography, Grid, Button, Box } from '@mui/material';
import { Drawer } from '@mui/material';
import { styled } from '@mui/system';

const AUTH_URL = 'https://accounts.spotify.com/authorize?client_id=acca5513fecb49e7bb8fcb5f886b04b7&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-top-read%20playlist-modify-public%20user-follow-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state'

const MyComponent = styled('div')({
  color: 'darkslategray',
  backgroundColor: 'aliceblue',
  padding: 8,
  borderRadius: 4,
});


export default function Login() {
  // return (
  //   <Container
  //     className="d-flex justify-content-center align-items-center"
  //     style={{ minHeight: "100vh" }}
  //   >
  //     <a className="btn btn-success btn-lg" href={AUTH_URL}>
  //       Login With Spotify
  //     </a>
  //   </Container>
  // )
  return (
    <Box>
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '80vh' }}
      >
        {/* <Grid item>
          <img src={Logo} alt="logo" style={{ width: '100%' }} />
        </Grid> */}
        <Grid item>
          <Typography
            variant="h4"
            style={{ textAlign: 'center', fontWeight: 'bold' }}
          >
            Moody Music
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6" style={{ textAlign: 'center' }}>
            Your Most listened Artists and Songs on Spotify.
          </Typography>
        </Grid>
        <Grid item>
          <Button
            size="large"
            variant="outlined"
            href={AUTH_URL}
          >
           Login With Spotify
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}
