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
    return (
      <div className="header">
        <h1><Button text="" type="Home" icon="fa fa-home" background="CornflowerBlue"/>UK Parliament: Who Represents Me?</h1>
      </div>
    );
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
    this.state = {results: null};
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
    try {
      if (this.state.search.trim() != "" || this.state.search.trim() != undefined || this.state.search.trim() != null){
        this.APIcaller("https://members-api.parliament.uk" + this.props.endpoint + "?searchText=" + this.state.search);
      }
      else{
        throw "Please enter a valid constituency name.";
      }
    }
    catch (error) {
      alert("Please enter a valid constituency name.");
    }
  }
  DisplayResults(response){
    this.updateResults(JSON.stringify(response));
  }
  updateResults(results) {
    this.setState({results: results});
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
        <form className="SearchBar" onSubmit={this.submitSearch}>
          <input className="SearchInput" style={mystyle} type="text" placeholder="Search..." onChange={this.changeSearch}/>
          <button className="SearchButton" type="submit"><i className="fa fa-search"></i></button>
        </form>
        <ConstituencySearchDisplay results={this.state.results}/>
      </div>
    );
  }
}

class ConstituencySearchDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedID: null, response: null};
  }
  select(id){
    this.APIcaller("https://members-api.parliament.uk/api/Location/Constituency/", id);
  }
  APIcaller(url, id){
    this.responseText = null; // Weird cache issue
    url = url + id.toString();
    var self = this;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var response = JSON.stringify(JSON.parse(this.responseText));
        self.setState({selectedID: id, response: response});
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
  render() {
    try {
      const results = JSON.parse(this.props.results);
      //
      if (this.state.selectedID == null){
        return (
          <div>
            <ul className="results">
              {results.items.map((item) => (
                <li key={item.value.id}><a onClick={() => this.select(item.value.id)}>{item.value.name}</a></li>
              ))}
            </ul>
          </div>);
      }
      else {
        console.log(JSON.parse(this.state.response));
        return (
          <div>
            <ul className="results">
              {results.items.map((item) => (
                <li key={item.value.id}><a onClick={() => this.select(item.value.id)}>{item.value.name}</a></li>
              ))}
            </ul>
            <ConstituencySearchSelect id={this.state.id} response={this.state.response}/>
          </div>);
      }
    }
    catch (error) {
      return <p>failed</p>;
    }
  }
}

class ConstituencySearchSelect extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    var response = JSON.parse(this.props.response);
    setTimeout(1000);
    return (<div className="selected">{this.props.id} {response.value.name}</div>);
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
    else if (type === "Home"){
      ReactDOM.unmountComponentAtNode(document.getElementById('root'));
      ReactDOM.render(<LandingPage/>, document.getElementById('root'));
    }
  }
  render() {
    var mystyle = {
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
    var iconStyle = {};
    if (this.props.type == "Home"){
      var mystyle = {
        float: "left",
        textAlign: "center",
        backgroundColor: this.props.background,
        color: "White",
        display: "block",
        border: "none",
        padding: "0.25em",
        margin: "0 auto",
        display: "inline",
        display: "inline-block",
        cursor: "pointer"
      };
      iconStyle = {
        fontSize: "2.5em"
      };
    }
    return <button type="button" onClick={() => this.select(this.props.type)} style={mystyle}><i style={iconStyle} className={this.props.icon}></i>{this.props.text}</button>;
  }
}

ReactDOM.render(<LandingPage/>, document.getElementById('root'));
