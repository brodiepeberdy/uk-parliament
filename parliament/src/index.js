import React from 'react';
import ReactDOM from 'react-dom';
import Footer from './components/Footer.js'
import Formatters from './js/Formatters.js'
import './styling.css';
// For Font Awesome icon classes.
import 'font-awesome/css/font-awesome.min.css';

// Header component for the top of every page. Has a "home" button which returns the user to the landing page, and the title of the website.
class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <h1><Button text="" type="Icon" icon="fa fa-home" background="CornflowerBlue"/>UK Parliament: Who Represents Me?</h1>
      </div>
    );
  }
}

// Gathers the components for the initial landing page.
class LandingPage extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Header/>
        </div>

        <div className="contentBlock">
          <p>Understanding the labrynth of Parliamentary committees, schedules, and rules becomes quickly overwhelmingly. This resource aims to provide a more concise and accessible means of understanding who represents you in Parliament, what theirs views are, and the general proceedings of both Houses.</p>
          <h3 className="centreTitle">House of Commons</h3>
          <div className="row">
            <Button text=" Members" type="HoCMembers" icon="fa fa-user" background="ForestGreen"/>
            <Button text=" Parties" type="HoCParties" icon="fa fa-users" background="MediumSeaGreen"/>
            <Button text=" Votes" type="HoCVotes" icon="fa fa-tasks" background="DarkGoldenRod"/>
            <Button text=" Oral Questions and Motions" type="Questions" icon="fa fa-comments" background="SteelBlue"/>
          </div>
        </div>

        <div className="contentBlock">
          <h3>Understanding UK Parliament and the Government</h3>
          <div className=" info">
            <iframe width="40%" src="https://www.youtube.com/embed/GbLTwQwXqWc" alt="Video explaining the basic principles of how UK Parliament works."/>
            <div>
              <p>The UK (United Kingdom) is divided into 650 constituencies, each represented by
              an elected MP (Member of Parliament) in the House of Commons, usually representing a specific political
              party (for example The Conservative Party, The Labour Party, etc.), though they can be Independent.</p>
              <p>Each constituency elects an MP, and then whichever party in Parliament
              has the most MPs automatically forms the government, since they have
              enough MPs to vote in the same way to achieve a majority of votes on matters.
              Said party's leader becomes the PM (Prime Minister), and they are usually an MP themselves.</p>
              <p>In the situation that no one party has majority control of the House of Commons, parties will attempt to form a
              coalition in which multiple parties come to an agreement to share voting power by pooling their MPs' votes.</p>
              <p>Meanwhile, The House of Lords is an unelected chamber which reviews
              and suggests amendments to bills from the House of Commons.</p>
            </div>
          </div>
        </div>

        <Footer/>
      </div>
    )
  }
}

// Class used for the navigation buttons on the landing page.
class Button extends React.Component {
  select(type){
    if (type === "HoCMembers"){
      ReactDOM.unmountComponentAtNode(document.getElementById('root'));
      ReactDOM.render(<HoCMembers/>, document.getElementById('root'));
    }
    else if (type === "HoCParties"){
      ReactDOM.unmountComponentAtNode(document.getElementById('root'));
      ReactDOM.render(<HoCParties/>, document.getElementById('root'));
    }
    else if (type === "HoCVotes"){
      ReactDOM.unmountComponentAtNode(document.getElementById('root'));
      ReactDOM.render(<HoCVotes/>, document.getElementById('root'));
    }
    else if (type === "Icon"){
      ReactDOM.unmountComponentAtNode(document.getElementById('root'));
      ReactDOM.render(<LandingPage/>, document.getElementById('root'));
    }
    else if (type === "Questions"){
      ReactDOM.unmountComponentAtNode(document.getElementById('root'));
      ReactDOM.render(<HoCQuestions/>, document.getElementById('root'));
    }
  }
  render() {
    var mystyle = {
      textAlign: "center",
      backgroundColor: this.props.background,
      color: "White",
      border: "none",
      width: "20%",
      margin: "0 auto",
      height: "4em",
      display: "inline-block",
      cursor: "pointer",
      borderRadius: "0.3em 0.3em 0.3em 0.3em",
      borderBottom: "0.1em solid Gray"
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

// Page for searching for your constituency to view your MP.
class HoCMembers extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Header/>
        </div>
        <div id="content">
          <ConstituencySearch endpoint="/api/Location/Constituency/Search"/>
        </div>
        <Footer/>
      </div>
    )
  }
}


