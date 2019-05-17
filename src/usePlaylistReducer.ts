import * as React from 'react';
import { Playlist, PlaylistItem, ItemId } from './playlistModels';

interface State {
  playlist: Playlist;
  currentlyPlaying: ItemId | null;
}

type Effects = 'REPLAY';

type StateEffects = [State, Effects?];

type Actions =
  | { type: 'PLAY'; itemId: ItemId }
  | { type: 'PLAY_NEXT_VIDEO' }
  | { type: 'ADD_TO_PLAYLIST'; payload: PlaylistItem }
  | { type: 'REMOVE_FROM_PLAYLIST'; itemId: ItemId } // the item id
  | { type: 'RESET_EFFECT' };

const initialValue: StateEffects = [
  {
    playlist: [],
    currentlyPlaying: null,
  },
];

/**
 * This reducer controls both our playlist state and effects. Interestingly, the effects produced
 * are still pure, meaning it doesn't run any real side-effects (e.g IO). Instead, it only yields
 * some effect description so that the component could handle and react upon it.
 */
export const playlistReducer: React.Reducer<StateEffects, Actions> = ([state, effects], action) => {
  if (action.type === 'PLAY') {
    const nextState = {
      ...state,
      currentlyPlaying: action.itemId,
    };
    // When user clicks the same video as the one currently being played, replay the video from start.
    // Otherwise, just play the clicked video
    const nextEffect = action.itemId === state.currentlyPlaying ? 'REPLAY' : undefined;

    return [nextState, nextEffect];
  }

  if (action.type === 'PLAY_NEXT_VIDEO') {
    // We don't play the next video when playlist is empty. It's just impossible.
    if (!state.playlist.length) return [{ ...state, currentlyPlaying: null }];

    const currIndex = state.playlist.findIndex(p => p.id === state.currentlyPlaying);
    // Play next video when not in bottom, otheriwse start from the top again
    const nextIndex = currIndex === state.playlist.length - 1 ? 0 : currIndex + 1;
    const nextItemId = state.playlist[nextIndex].id;

    if (state.playlist.length === 1) {
      return playlistReducer([state], { type: 'PLAY', itemId: nextItemId });
    }

    return [
      {
        ...state,
        currentlyPlaying: nextItemId,
      },
    ];
  }

  if (action.type === 'ADD_TO_PLAYLIST') {
    return [
      {
        ...state,
        playlist: [action.payload, ...state.playlist],
      },
    ];
  }

  if (action.type === 'REMOVE_FROM_PLAYLIST') {
    const nextStateEffects: StateEffects = [
      {
        ...state,
        playlist: state.playlist.filter(x => x.id !== action.itemId),
      },
    ];

    // When user removes the currently-playing item from playlist,
    // remove the video then play the next video
    if (state.currentlyPlaying === action.itemId) {
      return playlistReducer(nextStateEffects, { type: 'PLAY_NEXT_VIDEO' });
    }
    return nextStateEffects;
  }

  if (action.type === 'RESET_EFFECT') {
    return [state];
  }

  return [state, effects];
};

const usePlaylistReducer = () => {
  const [stateAndEffects, dispatch] = React.useReducer(playlistReducer, initialValue);
  const play = (itemId: ItemId) => dispatch({ type: 'PLAY', itemId });
  const playNext = () => dispatch({ type: 'PLAY_NEXT_VIDEO' });
  const addToPlaylist = (payload: PlaylistItem) => dispatch({ type: 'ADD_TO_PLAYLIST', payload });
  const removeFromPlaylist = (itemId: ItemId) => dispatch({ type: 'REMOVE_FROM_PLAYLIST', itemId });
  const resetEffect = () => dispatch({ type: 'RESET_EFFECT' });

  return [
    stateAndEffects,
    {
      play,
      playNext,
      addToPlaylist,
      removeFromPlaylist,
      resetEffect,
    },
  ] as const;
};

export default usePlaylistReducer;
