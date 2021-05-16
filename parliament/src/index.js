import React from 'react';
import ReactDOM from 'react-dom';
import './styling.css';
import 'font-awesome/css/font-awesome.min.css';

// Gathers the components for the initial landing page.
class LandingPage extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Header/>
        </div>
        <div id="content">
          <LandingButtons/>
          <Search/>
        </div>
        <Footer/>
      </div>
    )
  }
}
// Row of buttons for navigating from the landing page.
class LandingButtons extends React.Component {
  render() {
    return (
      <div>
        <Button text=" House of Commons" type="HoC" icon="fa fa-bank" background="ForestGreen"/>
        <Button text=" House of Lords" type="HoL" icon="fa fa-bank" background="FireBrick"/>
        <Button text=" Parliamentary Bills" type="PB" icon="fa fa-book" background="Indigo"/>
        <Button text=" Parliamentary Committees" type="PC" icon="fa fa-users" background="SteelBlue"/>
      </div>
    );
  }
}

class HoCPage extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Header/>
        </div>
        <div id="content">
          <HoCButtons/>
        </div>
        <Footer/>
      </div>
    )
  }
}
class HoCButtons extends React.Component {
  render() {
    return (
      <div>
        <Button text=" Members" type="HoCMembers" icon="fa fa-users" background="ForestGreen"/>
        <Button text=" Votes" type="HoCVotes" icon="fa fa-tasks" background="DarkGoldenRod"/>
        <Button text=" Oral Votes and Motions" type="Oral" icon="fa fa-comments" background="SteelBlue"/>
      </div>
    );
  }
}

class HoCMembers extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Header/>
        </div>
        <div id="content">
          <Search endpoint="/api/Location/Constituency/Search"/>
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
  constructor(props) {
    super(props);
  }
  APIcaller(url){
    var self = this;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
          var response = JSON.parse(this.responseText);
          self.DisplayResults(response);
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
  submitSearch = (event) => {
    event.preventDefault();
    this.APIcaller("https://members-api.parliament.uk" + this.props.endpoint + "?searchText=" + this.state.search);
  }
  DisplayResults(response){
    console.log(response);
  }
  changeSearch = (event) => {
    this.setState({search: event.target.value});
  }
  render() {
    const mystyle = {
      textAlign: "center",
      width: "95%"
    };
    return (
      <div className="search-container">
        <form onSubmit={this.submitSearch}>
          <input style={mystyle} type="text" placeholder="Search..." onChange={this.changeSearch}/>
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
    if (type === "HoC"){
      ReactDOM.unmountComponentAtNode(document.getElementById('root'));
      ReactDOM.render(<HoCPage/>, document.getElementById('root'));
    }
    else if (type === "HoCMembers"){
      ReactDOM.unmountComponentAtNode(document.getElementById('root'));
      ReactDOM.render(<HoCMembers/>, document.getElementById('root'));
    }
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

ReactDOM.render(<LandingPage/>, document.getElementById('root'));
