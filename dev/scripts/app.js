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
// https://console.firebase.google.com/u/0/project/pocky-65e20/database/pocky-65e20/data/articles

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urlInput: '',
      titleInput: '',
      tagsInput: '',
      articles: [],
      loggedIn: '',
      userId: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleSaved = this.toggleSaved.bind(this);
    this.toggleCompleted = this.toggleCompleted.bind(this);
    this.removeArticle = this.removeArticle.bind(this);
    this.createUser = this.createUser.bind(this);
    this.showCreate = this.showCreate.bind(this);
    this.showLogin = this.showLogin.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.signOut = this.signOut.bind(this);
    this.showReadingList = this.showReadingList.bind(this);
    this.showSplash = this.showSplash.bind(this);
    }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        const userId = user.uid;
        const dbRef = firebase.database().ref(`/users/${user.uid}`);
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
            loggedIn: true,
            userId: userId,
          });
        // there is a user logged in
        })
      } else {
        this.setState({
          notes: [],
          loggedIn: false
        })
      };
  })

    // set state from firebase data 
  }

  render() {
    // console.log(this.state.articles)
    return (
    <div>
      <header className="mainHeader">
        <h1>Pocky</h1>
        <nav>
          {this.state.loggedIn ? 
          <span>
            <span>Logged In</span>
            <a href="#" className="link--nav" onClick={this.signOut}>Sign Out</a>
          </span>
          : <span>
            <a href="#" className="link--nav" onClick={this.showLogin}>Log In</a> 
            <a href="#" className="link--nav" onClick={this.showCreate}>Create Account</a>
          </span> 
          }
        </nav>
      </header>

    
      <div className="modal loginModal" ref={ref => this.loginModal = ref}>
        <h2>Log In Form</h2>
        <a onClick={this.showLogin}><i className="fas fa-times close"></i></a>
        <form action="" onSubmit={this.loginUser}>
          <div>
            <label htmlFor="userEmail">Email: </label>
            <input type="email" name="userEmail" ref={ref => this.userEmail = ref} />
          </div>
          <div>
            <label htmlFor="userPassword">Password: </label>
            <input type="password" name="userPassword" ref={ref => this.userPassword = ref} />
          </div>

          <div>
            <input type="submit" value='Log In' onSubmit={this.showCreate} />
          </div>
        </form>
      </div>

      <div className="modal createUserModal" ref={ref => this.createUserModal = ref}>
          <h2>Create An Account</h2>
          <a onClick={this.showCreate}><i className="fas fa-times close"></i></a>
          <form action="" onSubmit = {e => this.createUser.call(this,e)}>
            <div>
              <label htmlFor="createEmail">Email: </label>
              <input type="email" name="createEmail" ref={ref => this.createEmail = ref}/>
            </div>
            <div>
              <label htmlFor="createPassword">Password: </label>
              <input type="password" name="createPassword" ref={ref => this.createPassword = ref} />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm Password: </label>
              <input type="password" name="confirmPassword" ref={ref => this.confirmPassword = ref} />
            </div>
            <div>
              <input type="submit" value='Create Account' onSubmit={this.createUser}/>
            </div>
          </form>
      </div>

      <main>
        {this.showSplash()}
      </main>
      
      {this.state.loggedIn ? <Sidebar data={this.state.articles}/> : null}

      <footer>
        <div className='wrapper'>Created By Linda Zhao using React and Firebase</div>
      </footer>
    </div>
    
    );
  }

  showSplash() {
    if(this.state.loggedIn) {
      // console.log('user is logged in')
      return (
        // show input form if user is logged in
        <div className="wrapper">
          <div className='inputForm'>
            <h2>Add An Article</h2>
            <form onSubmit={this.handleSubmit}>
              <label htmlFor="urlInput">URL: </label>
              <input name="urlInput" onChange={this.handleChange} type="url" id="urlInput" value={this.state.urlInput} required />

              <label htmlFor="titleInput">Title: </label>
              <input name="titleInput" onChange={this.handleChange} type="text" id="titleInput" value={this.state.titleInput} />

              <label htmlFor="tagsInput">Tags: </label>
              <input name="tagsInput" onChange={this.handleChange} type="text" id="tagsInput" value={this.state.tagsInput} />

              <input onClick={this.handleSubmit} type="submit" value="hit it!" />
            </form>
            {this.showReadingList()}

          </div>
        </div>
      );
    } else {
      console.log('user is NOT logged in, show splash');
      return <SplashPage />
    }

  }

  showReadingList() {
    if(this.state.loggedIn) {
      return (<ReadingList data={this.state.articles} removeArticle={this.removeArticle} toggleSaved={this.toggleSaved} toggleCompleted={this.toggleCompleted} getTagKeys={this.getTagKeys}/>)
    } else if(this.state.loggedIn === false){
      return <h3>Please log in to see notes!</h3>
    } 
  }

  signOut() {
    firebase.auth().signOut();
    this.setState({
      articles: [],
      loggedIn: false.loggedIn,
      userId: '',
    })
  }

  showCreate(e) {
    e.preventDefault();
    this.createUserModal.classList.toggle('show');
    this.setState({
      articles: [],
    })
  }

  createUser(e) {
    e.preventDefault();
    console.log('createUser')
    // this.createUserModal.toggle('show');
    const email = this.createEmail.value;
    const password = this.createPassword.value;
    const confirm = this.confirmPassword.value;
    if (password === confirm) {
      console.log('match! do stuff');
      firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          this.showCreate(e);
          console.log('account created!')
        })
        .catch((err) => {
          alert(err.message);
        })

    } else {
      alert('passwords must match!');
    }
  }

  showLogin(e) {
    e.preventDefault();
    this.loginModal.classList.toggle('show');
    // loginUser(e);
  }

  loginUser(e) {
    e.preventDefault();
    const email = this.userEmail.value;
    const password = this.userPassword.value;
    console.log('Successful login!!');
    firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        this.showLogin(e);

      })
      .catch((err) => {
        alert(err.message);
      })
  }

  handleChange(e) {
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

   
    // save tagsArray in state
    console.log(this.state.tagsInput);
    var re = /\s*,\s*/;
    const tagsArray = this.state.tagsInput.split(re);

    console.log(tagsArray);

    // https://stackoverflow.com/questions/41827019/javascript-whats-the-best-way-convert-array-into-object
    const tagsObj = tagsArray.reduce(function (obj, v) {
      obj[v] = 0;
      return obj;
    }, {});

    console.log(tagsObj);
    const entry = {
      url: this.state.urlInput,
      title: this.state.titleInput,
      tags: tagsObj,
      completed: false,
      saved: false
    }

    // console.log(newState, entry);
    newState.push(entry);
    this.setState({
      urlInput: '',
      titleInput: '',
      tagsInput: '',
      articles: newState,
    });

    // push entry object with url, title, complete to firebase now
    const dbref = firebase.database().ref(`/users/${this.state.userId}`);
    dbref.push(entry);

  }

  // change "saved" of entry object to be true
  toggleSaved(articleToUpdate){
    // console.log(currKey)

    // TO DO Change saved to true
    const currKey = articleToUpdate.key;
    // use firebase .set() method to change 1 value. changed ref as well to be inside an object
    // console.log(currKey)
    const dbref = firebase.database().ref(`/users/${this.state.userId}/${currKey}`);
    // console.log(dbref);
    articleToUpdate.saved = articleToUpdate.saved === true ? false : true;
    // console.log(articleToUpdate.saved);
    // don't put .key into firebase
    // BUG if statement still runs
    if (articleToUpdate.key) {
      delete articleToUpdate.key;
    }
    delete articleToUpdate.key;
    dbref.set(articleToUpdate);

  }

  toggleCompleted(articleToUpdate) {
    console.log('clicked toggle completed');
    const currKey = articleToUpdate.key;

    const dbref = firebase.database().ref(`/users/${this.state.userId}/${currKey}`);
    // console.log(dbref);
    articleToUpdate.completed = articleToUpdate.completed === true ? false : true;

    if (articleToUpdate.key) {
      console.log("deleting key");
      delete articleToUpdate.key;
    }
    delete articleToUpdate.key;
    dbref.set(articleToUpdate);
  }

  removeArticle(currKey) {
    // make new list of articles with index-article removed
    const newArticlesState = Array.from(this.state.articles);
    newArticlesState.splice(currKey,1);
    this.setState ({
      articles: newArticlesState
    })

    // remove item with the id from firebase
    const dbRef = firebase.database().ref(`/users/${this.state.userId}/${currKey}`);
    dbRef.remove();
  }

  getTagKeys(article) {
    const tagsArr = [];

    for (let tag in article.tags) {
      tagsArr.push(tag);
    }

    return tagsArr.map((tag, i) => {
      // console.log(tag)
      return <span className="tagName" key={i}>{tag}</span>;
    })

  }
}

