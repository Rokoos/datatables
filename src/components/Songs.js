import React from "react";
import { Container, Modal, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import Spinner from "./Spinner";
import $ from "jquery";
window.jQuery = $;
// import DataTable from "datatables.net";
import "datatables.net-dt";
export default class Songs extends React.Component {
  state = {
    loading: false,
    songs: [],
    showDetails: false,
    selectedSong: {},
  };

  componentDidMount() {
    this.fetchSongs();
  }

  fetchSongs = () => {
    this.setState({ loading: true });
    axios
      .get("https://itunes.apple.com/us/rss/topsongs/limit=50/json")
      .then((res) => {
        //console.log(res.data.feed.entry);
        let data = res.data.feed.entry;

        let songs = [];
        let song = {};
        let months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        for (let i = 0; i < data.length; i++) {
          let relDate = data[i]["im:releaseDate"]
            ? new Date(data[i]["im:releaseDate"].label)
            : undefined;

          if (relDate !== undefined) {
            let day = relDate.getDate();
            let month = relDate.getMonth();
            let year = relDate.getFullYear();
            relDate = day + " " + months[month] + " " + year;
          } else {
            relDate = "data not available";
          }
          song = {
            picture: data[i]["im:image"][2].label,
            singer: data[i]["im:artist"].label,
            songTitle: data[i]["im:name"].label,
            price: data[i]["im:price"].label,
            category: data[i].category.attributes.label,
            relDate,
            producer: data[i].rights.label,
          };
          songs.push(song);
        }
        //console.log(canzoni);
        this.setState({
          songs,
          loading: false,
        });

        $("#tab").DataTable();
      })
      .catch((error) => {
        console.log(error);
        this.state({ loading: false });
      });
  };

  songDetails = (song) => {
    this.setState({ showDetails: true, selectedSong: song });
  };
  render() {
    if (this.state.loading) {
      return <Spinner />;
    }
    return (
      <Container align="center">
        <Modal
          show={this.state.showDetails}
          animation={true}
          onHide={() => this.setState({ showDetails: false })}
        >
          <Modal.Header>
            <Col>
              <h1>{this.state.selectedSong.songTitle} </h1>
            </Col>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col align="center">
                <img
                  src={this.state.selectedSong.picture}
                  alt="cover"
                  width="160"
                  height="160"
                />
              </Col>
            </Row>
            <Row>
              <Col align="center">{this.state.selectedSong.singer}</Col>
            </Row>
            <Row>
              <Col align="center">{this.state.selectedSong.producer}</Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => this.setState({ showDetails: false })}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="mt-5 mb-5">
          <span className="song_title">Song List</span>
          <hr />
          <table id="tab" className="mt-3">
            <thead>
              <tr>
                <th className="text-center">Cover</th>
                <th className="text-center">Singer</th>
                <th className="text-center">Song</th>
                <th className="text-center">Price</th>
                <th className="text-center">Category</th>
                <th className="text-center">Release Date</th>
              </tr>
            </thead>
            <tbody>
              {this.state.songs.map((item, index) => (
                <tr onClick={() => this.songDetails(item)} key={index}>
                  <td>
                    <img
                      src={item.picture}
                      alt="cover"
                      width="100"
                      height="100"
                    />
                  </td>
                  <td>{item.singer}</td>
                  <td>{item.songTitle}</td>
                  <td>{item.price}</td>
                  <td>{item.category}</td>
                  <td>{item.relDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    );
  }
}