class ConstituencySearch extends React.Component {
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
    return (
      <div>
        <form className="SearchBar" onSubmit={this.submitSearch}>
          <input className="SearchInput" style={{textAlign: "center", width: "95%"}} type="text" placeholder="Search for constituency, or enter your post code..." onChange={this.changeSearch}/>
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
      else if (this.state.selectedID === null){
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
  APIcaller(url, endpoint, id){
    this.responseText = null; // Weird cache issue
    url = url + endpoint.toString() + id.toString();
    var self = this;
    var xmlhttp = new XMLHttpRequest();
    var self = this;
    xmlhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var response = JSON.stringify(JSON.parse(this.responseText));
        if (endpoint === "Location/Constituency/"){
          self.displayConstituency(response);
        }
        else if (endpoint === "Members/"){
          self.displayMember(response);
        }
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
  selectConstituency(id){
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
    ReactDOM.render(<ConstituencyDisplay id={id}/>, document.getElementById('root'));
  }
  selectMember(id){
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
    ReactDOM.render(<MemberDisplay id={id}/>, document.getElementById('root'));
  }
  render() {
    var response = JSON.parse(this.props.response);
    setTimeout(1000);
    var image = response.value.currentRepresentation.member.value.thumbnailUrl;
    return (
      <div className="selected">
        <img style={{border: "0.3em solid #" + response.value.currentRepresentation.member.value.latestParty.backgroundColour}} src={image}></img>
        <div>
          <h1><a onClick={() => this.selectConstituency(response.value.id)}>{response.value.name}</a></h1>
          <h3>Represented by <b><a onClick={() => this.selectMember(response.value.currentRepresentation.member.value.id)}>{response.value.currentRepresentation.member.value.nameDisplayAs}</a></b>
          , {response.value.currentRepresentation.member.value.latestParty.name}.</h3>
        </div>
      </div>);
  }
}

class ConstituencyDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {info: null, results: null, representations: null};
    this.APIcaller("https://members-api.parliament.uk/api/Location/Constituency/" + this.props.id, "info");
    this.APIcaller("https://members-api.parliament.uk/api/Location/Constituency/" + this.props.id + "/ElectionResults", "results");
    this.APIcaller("https://members-api.parliament.uk/api/Location/Constituency/" + this.props.id + "/Representations", "representations");
  }
  APIcaller(url, type){
    this.responseText = null; // Weird cache issue
    var self = this;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var response = JSON.stringify(JSON.parse(this.responseText));
        if (type === "info"){
          self.setState({info: response});
        }
        else if (type === "results"){
          self.setState({results: response});
        }
        else if (type === "representations"){
          self.setState({representations: response});
        }
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
  selectMember(id){
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
    ReactDOM.render(<MemberDisplay id={id}/>, document.getElementById('root'));
  }
  viewParties(){
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
    ReactDOM.render(<HoCParties/>, document.getElementById('root'));
  }
  render() {
    var info = JSON.parse(this.state.info);
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
      var numRepresentations = representations.value.length;
      for (var i = 1; i < numRepresentations; i++){
        representationsForRender[i] = representations.value[i];
      }
    }

    if (info === null){
      return(<p/>);
    }

    return(
      <div>
        <div>
          <Header/>
        </div>
        <div className="mainContent">
          <div className="contentBlock selected">
            <img style={{border: "0.3em solid #" + info.value.currentRepresentation.member.value.latestParty.backgroundColour}} src={info.value.currentRepresentation.member.value.thumbnailUrl}></img>
            <div>
              <h1>{info.value.name}</h1>
              <p><a onClick={() => this.selectMember(info.value.currentRepresentation.member.value.id)}>{info.value.currentRepresentation.member.value.nameDisplayAs}</a> has been the the <a onClick={() => this.viewParties()}>{info.value.currentRepresentation.member.value.latestParty.name} ({info.value.currentRepresentation.member.value.latestParty.abbreviation})</a> MP for {info.value.name} since {Formatters.dateHandler(info.value.currentRepresentation.member.value.latestHouseMembership.membershipStartDate)}.</p>
            </div>
          </div>
          <div className="contentBlock">
            <h3>Previous MPs</h3>
            {representationsForRender.map(rep =>
              <div className="previousMP">
                <img style={{border: "0.3em solid #" + rep.member.value.latestParty.backgroundColour}} src={rep.member.value.thumbnailUrl}></img>
                <div>
                  <h3>{rep.member.value.nameDisplayAs} | {rep.member.value.latestParty.name}</h3>
                  <h5>{Formatters.dateHandler(rep.representation.membershipStartDate)} - {Formatters.dateHandler(rep.representation.membershipEndDate)}</h5>
                </div>
              </div>
            )}
          </div>
          <div className="contentBlock">
            <h3>Election History of {info.value.name}</h3>
            {resultsForRender.map(election =>
              <div className="individualItem" style={{borderLeft: "0.5em solid #" + election.winningParty.backgroundColour}}>
                <h3>{election.electionTitle} | <i>{election.result}</i></h3>
                <p><i>Electorate:</i> <b>{election.electorate}</b></p>
                <p><i>Turnout:</i> <b>{Math.round((election.turnout / election.electorate) * 1000) / 10 + "%" }</b></p>
                <p><i>Majority:</i> <b>{election.majority}</b></p>
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

class MemberDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {info: null, bio: null, contact: null, representations: null, voting: null, viewVoting: false, votingPage: 0, viewParties: false, viewConstituencies: false, viewGovPosts: false, viewOppPosts: false, viewCommittees: false, viewContact: false};
    this.APIcaller("https://members-api.parliament.uk/api/Members/" + this.props.id, "info");
    this.APIcaller("https://members-api.parliament.uk/api/Members/" + this.props.id + "/Biography", "bio");
    this.APIcaller("https://members-api.parliament.uk/api/Members/" + this.props.id + "/Contact", "contact");
    this.APIcaller("https://members-api.parliament.uk/api/Members/" + this.props.id + "/Voting?house=1", "votingNext");
  }
  APIcaller(url, endpoint){
    this.responseText = null; // Weird cache issue
    var self = this;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var response = JSON.stringify(JSON.parse(this.responseText));
        if (endpoint === "info"){
          self.setState({info: response});
        }
        else if (endpoint === "bio"){
          self.setState({bio: response});
        }
        else if (endpoint === "contact"){
          self.setState({contact: response});
        }
        else if (endpoint === "votingNext"){
          self.setState({voting: response, votingPage: self.state.votingPage + 1});
        }
        else if (endpoint === "votingPrev"){
          if (self.state.votingPage - 1 !== -1) {
            self.setState({voting: response, votingPage: self.state.votingPage - 1});
          }
        }
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
  selectConstituency(id){
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
    ReactDOM.render(<ConstituencyDisplay id={id}/>, document.getElementById('root'));
  }
  selectBill(id) {
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
    ReactDOM.render(<BillDisplay id={id}/>, document.getElementById('root'));
  }
  render(){
    var info = JSON.parse(this.state.info);
    var bio = JSON.parse(this.state.bio);
    var houses = [["House of Commons", "Red"], ["House of Lords", "Green"]];
    var committeesForRender = []; var partiesForRender = [];
    var govPostsForRender = []; var oppPostsForRender = [];
    var representationsForRender = [];


    if (bio !== null){
      for (var i = 0; i < bio.value.committeeMemberships.length; i++){
        committeesForRender[i] = bio.value.committeeMemberships[i];
      }
      for (var i = 0; i < bio.value.representations.length; i++){
        representationsForRender[i] = bio.value.representations[i];
      }
      for (var i = 0; i < bio.value.partyAffiliations.length; i++){
        partiesForRender[i] = bio.value.partyAffiliations[i];
      }
      for (var i = 0; i < bio.value.governmentPosts.length; i++){
        govPostsForRender[i] = bio.value.governmentPosts[i];
      }
      for (var i = 0; i < bio.value.oppositionPosts.length; i++){
        oppPostsForRender[i] = bio.value.oppositionPosts[i];
      }
    }

    var contact = JSON.parse(this.state.contact);
    var contactsForRender = []
    if (contact !== null){
      var contactsNum = contact.value.length;
      for (var i = 0; i < contactsNum; i++){
        contactsForRender[i] = contact.value[i];
      }
    }

    var voting = JSON.parse(this.state.voting);
    var votingForRender = []
    if (voting !== null){
      var votingNum = voting.items.length;
      for (var i = 0; i < votingNum; i++){
        votingForRender[i] = voting.items[i].value;
      }
    }
    else {
      return(<p/>);
    }

    if (info === null){
      return(<p/>);
    }

    console.log(voting);

    var viewVoting = this.state.viewVoting ? {display: "block"} : {display: "none"};
    var viewParties = this.state.viewParties ? {display: "block"} : {display: "none"};
    var viewConstituencies = this.state.viewConstituencies ? {display: "block"} : {display: "none"};
    var viewGovPosts = this.state.viewGovPosts ? {display: "block"} : {display: "none"};
    var viewOppPosts = this.state.viewOppPosts ? {display: "block"} : {display: "none"};
    var viewCommittees = this.state.viewCommittees ? {display: "block"} : {display: "none"};
    var viewContact = this.state.viewContact ? {display: "block"} : {display: "none"};

    return(
      <div>
        <div>
          <Header/>
        </div>
        <div className="mainContent">
          <div className="contentBlock selected">
            <img style={{border: "0.3em solid #" + info.value.latestParty.backgroundColour}} src={info.value.thumbnailUrl}></img>
            <div>
              <h1>{info.value.nameDisplayAs}</h1>
              <p>{info.value.nameDisplayAs} has been the the {info.value.latestParty.name} ({info.value.latestParty.abbreviation}) MP for <a onClick={() => this.selectConstituency(info.value.latestHouseMembership.membershipFromId)}>{info.value.latestHouseMembership.membershipFrom}</a> since {Formatters.dateHandler(info.value.latestHouseMembership.membershipStartDate)}.</p>
            </div>
          </div>

          <div className="contentBlock">
            <div className="expandable nav centreTitle" onClick={() => this.setState({viewContact: (!this.state.viewContact)})}>
              <h3 className="billTitle">Contact Details</h3>
              <i className="fa fa-chevron-down"></i>
            </div>
            <div style={viewContact} className="items">
              {contactsForRender.map(method =>
                <div className="individualItem">
                  <h3>{method.type}</h3>
                  <p><i>{method.typeDescription}</i></p>
                  <div className="row">
                    <div className="details">
                      <p>{method.line1}</p>
                      <p>{method.line2}</p>
                      <p>{method.line3}</p>
                      <p>{method.line4}</p>
                      <p>{method.line5}</p>
                      <p>{method.postcode}</p>
                    </div>
                    <div className="details">
                      <p><a href={"tel:" + method.phone}>{method.phone}</a></p>
                      <p><a href={"mailto:" + method.email}>{method.email}</a></p>
                    </div>
                  </div>
                </div>)}
              </div>
          </div>

          <div className="contentBlock">
            <div className="expandable nav centreTitle" onClick={() => this.setState({viewVoting: (!this.state.viewVoting)})}>
              <h3 className="billTitle">Voting Record</h3>
              <i className="fa fa-chevron-down"></i>
            </div>
            <div style={viewVoting}>
              <div className="centreTitle nav">
                <i className="fa fa-chevron-left" onClick={() => this.APIcaller("https://members-api.parliament.uk/api/Members/" + this.props.id + "/Voting?house=1&page=" + (this.state.votingPage - 1), "votingPrev")}></i>
                <i className="fa fa-chevron-right" onClick={() => this.APIcaller("https://members-api.parliament.uk/api/Members/" + this.props.id + "/Voting?house=1&page=" + (this.state.votingPage + 1), "votingNext")}></i>
              </div>
              {votingForRender.map(division =>
                <div className="billResult" onClick={() => this.selectBill(division.id)}>
                  <h4>{division.title}</h4>
                  <span></span>
                  <h5>Division {division.number}: {Formatters.dateHandler(division.date)}</h5>
                  {(() => {
                    if (division.actedAsTeller) {return (<h5>Member Acted as Teller</h5>)}
                  })()}
                  <div className="votingBlock">
                    {(() => {
                      if (division.inAffirmativeLobby) {return (<div className="voting memberVote"><i className="fa fa-thumbs-up"></i><p>Voted‌‌ Aye</p></div>)}
                      else {return (<div className="voting memberVote"><i className="fa fa-thumbs-down"></i><p>Voted‌‌ No</p></div>)}
                    })()}
                    <div className="voting ayeVote">
                      <i className="fa fa-thumbs-up"></i><p>Ayes: {division.numberInFavour}</p>
                    </div>
                    <div className="voting noVote">
                      <i className="fa fa-thumbs-down"></i><p>Noes: {division.numberAgainst}</p>
                    </div>
                  </div>
                </div>)}
                <div className="centreTitle nav">
                  <i className="fa fa-chevron-left" onClick={() => this.APIcaller("https://members-api.parliament.uk/api/Members/" + this.props.id + "/Voting?house=1&page=" + (this.state.votingPage - 1), "votingPrev")}></i>
                  <i className="fa fa-chevron-right" onClick={() => this.APIcaller("https://members-api.parliament.uk/api/Members/" + this.props.id + "/Voting?house=1&page=" + (this.state.votingPage + 1), "votingNext")}></i>
                </div>
              </div>
          </div>

          <div className="contentBlock">
            <h2 className="centreTitle">Parliamentary Career</h2>

            <div className="careerSection">
              <div className="expandable nav centreTitle" onClick={() => this.setState({viewParties: (!this.state.viewParties)})}>
                <h3 className="billTitle">Party Affiliations</h3>
                <i className="fa fa-chevron-down"></i>
              </div>
              <div style={viewParties}>
                {partiesForRender.map(party =>
                    <div className="individualItem">
                      <h3>{party.name}</h3>
                      <h5>{Formatters.dateHandler(party.startDate)} - {Formatters.dateHandler(party.endDate)}</h5>
                  </div>)}
              </div>
            </div>

            <div className="careerSection">
              <div className="expandable nav centreTitle" onClick={() => this.setState({viewConstituencies: (!this.state.viewConstituencies)})}>
                <h3 className="billTitle">Constituencies Represented</h3>
                <i className="fa fa-chevron-down"></i>
              </div>
              <div style={viewConstituencies}>
              {representationsForRender.map(constituency =>
                  <div className="individualItem">
                    <h3>{constituency.name}</h3>
                    <h4>{constituency.additionalInfo}</h4>
                    <h5>{Formatters.dateHandler(constituency.startDate)} - {Formatters.dateHandler(constituency.endDate)}</h5>
                </div>)}
              </div>
            </div>

            <div className="careerSection">
              <div className="expandable nav centreTitle" onClick={() => this.setState({viewGovPosts: (!this.state.viewGovPosts)})}>
                <h3 className="billTitle">Government Posts</h3>
                <i className="fa fa-chevron-down"></i>
              </div>
              <div style={viewGovPosts}>
              {govPostsForRender.map(post =>
                  <div className="individualItem" style={{borderLeft: "0.6em solid " + houses[post.house - 1][1]}}>
                    <h3 className="centreTitle">{post.name}</h3>
                    <div className="row">
                      <h5>• {houses[post.house - 1][0]}</h5>
                      <h5>• {Formatters.dateHandler(post.startDate)} - {Formatters.dateHandler(post.endDate)}</h5>
                    </div>
                </div>)}
              </div>
            </div>

            <div className="careerSection">
              <div className="expandable nav centreTitle" onClick={() => this.setState({viewOppPosts: (!this.state.viewOppPosts)})}>
                <h3 className="billTitle">Opposition Posts</h3>
                <i className="fa fa-chevron-down"></i>
              </div>
              <div style={viewOppPosts}>
              {oppPostsForRender.map(post =>
                  <div className="individualItem" style={{borderLeft: "0.6em solid " + houses[post.house - 1][1]}}>
                    <h3 className="centreTitle">{post.name}</h3>
                    <div className="row">
                      <h5>• {houses[post.house - 1][0]}</h5>
                      <h5>• {Formatters.dateHandler(post.startDate)} - {Formatters.dateHandler(post.endDate)}</h5>
                    </div>
                </div>)}
              </div>
            </div>

            <div className="careerSection">
              <div className="expandable nav centreTitle" onClick={() => this.setState({viewCommittees: (!this.state.viewCommittees)})}>
                <h3 className="billTitle">Committee Memberships</h3>
                <i className="fa fa-chevron-down"></i>
              </div>
              <div style={viewCommittees}>
              {committeesForRender.map(committee =>
                <div className="individualItem" style={{borderLeft: "0.6em solid " + houses[committee.house - 1][1]}}>
                  <h3 className="centreTitle">{committee.name}</h3>
                  <div className="row">
                    <h5>• {houses[committee.house - 1][0]}</h5>
                    <h5>• {Formatters.dateHandler(committee.startDate)} - {Formatters.dateHandler(committee.endDate)}</h5>
                  </div>
                </div>)}
              </div>
            </div>

          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

class HoCParties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {stateHoC: null, stateHoL: null, activePartiesHoC: null, activePartiesHoL: null};
    var currentdate = new Date();
    var dateIn = currentdate.getFullYear() + "-" + (currentdate.getMonth()+1) + "-" + currentdate.getDate() + "T00:00:00";
    this.APIcaller("https://members-api.parliament.uk/api/Parties/StateOfTheParties/" + "1" + "/" + dateIn, "stateHoC");
    // this.APIcaller("https://members-api.parliament.uk/api/Parties/StateOfTheParties/" + "2" + "/" + dateIn, "stateHoL");
  }
  APIcaller(url, endpoint){
    this.responseText = null; // Weird cache issue
    var self = this;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var response = JSON.stringify(JSON.parse(this.responseText));
        if (endpoint === "stateHoC"){
          self.setState({stateHoC: response});
        }
        else if (endpoint === "stateHoL"){
          self.setState({stateHoL: response});
        }
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
  render() {
    var stateHoC = JSON.parse(this.state.stateHoC);
    if (stateHoC === null) {
      return (<p/>);
    }
    var partyGenders = [];
    for (var i = 0; i < stateHoC.items.length; i ++) {
      partyGenders[i] = [];
      if (stateHoC.items[i].value.male > 0) {
        partyGenders[i].push("Male: " + stateHoC.items[i].value.male);
      }
      if (stateHoC.items[i].value.female > 0) {
        partyGenders[i].push("Female: " + stateHoC.items[i].value.female);
      }
      if (stateHoC.items[i].value.male > 0) {
        partyGenders[i].push("Non-Binary: " + stateHoC.items[i].value.nonBinary);
      }
    }

    var elements = [];
    var visualMembers;

    for (var i = 0; i < stateHoC.items.length; i ++) {
      visualMembers = "";
      for (var j = 0; j < stateHoC.items[i].value.male + stateHoC.items[i].value.female + stateHoC.items[i].value.nonBinary; j ++) {
        visualMembers = visualMembers + "◼" + " ";
      }
      elements[i] = <span style={{color: "#" + stateHoC.items[i].value.party.backgroundColour}}>{visualMembers}</span>
    }

    if (elements === null) {
      return (<p/>);
    }

    return(
      <div>
        <div>
          <Header/>
        </div>
        <div className="mainContent">
          <div className="contentBlock">
            <h3 className="centreTitle">State of the Parties in the House of Commons</h3>
            <p>Most MPs (Members of Parliament) are members of political parties, and so the makeup of the House of Commons is determined by whichever Party has a plurality of MPs.</p>
            <p className="seatsVisual">{elements.map(item => <>{item}</>)}</p>

            <h3 className="centreTitle">Parties</h3>
            {stateHoC.items.map(item =>
              <div className="individualItem" style={{borderLeft: "0.5em solid #" + item.value.party.backgroundColour}}>
                <h3>{item.value.party.name} ({item.value.party.abbreviation})</h3>
                <div className="voting">

                {(() => {
                  if (item.value.male > 0) {
                    return (
                      <p>Male: {item.value.male}</p>
                    )
                  }
                })()}
                {(() => {
                  if (item.value.female > 0) {
                    return (
                      <p>Female: {item.value.female}</p>
                    )
                  }
                })()}
                {(() => {
                  if (item.value.nonBinary > 0) {
                    return (
                      <p>Non-Binary: {item.value.nonBinary}</p>
                    )
                  }
                })()}
                {(() => {
                  if (item.value.male === 0 && item.value.female === 0 && item.value.nonBinary === 0) {
                    return (
                      <p>There are no members in this group</p>
                    )
                  }
                })()}
                </div>
              </div>)}
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

class HoCVotes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {divisionsResults: null, search: "", start: null, end: null, skipNum: 0};
    this.APIcaller("https://commonsvotes-api.parliament.uk/data/divisions.json/search/", "search");
  }
  APIcaller(url, endpoint){
    this.responseText = null; // Weird cache issue
    var self = this;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var response = JSON.stringify(JSON.parse(this.responseText));
        if (endpoint === "search"){
          self.setState({divisionsResults: response});
        }
        else if (endpoint === "votingNext"){
          self.setState({divisionsResults: response, skipNum: self.state.skipNum + 25});
        }
        else if (endpoint === "votingPrev"){
          if (self.state.votingPage - 25 !== -25) {
            self.setState({divisionsResults: response, skipNum: self.state.skipNum - 25});
          }
        }
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
  submitSearch = (event) => {
    event.preventDefault();
    if (this.state.search.trim() !== "" || this.state.search.trim() !== undefined || this.state.search.trim() !== null){
      var url = "https://commonsvotes-api.parliament.uk/data/divisions.json/search?searchTerm=" + this.state.search;
      console.log(this.state.start);
      if (this.state.start !== null) {
        url = url + "&startDate=" + this.state.start.toString();
      }
      if (this.state.end !== null) {
        url = url + "&endDate=" + this.state.end;
      }
      this.APIcaller(url, "search");
    }
    else{
      throw "Please enter a valid constituency name.";
    }
  }
  changeSearch = (event) => {
    this.setState({search: event.target.value});
  }
  changeStart = (event) => {
    this.setState({start: event.target.value});
  }
  changeEnd = (event) => {
    this.setState({end: event.target.value});
  }
  selectBill(id) {
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
    ReactDOM.render(<BillDisplay id={id}/>, document.getElementById('root'));
  }
  render() {
    var divisions = JSON.parse(this.state.divisionsResults);
    console.log(divisions);

    if (divisions === null) {
      return (<p></p>);
    }

    var divisionsForRender = [];
    for (var i = 0; i < divisions.length; i ++) {
      divisionsForRender[i] = divisions[i];
    }

    return(
      <div>
        <div>
          <Header/>
        </div>
        <div className="mainContent mainCentral">
          <div className="contentBlock">
            <h3 className="centreTitle">View Past Votes in the House of Commons</h3>

              <form onSubmit={this.submitSearch}>
                <div className="SearchBar">
                  <input className="SearchInput" style={{textAlign: "center", width: "95%"}} type="text" placeholder="Search for a past vote in the House of Commons..." onChange={this.changeSearch}/>
                  <button className="SearchButton" type="submit"><i className="fa fa-search"></i></button>
                </div>
              </form>

              <p>These are optional parameters which can help you cut down your search to a specific period.</p>
              <div className="SearchBar searchDates">
                <p>Start Date:‌‌ ‌‌ ‌‌ ‌‌ </p><input className="SearchInput dateInput" style={{textAlign: "center", borderRadius: "0.4em 0.4em 0.4em 0.4em"}} type="date" onChange={this.changeStart}/>
                <p>End Date:‌‌ ‌‌ ‌‌ ‌‌ </p><input className="SearchInput dateInput" style={{textAlign: "center", borderRadius: "0.4em 0.4em 0.4em 0.4em"}} type="date" onChange={this.changeEnd}/>
              </div>

          </div>

          <div>

            <div className="centreTitle nav">
              <i className="fa fa-chevron-left" onClick={() => this.APIcaller("https://commonsvotes-api.parliament.uk/data/divisions.json/search?skip=" + (this.state.skipNum - 25), "votingPrev")}></i>
              <i className="fa fa-chevron-right" onClick={() => this.APIcaller("https://commonsvotes-api.parliament.uk/data/divisions.json/search?skip=" + (this.state.skipNum + 25), "votingNext")}></i>
            </div>


            {divisionsForRender.map(division =>
                <div className="billResult" onClick={() => this.selectBill(division.DivisionId)}>
                  <h4>{division.Title}</h4>
                  <span></span>
                  <h5>Division {division.Number}: {Formatters.dateHandler(division.Date)}</h5>
                  <div className="votingBlock">
                    <div className="voting ayeVote">
                      <i className="fa fa-thumbs-up"></i><p>⠀Ayes: {division.AyeCount}</p>
                    </div>
                    <div className="voting noVote">
                      <i className="fa fa-thumbs-down"></i><p>⠀Noes: {division.NoCount}</p>
                    </div>
                  </div>
              </div>)}


              <div className="centreTitle nav">
                <i className="fa fa-chevron-left" onClick={() => this.APIcaller("https://commonsvotes-api.parliament.uk/data/divisions.json/search?skip=" + (this.state.skipNum - 25), "votingPrev")}></i>
                <i className="fa fa-chevron-right" onClick={() => this.APIcaller("https://commonsvotes-api.parliament.uk/data/divisions.json/search?skip=" + (this.state.skipNum + 25), "votingNext")}></i>
              </div>


          </div>

        </div>
        <Footer/>
      </div>
    );
  }
}

class BillDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {division: null, aye: false, no: false};
    this.APIcaller("https://commonsvotes-api.parliament.uk/data/division/" + this.props.id + ".json");
  }
  APIcaller(url, endpoint){
    this.responseText = null; // Weird cache issue
    var self = this;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var response = JSON.stringify(JSON.parse(this.responseText));
        self.setState({division: response});
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
  selectMember(id){
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
    ReactDOM.render(<MemberDisplay id={id}/>, document.getElementById('root'));
  }
  render() {
    var division = JSON.parse(this.state.division);
    if (division === null) {
      return (<p></p>);
    }
    // Aye members.
    var ayeStyle = this.state.aye ? {display: "block", margin: 0} : {display: "none"};
    var ayeMembersForRender = [];
    for (var i = 0; i < division.Ayes.length; i ++) {
      ayeMembersForRender[i] = division.Ayes[i];
    }
    // Aye tellers.
    var ayeTellersForRender = [];
    if (division.AyeTellers !== null) {
      for (var i = 0; i < division.AyeTellers.length; i ++) {
        ayeTellersForRender[i] = division.AyeTellers[i];
      }
    }

    // No Members.
    var noStyle = this.state.no ? {display: "block", margin: 0} : {display: "none"};
    var noMembersForRender = [];
    for (var i = 0; i < division.Noes.length; i ++) {
      noMembersForRender[i] = division.Noes[i];
    }
    // No tellers.
    var noTellersForRender = [];
    if (division.NoTellers !== null) {
      for (var i = 0; i < division.NoTellers.length; i ++) {
        noTellersForRender[i] = division.NoTellers[i];
      }
    }

    return(
      <div>
        <div>
          <Header/>
        </div>
        <div className="mainContent">

          <div className="contentBlock">
            <div className="row">
              <div>
                <h3 className="centreTitle billTitle">{division.Title}</h3>
                <h4 className="centreTitle">Division {division.Number}: {Formatters.dateHandler(division.Date)}</h4>
              </div>
              <div className="voting ayeVote">
                <i className="fa fa-thumbs-up"></i><p>⠀Ayes: {division.AyeCount}</p>
              </div>
              <div className="voting noVote">
                <i className="fa fa-thumbs-down"></i><p>⠀Noes: {division.NoCount}</p>
              </div>
            </div>
          </div>

          <div className="centreTitle contentBlock">
            <h3 className="billTitle">Aye Tellers</h3>
            {ayeTellersForRender.map((member, i) =>
              <div key={i} className="individualItem votingMember selected" onClick={() => this.selectMember(member.MemberId)} style={{borderLeft: "0.6em solid #" + member.PartyColour}}>
                <img style={{border: "0.3em solid #" + member.PartyColour}} src={"https://members-api.parliament.uk/api/Members/" + member.MemberId + "/Thumbnail"}></img>
                <h3>{member.Name}</h3>
                <h4>{member.Party} ({member.PartyAbbreviation}) Member for {member.MemberFrom}</h4>
              </div>)}

            <div className="expandable nav centreTitle" onClick={() => this.setState({aye: (!this.state.aye)})}>
              <h3 className="billTitle">Aye Voting Members: {division.AyeCount}</h3>
              <i className="fa fa-chevron-down"></i>
            </div>
            <div style={ayeStyle}>
              {ayeMembersForRender.map((member, i) =>
                <div style={ayeStyle} key={i} className="individualItem votingMember selected" onClick={() => this.selectMember(member.MemberId)} style={{borderLeft: "0.6em solid #" + member.PartyColour}}>
                  <img style={{border: "0.3em solid #" + member.PartyColour}} src={"https://members-api.parliament.uk/api/Members/" + member.MemberId + "/Thumbnail"}></img>
                  <h3>{member.Name}</h3>
                  <h4>{member.Party} ({member.PartyAbbreviation}) Member for {member.MemberFrom}</h4>
                </div>)}
              </div>
          </div>

          <div className="contentBlock centreTitle">
            <h3 className="billTitle">No Tellers</h3>
            {noTellersForRender.map((member, i) =>
              <div key={i} className="individualItem votingMember selected" onClick={() => this.selectMember(member.MemberId)} style={{borderLeft: "0.6em solid #" + member.PartyColour}}>
                <img style={{border: "0.3em solid #" + member.PartyColour}} src={"https://members-api.parliament.uk/api/Members/" + member.MemberId + "/Thumbnail"}></img>
                <h3>{member.Name}</h3>
                <h4>{member.Party} ({member.PartyAbbreviation}) Member for {member.MemberFrom}</h4>
              </div>)}

            <div className="expandable nav centreTitle" onClick={() => this.setState({no: (!this.state.no)})}>
              <h3 className="billTitle">No Voting Members: {division.NoCount}</h3>
              <i className="fa fa-chevron-down"></i>
            </div>
            <div style={noStyle}>
              {noMembersForRender.map((member, i) =>
                <div key={i} className="individualItem votingMember selected" onClick={() => this.selectMember(member.MemberId)} style={{borderLeft: "0.6em solid #" + member.PartyColour}}>
                  <img style={{border: "0.3em solid #" + member.PartyColour}} src={"https://members-api.parliament.uk/api/Members/" + member.MemberId + "/Thumbnail"}></img>
                  <h3>{member.Name}</h3>
                  <h4>{member.Party} ({member.PartyAbbreviation}) Member for {member.MemberFrom}</h4>
                </div>)}
            </div>
          </div>

        </div>
        <Footer/>
      </div>
    );
  }
}

class HoCQuestions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {edmResults: null, search: "", start: null, end: null, skip: 0};
    this.APIcaller("https://oralquestionsandmotions-api.parliament.uk/EarlyDayMotions/list", "search");
  }
  APIcaller(url, endpoint){
    this.responseText = null; // Weird cache issue
    var self = this;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var response = JSON.stringify(JSON.parse(this.responseText));
        if (endpoint === "search"){
          self.setState({edmResults: response});
        }
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
  submitSearch = (event) => {
    event.preventDefault();
    if (this.state.search.trim() !== "" || this.state.search.trim() !== undefined || this.state.search.trim() !== null){
      var url = "https://oralquestionsandmotions-api.parliament.uk/EarlyDayMotions/list?searchTerm=" + this.state.search + "&skip=" + this.state.skip;
      console.log(this.state.start);
      if (this.state.start !== null) {
        url = url + "&tabledStartDate=" + this.state.start.toString();
      }
      if (this.state.end !== null) {
        url = url + "&tabledEndDate=" + this.state.end;
      }
      this.APIcaller(url, "search");
    }
    else{
      throw "There was a problem understanding what you entered. Please try again.";
    }
  }
  changePage(offset, skip, total) {
    if (skip + offset >= 0 && skip + offset <= total) {
      this.state.skip = this.state.skip + offset;
      if (this.state.search.trim() !== "" || this.state.search.trim() !== undefined || this.state.search.trim() !== null){
        var url = "https://oralquestionsandmotions-api.parliament.uk/EarlyDayMotions/list?searchTerm=" + this.state.search + "&skip=" + this.state.skip;
        console.log(this.state.start);
        if (this.state.start !== null) {
          url = url + "&tabledStartDate=" + this.state.start.toString();
        }
        if (this.state.end !== null) {
          url = url + "&tabledEndDate=" + this.state.end;
        }
        this.APIcaller(url, "search");
      }
      else{
        throw "There was a problem understanding what you entered. Please try again.";
      }
    }
  }
  changeSearch = (event) => {
    this.setState({search: event.target.value});
  }
  changeStart = (event) => {
    this.setState({start: event.target.value});
  }
  changeEnd = (event) => {
    this.setState({end: event.target.value});
  }
  selectMotion(id){
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
    ReactDOM.render(<MotionDisplay id={id}/>, document.getElementById('root'));
  }
  render() {
    var edms = JSON.parse(this.state.edmResults);
    var edmsForRender = [];
    if (edms !== null && edms !== undefined){
      var numEdms = edms.Response.length;
      for (var i = 1; i < numEdms; i++){
        edmsForRender[i] = edms.Response[i];
      }
    }
    else {
      return (<p></p>);
    }
    console.log(edms);
    return(
      <div>
        <div>
          <Header/>
        </div>
        <div className="mainContent mainCentral">
          <div className="contentBlock">
            <h3 className="centreTitle">Early Day Motions</h3>

              <form onSubmit={this.submitSearch}>
                <div className="SearchBar">
                  <input className="SearchInput" style={{textAlign: "center", width: "95%"}} type="text" placeholder="Search for an Early Day Motion by title or number... " onChange={this.changeSearch}/>
                  <button className="SearchButton" type="submit"><i className="fa fa-search"></i></button>
                </div>
              </form>

              <p>These are optional parameters which can help you cut down your search to a specific period.</p>
              <div className="SearchBar searchDates">
                <p>Start Date:‌‌ ‌‌ ‌‌ ‌‌ </p><input className="SearchInput dateInput" style={{textAlign: "center", borderRadius: "0.4em 0.4em 0.4em 0.4em"}} type="date" onChange={this.changeStart}/>
                <p>End Date:‌‌ ‌‌ ‌‌ ‌‌ </p><input className="SearchInput dateInput" style={{textAlign: "center", borderRadius: "0.4em 0.4em 0.4em 0.4em"}} type="date" onChange={this.changeEnd}/>
              </div>

          </div>



          <div>
            <p>Page {Math.floor(edms.PagingInfo.Skip / 25) + 1} of {Math.floor(edms.PagingInfo.Total / 25) + 1}</p>
            <div className="centreTitle nav">
              <i className="fa fa-chevron-left" onClick={() => this.changePage(-25, edms.PagingInfo.Skip, edms.PagingInfo.Total)}></i>
              <i className="fa fa-chevron-right" onClick={() => this.changePage(+25, edms.PagingInfo.Skip, edms.PagingInfo.Total)}></i>
            </div>

            {edmsForRender.map((motion, i) =>
                <div className="billResult" onClick={() => this.selectMotion(motion.Id)} key={i}>
                  <h4>{motion.Title}</h4>
                  <span></span>
                  <h5>EDM {motion.UIN}: Tabled on {Formatters.dateHandler(motion.DateTabled)}, {motion.SponsorsCount} Signatures</h5>

                  <div className="sponsor">
                    <img style={{border: "0.3em solid #" + motion.PrimarySponsor.PartyColour}} src={motion.PrimarySponsor.PhotoUrl}></img>
                    <h3>Primary Sponsor: {motion.PrimarySponsor.Name}</h3>
                    <h5>{motion.PrimarySponsor.Party} Member for {motion.PrimarySponsor.Constituency}</h5>
                  </div>


              </div>)}

              <div className="centreTitle nav">
                <i className="fa fa-chevron-left" onClick={() => this.changePage(-25, edms.PagingInfo.Skip, edms.PagingInfo.Total)}></i>
                <i className="fa fa-chevron-right" onClick={() => this.changePage(+25, edms.PagingInfo.Skip, edms.PagingInfo.Total)}></i>
              </div>
              <p>Page {Math.floor(edms.PagingInfo.Skip / 25) + 1} of {Math.floor(edms.PagingInfo.Total / 25) + 1}</p>
          </div>


        </div>
        <Footer/>
      </div>
    );
  }
}

class MotionDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {motionResult: null, viewSignatures: false, viewAmmendments: false};
    this.APIcaller("https://oralquestionsandmotions-api.parliament.uk/EarlyDayMotion/" + this.props.id);
  }
  APIcaller(url, endpoint){
    this.responseText = null; // Weird cache issue
    var self = this;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var response = JSON.stringify(JSON.parse(this.responseText));
        self.setState({motionResult: response});
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }
  selectSponsor(id){
    ReactDOM.unmountComponentAtNode(document.getElementById('root'));
    ReactDOM.render(<MemberDisplay id={id}/>, document.getElementById('root'));
  }
  render() {
    var motion = JSON.parse(this.state.motionResult);
    console.log(motion);
    if (motion === null) {
      return (<p/>);
    }
    var viewSignatures = this.state.viewSignatures ? {display: "block", margin: 0} : {display: "none"};
    var supportersForRender = []; var sponsorsForRender = [];
    if (motion !== null && motion !== undefined){
      for (var i = 1; i < motion.Response.Sponsors.length; i++){
        if (motion.Response.Sponsors[i].SponsoringOrder <= 6) {
          sponsorsForRender[i] = motion.Response.Sponsors[i];
        }
        else {
          supportersForRender[i] = motion.Response.Sponsors[i];
        }
      }
    }
    else {
      return(<p></p>);
    }

    var viewAmmendments = this.state.viewAmmendments ? {display: "block", margin: 0} : {display: "none"};




    return(
      <div>
        <div>
          <Header/>
        </div>
        <div className="mainContent">
          <div className="contentBlock centreTitle">
            <h3>{motion.Response.Title}</h3>
            <h5>EDM {motion.Response.UIN}: Tabled on {Formatters.dateHandler(motion.Response.DateTabled)}</h5>
            <p>{motion.Response.MotionText}</p>
          </div>
          <div className="contentBlock">
            <div className="expandable nav centreTitle" onClick={() => this.setState({viewSignatures: (!this.state.viewSignatures)})}>
              <h3 className="billTitle">Supporters</h3>
              <i className="fa fa-chevron-down"></i>
            </div>
            <div style={viewSignatures} className="items">
              <div className="individualItem votingMember selected" style={{borderLeft: "0.6em solid #" + motion.Response.PrimarySponsor.PartyColour}} onClick={() => this.selectSponsor(motion.Response.PrimarySponsor.MemberId)}>
                <img style={{border: "0.3em solid #" + motion.Response.PrimarySponsor.PartyColour}} src={motion.Response.PrimarySponsor.PhotoUrl}></img>
                <h3>{motion.Response.PrimarySponsor.Name} (Primary Sponsor)</h3>
                <h4>{motion.Response.PrimarySponsor.Party} Member for {motion.Response.PrimarySponsor.Constituency}</h4>
              </div>
              {sponsorsForRender.map((sponsor, i) =>
                <div className="individualItem votingMember selected" style={{borderLeft: "0.6em solid #" + sponsor.Member.PartyColour}} onClick={() => this.selectSponsor(sponsor.MemberId)}>
                  <img style={{border: "0.3em solid #" + sponsor.Member.PartyColour}} src={sponsor.Member.PhotoUrl}></img>
                  <h3>{sponsor.Member.Name} (Sponsor)</h3>
                  <h4>{sponsor.Member.Party} Member for {sponsor.Member.Constituency}</h4>
                </div>
              )}
              {supportersForRender.map((sponsor, i) =>
                <div className="individualItem votingMember selected" style={{borderLeft: "0.6em solid #" + sponsor.Member.PartyColour}} onClick={() => this.selectSponsor(sponsor.MemberId)}>
                  <img style={{border: "0.3em solid #" + sponsor.Member.PartyColour}} src={sponsor.Member.PhotoUrl}></img>
                  <h3>{sponsor.Member.Name} (Supporter)</h3>
                  <h4>{sponsor.Member.Party} Member for {sponsor.Member.Constituency}</h4>
                </div>
              )}
            </div>
          </div>

        </div>
        <Footer/>
      </div>
    );
  }
}

ReactDOM.render(<LandingPage/>, document.getElementById('root'));
