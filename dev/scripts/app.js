import React from 'react';
import ReactDOM from 'react-dom';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyADX1sZbJYq0Hbd8Wf-ehtajqPXOOEbJH0",
  authDomain: "pocky-65e20.firebaseapp.com",
  databaseURL: "https://pocky-65e20.firebaseio.com",
  projectId: "pocky-65e20",
  storageBucket: "",
  messagingSenderId: "807377881048"
};
firebase.initializeApp(config);


class InputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urlInput: '',
      titleInput: '',
      articles: ['one thing']
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  render() {
    console.log(this.state.articles)
    return <div className="inputForm">
        <p>PROJECT 5!</p>
        <p>~Input Form Object starts here~</p>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="urlInput">URL: </label>
          <input name="urlInput" onChange={this.handleChange} type="text" id="urlInput" value={this.state.urlInput} />

          <label htmlFor="titleInput">Title: </label>
          <input name="titleInput" onChange={this.handleChange} type="text" id="titleInput" value={this.state.titleInput} />
          <input onClick={this.handleSubmit} type="submit" value="hit it!" />
        </form>

        <ReadingList data={this.state.articles}/>
      </div>;
  }

  handleChange(e){
    // console.log(e);
    // console.log(e.target.id);
    // console.log(e.target.value);
    this.setState({
      [e.target.id] : e.target.value
    });
  }

  handleSubmit(e){
    e.preventDefault();
    // console.log(e);
    // new object!
    const newState = Array.from(this.state.articles);
    const entry = { 
      url : this.state.urlInput, 
      title : this.state.titleInput, 
      completed: false 
    }

    // console.log(newState, entry);
    newState.push(entry);
    // push entry object with url, title, complete to firebase now
    const dbref = firebase.database().ref("/articles");
    dbref.push(newState);

    this.setState({ 
      urlInput: '',
      titleInput: '',
      articles: newState
    });
  }
}

class ReadingList extends React.Component {
  render(props) {
    console.log(props);
    return (
      <ul className="readingList">
        {/* <li>{props.data}</li> */}
        {/* passing through props? */}
        {/* {props.data.map((article, i) => {
          return (<li key={i} >
              <a href="{article.url}">{article.title}</a>
            </li>)
        })} */}
      </ul>
    )
  }
}

// class ArticleItem extends React.Component {
//   render() {
//     return (
//       <div>Article Item Object here</div>
//     )
//   }
// }

class TagList extends React.Component {
  render() {
    return (
      <div></div>
    )
  }
}


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputUrl: "",
      inputTitle: ""
    };
    // this.updateForm = this.updateForm.bind(this);
  }
  render() {
    return (
      <div>
        <InputForm />
        {/* <ReadingList /> */}

      </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
