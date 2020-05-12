import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

class Analytics extends Component {
    render() {
        let analytics = {}, analticsArray = [];

        let redirect = null;
        if(this.props.token === null){
            redirect = <Redirect to="/auth"/>
        }
        if (this.props.posts) {
            this.props.posts.map(post => {
                let name = post.name;
                analytics[name] = 0;
                return true;
            });

            this.props.posts.map(post => {
                let name = post.name;
                analytics[name] += 1;
                return true;
            });

            Object.keys(analytics).forEach((key) => {
                analticsArray.push({
                    name: key,
                    contribution: analytics[key]
                })
            });
        }

        let analyticsComponent = <li className="list-group-item">Nothing To Show!</li>;
        if (this.props.posts) {
            analyticsComponent = analticsArray.map(user => {
                return <li className="list-group-item" key={user.name}>{user.name} : {user.contribution} contribution</li>
            })
        }
        return (
            <div style={{width: '500px', margin: '0 auto'}}>
                {redirect}
                <ul className="list-group">
                    {analyticsComponent}
                </ul>
            </div>);
    };
};

const mapStateToProps = state => {
    return {
        posts: state.post.posts,
        token: state.auth.token
    }
}

export default connect(mapStateToProps, null)(Analytics);
