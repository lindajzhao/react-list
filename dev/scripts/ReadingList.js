import React from 'react';


class ReadingList extends React.Component {
    render() {
        return (
            <ul className="readingList">
                <div className="wrapper">
                    <h2>Reading List</h2>
                    {/* iterate with map to show all articles */}
                    {this.props.data.map((article) => {
                        // console.log(Array.from(article.tags));
                        return (<li className="articleItem" key={article.key}>
                            <div className="articleItemBox">
                                <a className="title__article articleItem--title" href={article.url} target="_blank">{article.title}</a>

                                <button className="btn--toggle btn--complete" onClick={(e) => this.props.toggleCompleted(article, e)}><i className="fas fa-check"></i></button>

                                {/* <p className="tagBox">{article.tags ? this.props.getTagKeys(article) : "no tags"}</p> */}
                                <p className="tagBox">
                                    {this.props.getTagKeys(article).map((tag, i) => {
                                        return (<span className="tagName" key={i}>{tag}</span>);
                                    })}
                                </p>

                                <button className="btn--toggle btn--save" onClick={(e) => this.props.toggleSaved(article, e)}><i className="fas fa-star"></i></button>
                            </div>
                            <a href="#" className="link__delete link__secondary" onClick={() => this.props.removeArticle(article.key)}>Remove</a>
                            {/*
              {article.saved ? <i className="fas fa-star saved"></i> : null }
               */}
                        </li>);
                    }).reverse()}
                </div>
            </ul>
        )
    }
}

export default ReadingList;