class ReadingList extends React.Component {
  render() {
    return (
      <ul className="readingList">
        <h2>Reading List</h2>
        {/* iterate with map to show all articles */}
        {this.props.data.map((article) => {
          // console.log(Array.from(article.tags));
          return <li className="articleItem" key={article.key}>
            <div className="articleItem__buttons">
              <button className="btn--toggle" onClick={() => this.props.toggleSaved(article)}><i className="fas fa-star"></i></button>
              <button className="btn--toggle" onClick={() => this.props.toggleCompleted(article)}><i className="fas fa-check"></i></button>
            </div>

            <div className="title__box">
              <a className="title__article" href={article.url}>{article.title}</a>
              <p className="tagBox">{article.tags ? this.props.getTagKeys(article) : "no tags"}</p>
            </div>
            <a href="" className="link__delete link__secondary" onClick={() => this.props.removeArticle(article.key)}>Remove
            </a>
            {article.saved ? <i className="fas fa-star saved"></i> : null }
            
          </li>;
        })}
      </ul>
    )
  }
}
// const Tag = (articles) => {
//   return (
//     console.log(articles)
//     {for (let article in articles) {
//       console.log(article);
//     }}
//   )

// }
class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: this.props.data,
    }
    this.findTagName = this.findTagName.bind(this);
  }
  render () {
    return (
      <aside>
        <div className="wrapper">
          <h2>Tag List</h2>          
          {this.findTagName()}
        </div>
      </aside>
    )
  }

  findTagName() {
    const articles = this.state.articles;
    const allTags =[];
    articles.map((articleObj) => {
      // console.log(articleObj.tags);
      for(let tags in articleObj.tags) {
        allTags.push(tags)
      }
    })

    console.log(allTags)
    return <p className="tagBox">{allTags}</p>
  }
}


// ? Not rendering
const SplashPage = () => {
  return (
    <div className="splashScreen">
      <h2>Save blog posts you want to read for later with Pocky!</h2>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('app'));
