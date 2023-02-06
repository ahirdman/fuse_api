export default () => ({
  BASE_URL: 'https://accounts.spotify.com',
  REDIRECT_URI:
    'http://127.0.0.1:5001/fuse-4210a/us-central1/api/token/callback',
  AUTH_SCOPE:
    'user-read-playback-state user-read-playback-position user-read-currently-playing user-read-recently-played user-read-email user-read-private user-modify-playback-state user-follow-modify user-follow-read user-library-modify user-library-read user-top-read streaming playlist-modify-private playlist-read-collaborative playlist-read-private playlist-modify-public',
  CLIENT_URL: 'http://localhost:8000',
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
});

export interface IApplicationConfig {
  BASE_URL: 'https://accounts.spotify.com/';
  REDIRECT_URI: string;
  AUTH_SCOPE: string;
  CLIENT_URL: string;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
}
