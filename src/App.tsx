import * as React from 'react';
import {
  createStyles,
  withStyles,
  AppBar,
  Grid,
  Theme,
  Toolbar,
  Typography,
  WithStyles,
} from '@material-ui/core';
import AddToPlaylistForm from './AddToPlaylistForm';
import Playlist from './Playlist';
import usePlaylistReducer from './usePlaylistReducer';

const App: React.FC<WithStyles<typeof styles>> = ({ classes }) => {
  const [[state, effects], actions] = usePlaylistReducer();
  const videoElem = React.useRef<HTMLVideoElement | null>(null);

  // Effects run when switching items/videos
  React.useEffect(() => {
    if (!videoElem.current) return;

    if (state.currentlyPlaying !== null) {
      videoElem.current.play();
    } else {
      videoElem.current.load();
    }
  }, [state.currentlyPlaying]);

  // Our "reducer side-effects" are handled here
  React.useEffect(() => {
    if (!videoElem.current) return;
    if (effects === 'REPLAY') {
      videoElem.current.currentTime = 0;
      videoElem.current.play(); // force play
    }
    return actions.resetEffect;
  }, [effects]);

  const currentPlayingUrl = state.playlist.find(i => i.id === state.currentlyPlaying);

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Playlist App
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid container spacing={16}>
        <Grid item sm={8} xs={12}>
          <Grid item>
            <video
              ref={ref => {
                videoElem.current = ref;
              }}
              src={currentPlayingUrl && currentPlayingUrl.url}
              controls
              className={classes.video}
              width="100%"
              onEnded={actions.playNext}
            />
          </Grid>
          <Grid item>
            <AddToPlaylistForm onSubmit={actions.addToPlaylist} />
          </Grid>
        </Grid>
        <Grid item sm={4} xs={12}>
          <Playlist
            items={state.playlist}
            currentlyPlaying={state.currentlyPlaying}
            onPlay={actions.play}
            onRemove={actions.removeFromPlaylist}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    '@global': {
      body: {
        margin: '0 auto',
        padding: `0 ${theme.spacing.unit * 3}px`,
        maxWidth: theme.breakpoints.values.md,
        background: theme.palette.grey[900],
        color: 'white',
      },
    },
    root: {
      flexGrow: 1,
    },
    appBar: {
      marginBottom: theme.spacing.unit * 2,
      background: theme.palette.grey[800],
    },
    video: {
      marginBottom: theme.spacing.unit * 2,
    },
  });

export default withStyles(styles)(App);
