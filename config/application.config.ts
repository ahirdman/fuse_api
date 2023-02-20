export default () => ({
  SPOTIFY_BASE_URL: process.env.SPOTIFY_BASE_URL,
  SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
  SPOTIFY_AUTH_SCOPE:
    'user-read-playback-state user-read-playback-position user-read-currently-playing user-read-recently-played user-read-email user-read-private user-modify-playback-state user-follow-modify user-follow-read user-library-modify user-library-read user-top-read streaming playlist-modify-private playlist-read-collaborative playlist-read-private playlist-modify-public',
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  CLIENT_BASE_URL: process.env.CLIENT_BASE_URL,
});

export interface IApplicationConfig {
  SPOTIFY_BASE_URL: 'https://accounts.spotify.com/';
  SPOTIFY_REDIRECT_URI: string;
  SPOTIFY_AUTH_SCOPE: string;
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
  CLIENT_BASE_URL: string;
}
