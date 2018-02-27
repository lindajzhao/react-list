import React from 'react';

const Header= (props) => {
    return(
        <header className="mainHeader">
            <h1>Pocky</h1>
            <nav>
                {props.loggedIn ?
                    <span>
                        <span>You Are Logged In!</span>
                        <a href="#" className="link--nav link--btn" onClick={props.signOut}>Sign Out</a>
                    </span>
                    : <span>
                        <a href="#" className="link--nav link--btn" onClick={props.showLogin}>Log In</a>
                        <a href="#" className="link--nav link--btn" onClick={props.showCreate}>Create Account</a>
                    </span>
                }
            </nav>
        </header>
    )
}


export default Header;