import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import * as Promise from 'bluebird'
import { Card, CardBody, CardTitle, CardSubtitle, Col, Container, Navbar, NavbarBrand, Row } from 'reactstrap';
import uuidv4 from 'uuid'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      book: {},
      characters: []
    };
  }

  async componentDidMount() {
    try {
      const results = await axios.get('https://www.anapioficeandfire.com/api/books/1')
      const book = results.data
      this.setState({book: results.data})
      Promise.map(book.characters, function(character) {
        const results = axios.get(character)
        .then((result) => {
          return result.data
        })
        return results
      }, {concurrency: 20})
      .then((newresult) => {
        this.setState({characters: newresult})
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <div className="App">
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">A Song of Ice and Fire, Book 1, Characters</NavbarBrand>
        </Navbar>
        <Container style={{marginTop: "15px"}}>
          <Row>
            { this.state.characters.length
              ? (
                this.state.characters.map((character) => {
                  return  (
                    <Col xs="4" key={character.url} style={{marginBottom: "15px"}}>
                      <Card>
                        <CardBody>
                          <CardTitle>{character.name}</CardTitle>
                          <CardSubtitle>{character.titles.map(title => <React.Fragment key={uuidv4()}>{title}<br/></React.Fragment>)}</CardSubtitle>
                        </CardBody>
                      </Card>
                    </Col>
                  )
                }
              )
            ) : (
              'Loading...'
            )
          }
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
