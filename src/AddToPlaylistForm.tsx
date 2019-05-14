import * as React from 'react';
import { createStyles, withStyles, Button, TextField, Theme, WithStyles } from '@material-ui/core';
import { PlaylistItem } from './playlistModels';

interface Props {
  onSubmit: (values: PlaylistItem) => void;
}

const AddToPlaylistForm: React.FC<Props & WithStyles<typeof styles>> = props => {
  const [title, setTitle] = React.useState('');
  const [artist, setArtist] = React.useState('');
  const [url, setUrl] = React.useState('');

  const onSubmit = e => {
    e.preventDefault();

    // Normally handled in the backend. We can also use `uuid`
    // but for simplicity let's just use `Date.getTime`
    const id = new Date().getTime().toString();
    props.onSubmit({ id, title, artist, url });

    // reset all values
    setTitle('');
    setArtist('');
    setUrl('');
  };

  return (
    <form onSubmit={onSubmit} className={props.classes.form}>
      <TextField label="Title" required value={title} onChange={e => setTitle(e.target.value)} />
      <TextField label="Artist" required value={artist} onChange={e => setArtist(e.target.value)} />
      <TextField label="URL" required value={url} onChange={e => setUrl(e.target.value)} />
      <Button variant="contained" color="secondary" type="submit">
        Add to Playlist
      </Button>
    </form>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    form: {
      display: 'flex',
      flexDirection: 'column',
      '& > *': {
        margin: `${theme.spacing.unit}px 0`,
      },
    },
  });

export default withStyles(styles)(AddToPlaylistForm);
