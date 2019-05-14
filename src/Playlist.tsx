import * as React from 'react';
import {
  createStyles,
  withStyles,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Theme,
  WithStyles,
} from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Cancel';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import cx from 'classnames';
import { Playlist, ItemId } from './playlistModels';

interface Props {
  items: Playlist;
  onPlay: (itemId: ItemId) => void;
  onRemove: (itemId: ItemId) => void;
  currentlyPlaying: ItemId | null;
}

const Playlist: React.FC<Props & WithStyles<typeof styles>> = ({
  items,
  currentlyPlaying,
  onPlay,
  onRemove,
  classes,
}) => {
  return (
    <List>
      {items.map(item => (
        <ListItem
          button
          onClick={() => onPlay(item.id)}
          className={cx({
            [classes.list]: true,
            [classes.listActive]: currentlyPlaying === item.id,
          })}
          key={item.id}
        >
          <ListItemAvatar>
            <PlayIcon />
          </ListItemAvatar>
          <ListItemText primary={item.title} secondary={item.artist} />
          <ListItemSecondaryAction>
            <IconButton onClick={() => onRemove(item.id)}>
              <RemoveIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    list: {
      '&:hover': {
        background: theme.palette.grey[700],
      },
    },
    listActive: {
      background: theme.palette.grey[800],
    },
  });

export default withStyles(styles)(Playlist);
