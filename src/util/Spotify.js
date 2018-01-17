const clientId = 'b37710005763429e8938d79862f8084b';
const redirectUri = 'http://localhost:3000';
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    let url = window.location.href
    const urlAccessToken = url.match(/access_token=([^&]*)/);
    const urlExpiresIn = url.match(/expires_in=([^&]*)/);
    if (urlAccessToken && urlExpiresIn) {
      accessToken = urlAccessToken[1];
      let expiresIn = Number(urlExpiresIn[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
    }
  },

  search(term) {
    accessToken = Spotify.getAccessToken();

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term.replace(' ', '%20')}`, {headers: {'Authorization': `Bearer ${accessToken}`}})
      .then(response => response.json())
      .then(jsonResponse => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }
        })
      });
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris) return;

    accessToken = Spotify.getAccessToken();
    let headers = {'Authorization': `Bearer ${accessToken}`};
    let userId

    return fetch('https://api.spotify.com/v1/me', { headers: headers})
    .then(response => response.json())
    .then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            name: name
          })
        })
        .then(response => response.json())
        .then(jsonResponse => {
          const playlistId = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({uris: trackUris})
          });
        })
    })
  }
};

export default Spotify;
