import { playlistReducer } from './usePlaylistReducer';
import { Playlist } from './playlistModels';

describe('Playlist reducer', () => {
  const dummyPlaylist: Playlist = [
    { id: 'id1', title: 'title1', artist: 'artist1', url: 'url1' },
    { id: 'id2', title: 'title2', artist: 'artist2', url: 'url2' },
    { id: 'id3', title: 'title3', artist: 'artist3', url: 'url3' },
  ];
  const store = playlistReducer([{ playlist: dummyPlaylist, currentlyPlaying: null }], {
    type: '',
  } as any);

  it('adds a video to the playlist', () => {
    const payload = { id: 'id4', artist: 'artist4', title: 'title4', url: 'url4' };
    const expectedStore = playlistReducer(store, { type: 'ADD_TO_PLAYLIST', payload });
    expect(expectedStore[0].playlist).toEqual([payload, ...dummyPlaylist]);
  });

  it('removes a video to the playlist', () => {
    const expectedStore = playlistReducer(store, { type: 'REMOVE_FROM_PLAYLIST', itemId: 'id2' });
    expect(expectedStore[0].playlist).toEqual([
      { id: 'id1', title: 'title1', artist: 'artist1', url: 'url1' },
      { id: 'id3', title: 'title3', artist: 'artist3', url: 'url3' },
    ]);
  });

  describe('when a user clicks item on the playlist', () => {
    it('plays the video', () => {
      const expectedStore = playlistReducer(store, { type: 'PLAY', itemId: 'id2' });
      expect(expectedStore[0].currentlyPlaying).toBe('id2');
    });

    it('replays the video when user clicks the same video', () => {
      const nextStore_ = playlistReducer(store, { type: 'PLAY', itemId: 'id2' });
      const expectedStore = playlistReducer(nextStore_, { type: 'PLAY', itemId: 'id2' });
      expect(expectedStore[1]).toBe('REPLAY');
    });
  });

  describe('when some video finishes playing', () => {
    it('plays the next video on the playlist', () => {
      const nextStore_ = playlistReducer(store, { type: 'PLAY', itemId: 'id2' });
      const expectedStore = playlistReducer(nextStore_, { type: 'PLAY_NEXT_VIDEO' });
      expect(expectedStore[0].currentlyPlaying).toBe('id3');
    });

    it('jumps to the video on top of the playlist', () => {
      const nextStore_ = playlistReducer(store, { type: 'PLAY', itemId: 'id3' });
      const expectedStore = playlistReducer(nextStore_, { type: 'PLAY_NEXT_VIDEO' });
      expect(expectedStore[0].currentlyPlaying).toBe('id1');
    });

    it('repeats when having only 1 video', () => {
      const expectedStore = playlistReducer(
        [{ playlist: dummyPlaylist.slice(0, 1), currentlyPlaying: 'id1' }],
        {
          type: 'PLAY_NEXT_VIDEO',
        }
      );
      expect(expectedStore[0].currentlyPlaying).toBe('id1');
      expect(expectedStore[1]).toBe('REPLAY');
    });

    it("doesn't do anything when playlist is empty", () => {
      const expectedStore = playlistReducer([{ playlist: [], currentlyPlaying: 'id1' }], {
        type: 'PLAY_NEXT_VIDEO',
      });
      expect(expectedStore[0]).toEqual({ playlist: [], currentlyPlaying: null });
    });
  });
});
