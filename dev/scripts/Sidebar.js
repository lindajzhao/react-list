
import React from 'react';


class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: this.props.data,
        }
        this.findTagName = this.findTagName.bind(this);
    }
    render() {
        return (
            <aside>
                <div className="wrapper">
                    <h2>Tag List</h2>
                    {this.findTagName().map((tag, i) => {
                        return (<p className="tagBanner" key={i}>{tag}</p>)
                    })}
                </div>
            </aside>
        )
    }

    findTagName() {
        const articles = this.state.articles;
        const allTags = [];
        articles.map((articleObj) => {
            // console.log(articleObj.tags);
            for (let tags in articleObj.tags) {
                allTags.push(tags)
            }
        })

        return allTags;
    }
}

export default Sidebar;