import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import * as Promise from 'bluebird'
import { Button, Card, CardText, CardTitle, Col, Container, Navbar, NavbarBrand, Row } from 'reactstrap';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      book: {},
      characters: []
    };
  }

  getCharacters() {
    let characters = [];
    Promise.map(this.state.book.characters, function(charcterurl) {
      axios.get(charcterurl)
      .then(res => {
        characters.push(res.data);
        return res.data
      })
    }, {concurrency: 5})
    .then(function() {
      console.log(characters)
      this.setState({characters: characters})
    })
  }

  // displayCharacters() {
  //   return (
  //     <Card body>
  //       <CardTitle>{this.state.character.name}</CardTitle>
  //       <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
  //       <Button>Go somewhere</Button>
  //     </Card>
  //   )
  // }

  async componentDidMount() {
    axios.get('https://www.anapioficeandfire.com/api/books/1')
    .then(res => {
      const book = res.data;
      this.setState({ book }, this.getCharacters);
    })
  }

  render() {
    return (
      <div className="App">
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">A Song of Ice and Fire, Book 1, Characters</NavbarBrand>
        </Navbar>
        <Container style={{marginTop: "15px"}}>
          <Row>
            <Col xs="3">
            { this.state.characters.length ? 'Characters' : 'No Characters Loaded' }
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
