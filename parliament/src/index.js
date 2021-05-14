import React from 'react';
import ReactDOM from 'react-dom';
import './styling.css';

class LandingPage extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <Header/>
        <br/>
        <Button text="House of Commons"/>
        <br/>
        <Search/>
      </div>
    )
  }
}

class Header extends React.Component {
  render() {
    const mystyle = {
      position: "absolute",
      textAlign: 'center',
      fontWeight: 'bold',
      top: 0,
      right: 0,
      left: 0,
      margin: 0,
      padding: 0,
      color: "white",
      backgroundColor: "SlateBlue",
      padding: "10px"
    };
    return <h1 style={mystyle}>UK Parliament: Who Represents Me?</h1>;
  }
}

class Search extends React.Component {
  render() {
    const mystyle = {
      textAlign: "center",
      width: "100%"
    };
    return (
      <form>
        <input style={mystyle} type="text"/>
      </form>
    );
  }
}

class Button extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <button type="button">{this.props.text}</button>;
  }
}

ReactDOM.render(<LandingPage/>, document.getElementById('root'));



// const myelement = <h1>React is {5 + 5} times better with JSX</h1>;
// ReactDOM.render(myelement, document.getElementById('root'));
