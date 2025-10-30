export default function handler(req, res) {
  const crypto = require('crypto');
  const querystring = require('querystring');
  
  const state = crypto.randomBytes(16).toString('hex');
  
  res.setHeader('Set-Cookie', `oauth_state=${state}; HttpOnly; Max-Age=600; SameSite=Lax`);
  
  const params = querystring.stringify({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    state: state,
    scope: 'playlist-modify-public playlist-read-private',
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params}`);
}
