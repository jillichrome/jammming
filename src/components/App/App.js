import React from 'react';
import './App.css';
import SearchResults from '../SearchResults/SearchResults.js';
import SearchBar from '../SearchBar/SearchBar.js';
import Playlist from '../PlayList/PlayList.js';
import Spotify from '../../util/Spotify.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if(!this.state.playlistTracks.find(playlistTrack => playlistTrack.id === track.id)) {
      this.state.playlistTracks.push(track);
      this.setState({playlistTracks: this.state.playlistTracks});
    }
  }

  removeTrack(track) {
    let newTrack = this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id);
    this.setState({playlistTracks: newTrack});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.length && this.state.playlistName) {
      let trackUris = tracks.map(track => track.uri);
      return Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
        this.setState({
          playlistName: 'New Playlist',
          playlistTracks: []
        });
        document.getElementById('Playlist-name').value = this.state.playlistName;
      });
    }
  }

  search(term) {
    if (term.length > 0) {
      return Spotify.search(term).then(tracks => this.setState({searchResults: tracks}));
    } 
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults = {this.state.searchResults} onAdd = {this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
