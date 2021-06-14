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

        <div className="contentBlock">
          <LandingButtons/>
          <p>Understanding the labrynth of Parliamentary committees, schedules, and rules becomes quickly overwhelmingly. This resource aims to provide a more concise and accessible means of understanding who represents you in Parliament, what theirs views are, and the general proceedings of both Houses.</p>
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
        <div className="mainContent">
          <div className="contentBlock">
            <HoCButtons/>
          </div>
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
        <h1><Button text="" type="Icon" icon="fa fa-home" background="CornflowerBlue"/>UK Parliament: Who Represents Me?</h1>
      </div>
    );
  }
}

class Footer extends React.Component {
  render() {
    return (
      <div className="footer">
        <p>Website Developed by Brodie Peberdy - Parliamentary information licensed under the <a href="https://www.parliament.uk/site-information/copyright-parliament/open-parliament-licence/">Open Parliament License v3.0</a>.</p>
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
      if (this.state.search.trim() !== "" || this.state.search.trim() !== undefined || this.state.search.trim() !== null){
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
    if (JSON.parse(results).totalResults === 0){
      results = null;
    }
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
      <div className="search-container mainContent">
        <form className="SearchBar" onSubmit={this.submitSearch}>
          <input className="SearchInput" style={mystyle} type="text" placeholder="Search for constituency, or enter your post code..." onChange={this.changeSearch}/>
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
      if (results === null){
        return (
          <div className="contentBlock">
            <p>Nothing showing up? Double check what you entered!</p>
          </div>);
      }
      else if (this.state.selectedID == null){
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
      return <p> </p>;
    }
  }
}


class ConstituencySearchSelect extends React.Component {
  APIcaller(url, id){
    this.responseText = null; // Weird cache issue
    url = url + id.toString();
    var self = this;
    var xmlhttp = new XMLHttpRequest();
    var self = this;
    xmlhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var response = JSON.stringify(JSON.parse(this.responseText));
        self.displayConstituency(response);
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
  selectConstituency(id){
    this.APIcaller("https://members-api.parliament.uk/api/Location/Constituency/", id);
  }
  displayConstituency(response) {
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
    ReactDOM.render(<ConstituencyDisplay resp={response}/>, document.getElementById('root'));
  }
  selectMember(id){
    this.APIcaller("https://members-api.parliament.uk/api/Location/Constituency/", id);
  }
  render() {
    var response = JSON.parse(this.props.response);
    setTimeout(1000);
    var image = response.value.currentRepresentation.member.value.thumbnailUrl;
    return (
      <div className="selected">
        <img style={{border: "0.3em solid #" + response.value.currentRepresentation.member.value.latestParty.backgroundColour}} src={image} alt={response.value.currentRepresentation.member.value.nameDisplayAs}></img>
          <h1><a onClick={() => this.selectConstituency(response.value.id)}>{response.value.name}</a></h1><br/>
          Represented by <b><a onClick={() => this.selectMember(response.value.currentRepresentation.member.value.id)}>{response.value.currentRepresentation.member.value.nameDisplayAs}</a></b>
          , {response.value.currentRepresentation.member.value.latestParty.name}.
      </div>);
  }
}

class ConstituencyDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {synopsis: null, results: null, representations: null};
    this.APIcaller("https://members-api.parliament.uk/api/Location/Constituency", JSON.parse(this.props.resp).value.id, "ElectionResults");
    this.APIcaller("https://members-api.parliament.uk/api/Location/Constituency", JSON.parse(this.props.resp).value.id, "Representations");
  }
  APIcaller(url, id, endpoint){
    this.responseText = null; // Weird cache issue
    url = url + "/" + id.toString() + "/" + endpoint.toString();
    var self = this;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var response = JSON.stringify(JSON.parse(this.responseText));
        if (endpoint === "ElectionResults"){
          self.setState({results: response});
        }
        else if (endpoint === "Representations"){
          self.setState({representations: response});
        }
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
  // Formats dates into a more readable state.
  dateHandler(text) {
    const months = [ "January", "February", "March", "April", "May", "June",
           "July", "August", "September", "October", "November", "December" ];
    var year = text.substring(0,4);
    var month = months[parseInt(text.substring(5,7)) - 1];
    var ordInd = "th";
    if (text.substring(8,10) === "01" || text.substring(8,10) === "21" || text.substring(8,10) === "31"){
      ordInd = "st";
    }
    else if (text.substring(8,10)[1] === "02" || text.substring(8,10)[1] === "22") {
      ordInd = "nd";
    }
    else if (text.substring(8,10)[1] === "03" || text.substring(8,10)[1] === "23") {
      ordInd = "rd";
    }
    var day = parseInt(text.substring(8,10));
    return day + ordInd + " " + month + " " + year;
  }
  render() {
    var overview = JSON.parse(this.props.resp);
    var location = "";

    var results = JSON.parse(this.state.results);
    var resultsForRender = [];
    if (results !== null){
      var numElections = results.value.length;
      for (var i = 0; i < numElections; i++){
        resultsForRender[i] = results.value[i];
      }
    }

    var representations = JSON.parse(this.state.representations);
    var representationsForRender = [];
    if (representations !== null){
      console.log(representations);
      var numRepresentations = representations.value.length;
      for (var i = 1; i < numRepresentations; i++){
        representationsForRender[i] = representations.value[i];
      }
    }


    return(
      <div>
        <div>
          <Header/>
        </div>
        <div className="mainContent">
          <div className="contentBlock selected">
            <img style={{border: "0.3em solid #" + overview.value.currentRepresentation.member.value.latestParty.backgroundColour}} src={overview.value.currentRepresentation.member.value.thumbnailUrl} alt={overview.value.currentRepresentation.member.value.nameDisplayAs}></img>
            <h1>{overview.value.name}</h1>
            <p>{overview.value.currentRepresentation.member.value.nameDisplayAs} has been the the {overview.value.currentRepresentation.member.value.latestParty.name} ({overview.value.currentRepresentation.member.value.latestParty.abbreviation}) MP for {overview.value.name} since {this.dateHandler(overview.value.currentRepresentation.member.value.latestHouseMembership.membershipStartDate)}.</p>
          </div>
          <div className="contentBlock">
            <h3>Previous MPs</h3>
            {representationsForRender.map(rep =>
              <div className="previousMP">
                <img style={{border: "0.3em solid #" + rep.member.value.latestParty.backgroundColour}} src={rep.member.value.thumbnailUrl} alt={rep.member.value.nameDisplayAs}></img>
                <p>{rep.member.value.nameDisplayAs} | {rep.member.value.latestParty.name}</p>
              </div>
            )}
          </div>
          <div className="contentBlock">
            <h3>Election History of {overview.value.name}</h3>
            {resultsForRender.map(election =>
              <div className="electionResult" style={{border: "0.3em solid #" + election.winningParty.backgroundColour}}>
                <h3>{election.electionTitle} | <i>{election.result}</i></h3>
                <p><i>Electorate:</i> <b>{election.electorate}</b> | <i>Turnout:</i> <b>{Math.round((election.turnout / election.electorate) * 1000) / 10 + "%" }</b> | <i>Majority:</i> <b>{election.majority}</b></p>
              </div>)}
          </div>
          <div className="contentBlock">
            <h3>Location on Map</h3>
            {location}
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

class Button extends React.Component {
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
    else if (type === "Icon"){
      ReactDOM.unmountComponentAtNode(document.getElementById('root'));
      ReactDOM.render(<LandingPage/>, document.getElementById('root'));
    }
  }
  render() {
    var mystyle = {
      textAlign: "center",
      backgroundColor: this.props.background,
      color: "White",
      border: "none",
      width: "25%",
      padding: "1em",
      margin: "0 auto",
      display: "inline-block",
      cursor: "pointer",
    };
    var iconStyle = {};
    if (this.props.type === "Icon"){
      var mystyle = {
        float: "left",
        textAlign: "center",
        backgroundColor: this.props.background,
        color: "White",
        border: "none",
        padding: "0.25em",
        margin: "0 auto",
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
