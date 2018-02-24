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


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urlInput: '',
      titleInput: '',
      articles: [],
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleSaved = this.toggleSaved.bind(this);
    this.toggleCompleted = this.toggleCompleted.bind(this);
    this.removeArticle = this.removeArticle.bind(this);
  }

  componentDidMount() {
    const dbRef = firebase.database().ref('/articles');
    dbRef.on('value', (response) => {
      // console.log(response.val())
      const data = response.val();
      // response.val() returns as an object. Must take out each object in response object and put it into an array with for/in loop
      const newState = [];
      for(let key in data) {
        /* 
        -data[key] -- object in array
        -.key -- add new key property in array
        -=key -- property of key is the generated key
        */
        data[key].key = key
        // console.log(key, data);
        newState.push(data[key]);
      }
      // console.log(newState);

      this.setState ({
        articles: newState,
      })
    })

    // set state from firebase data 
  }

  render() {
    // console.log(this.state.articles)
    return <main className="inputForm">
       <div className='wrapper'>
          <p>PROJECT 5!</p>
          <h2>Add An Article</h2>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="urlInput">URL: </label>
            <input name="urlInput" onChange={this.handleChange} type="url" id="urlInput" value={this.state.urlInput} required />
  
            <label htmlFor="titleInput">Title: </label>
            <input name="titleInput" onChange={this.handleChange} type="text" id="titleInput" value={this.state.titleInput} />
            <input onClick={this.handleSubmit} type="submit" value="hit it!" />
          </form>

          <ReadingList data={this.state.articles} removeArticle={this.removeArticle} toggleSaved={this.toggleSaved} toggleCompleted={this.toggleCompleted}/>

          <Sidebar />
       </div>

      </main>;
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
      completed: false,
      saved: false
    }

    // console.log(newState, entry);
    newState.push(entry);
    this.setState({
      urlInput: '',
      titleInput: '',
      articles: newState
    });
    // push entry object with url, title, complete to firebase now
    const dbref = firebase.database().ref("/articles");
    dbref.push(entry);

  }

  // change "saved" of entry object to be true
  toggleSaved(articleToUpdate){
    // console.log(currKey)

    // TO DO Change saved to true
    const currKey = articleToUpdate.key;
    // use firebase .set() method to change 1 value. changed ref as well to be inside an object
    // console.log(currKey)
    const dbref = firebase.database().ref(`/articles/${currKey}`);
    // console.log(dbref);
    articleToUpdate.saved = articleToUpdate.saved === true ? false : true;
    // console.log(articleToUpdate.saved);
    // don't put .key into firebase
    // BUG if statement still runs
    if (articleToUpdate.key) {
      console.log("deleting key");
      delete articleToUpdate.key;
    }
    delete articleToUpdate.key;
    dbref.set(articleToUpdate);

  }

  toggleCompleted(currItem) {
    console.log('clicked toggle completed', currItem);
    // console.log

  }

  removeArticle(currKey) {
    // make new list of articles with index-article removed
    const newArticlesState = Array.from(this.state.articles);
    newArticlesState.splice(currKey,1);
    this.setState ({
      articles: newArticlesState
    })

    // remove item with the id from firebase
    const dbRef = firebase.database().ref(`articles/${currKey}`);
    dbRef.remove();

  }
}

class ReadingList extends React.Component {
  render() {
    return (
      <ul className="readingList">
        <h2>Reading List</h2>
        {/* iterate with map to show all articles */}
        {this.props.data.map((article) => {
          return <li key={article.key}>
            <button onClick={() => this.props.toggleSaved(article)}><i className="fas fa-star"></i></button>
            <button onClick={() => this.props.toggleCompleted(article)}>Done!
            </button>
            <a href={article.url}>{article.title}</a>
            <button onClick={() => this.props.removeArticle(article.key)}>Remove
            </button>
            {article.saved ? <i className="fas fa-star saved"></i> : null }
            
            {/* <input type="checkbox" name="star" defaultChecked={article.saved}/> */}
          </li>;
        })}
      </ul>
    )
  }
}

class Sidebar extends React.Component {
  render() {
    return (
      <div>Tag List</div>
    )
  }
}


class Page extends React.Component {
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
        <App />
        {/* <ReadingList /> */}

      </div>)
  }
}

ReactDOM.render(<Page />, document.getElementById('app'));
