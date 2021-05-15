import React from 'react';
import ReactDOM from 'react-dom';
import './styling.css';
import 'font-awesome/css/font-awesome.min.css';

class LandingPage extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Header/>
        </div>
        <div>
          <Buttons/>
          <Search/>
        </div>
        <Footer/>
      </div>
    )
  }
}

class Header extends React.Component {
  render() {
    return <h1 className="header">UK Parliament: Who Represents Me?</h1>;
  }
}

class Footer extends React.Component {
  render() {
    return (
      <div className="footer">
        <p>Parliamentary information licensed under the <a href="https://www.parliament.uk/site-information/copyright-parliament/open-parliament-licence/">Open Parliament License v3.0</a>.</p>
      </div>
    );
  }
}

class Search extends React.Component {
  render() {
    const mystyle = {
      textAlign: "center",
      width: "95%"
    };
    return (
      <div className="search-container">
        <form>
          <input style={mystyle} type="text" placeholder="Search..."/>
          <button type="submit"><i className="fa fa-search"></i></button>
        </form>
      </div>
    );
  }
}

class Button extends React.Component {
  constructor(props) {
    super(props);
  }
  select(type){
    console.log(type);
  }
  render() {
    const mystyle = {
      textAlign: "center",
      backgroundColor: this.props.background,
      color: "White",
      display: "block",
      border: "none",
      width: "25%",
      padding: "1em",
      margin: "0 auto",
      display: "inline",
      display: "inline-block",
      cursor: "pointer"
    };
    return <button type="button" onClick={() => this.select(this.props.type)} style={mystyle}><i className={this.props.icon}></i>{this.props.text}</button>;
  }
}

class Buttons extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <Button text=" House of Commons" type="HoC" icon="fa fa-bank" background="FireBrick"/>
        <Button text=" House of Lords" type="HoL" icon="fa fa-bank" background="ForestGreen"/>
        <Button text=" Parliamentary Bills" type="PB" icon="fa fa-book" background="Indigo"/>
        <Button text=" Parliamentary Committees" type="PC" icon="fa fa-users" background="SteelBlue"/>
      </div>
    );
  }
}

ReactDOM.render(<LandingPage/>, document.getElementById('root'));
