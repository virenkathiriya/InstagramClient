import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

class Post extends Component {

    deleteHandler = (post) => {
        console.log("hello");
        if(post.userId !== this.props.userId){
            alert('You Can Only Delete Your Own Post!');
            return;
        }
        console.log(post.id);
        axios.delete('https://instaapp-f2238.firebaseio.com/posts/' + post.id + '.json?auth=' + this.props.token).then( res => {
                console.log(res);
                alert('Succesfully Deleted!')
            }).catch(err => {
                console.log(err);
                console.log('error occured.');
        });
    }

    render() {
        return (
            <div>
                <div className="card" style={
                    {width: '40%', height: '40%', margin: '0 auto', backgroundColor: '#E8E8E8'}
                }>
                    <img src={this.props.imageURL} className="card-img-top" alt="..."/>
                    <div className="card-body">
                        <b>{this.props.name}</b>
                        <p style={{
                            color: 'blue'
                        }}>{this.props.hashtags}</p>
                        {this.props.createdAt}
                    </div>
                    <button className="btn btn-danger" onClick={() => this.deleteHandler(this.props.post)}>Delete</button>
                </div>
                <hr style={{width: '50%', textAlign: 'center', marginLeft: '25%'}} />

            </div>

        );
    };
};

const mapStateToProps = state => {
    return {
        userId: state.auth.userId,
        token: state.auth.token
    }
}

export default connect(mapStateToProps)(Post);
