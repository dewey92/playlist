export type ItemId = string;

export interface PlaylistItem {
  id: ItemId;
  title: string;
  artist: string;
  url: string;
}

export type Playlist = PlaylistItem[];
