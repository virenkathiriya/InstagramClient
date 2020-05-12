import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../../store/actions/index';
import Spinner from '../../../components/UI/Spinner/Spinner'
import {Redirect} from 'react-router-dom'
import Post from "./Post/Post";
import './Posts.css';

class Posts extends Component {
    componentDidMount() {
        this.props.onFetchPosts(this.props.token, this.props.userId);
    }

    state = {
        hashtag: '',
        accountName: '',
        currentPage: 1,
        postsPerPage: 5,
        date: ''
    }

    onChangeFilterHandler = (e) => {
        e.preventDefault();
        let hashtag = document.getElementById('hashtag').value;
        let AccountName = document.getElementById('accountName').value;
        let date = document.getElementById('date').value;
        this.setState({hashtag: hashtag, accountName: AccountName, date: date});
        console.log('hashtag:' + hashtag);
        console.log('AccountName:' + AccountName);
        console.log('Date:' + date);
    }

    paginate = pageNumber => this.setState({currentPage: pageNumber});

    render() {
        let spinner = null;
        let posts = null;
        let redirect = null;
        let error = null;
        if (this.props.loading) {
            spinner = <Spinner/>;
        }
        if (!this.props.isAuthenticated) {
            redirect = <Redirect to="/auth"/>
        }
        if (this.props.error) {
            error = (
                <p>{error}</p>
            );
        }

        let pageNumbers = [], currentPosts, postsRev;

        if (this.props.isAuthenticated && !this.props.loading) {
            postsRev = [...this.props.posts];
            postsRev.reverse();

            if(this.state.hashtag.length !== 0 || this.state.accountName.length !== 0 || this.state.date.length !== 0) {
                console.log('hi');
                postsRev = postsRev.filter(post => {
                    return ((post.hashtags.includes(this.state.hashtag) || this.state.hashtag.length === 0 )
                        && (post.name.includes(this.state.accountName) || this.state.accountName.length === 0)
                        && (post.createdAt.includes(this.state.date) || this.state.date.length === 0));
                });
            }
            if(postsRev.length > 5) {
                const indexOfLastPost = Math.min(this.state.currentPage * this.state.postsPerPage, 10000);
                const indexOfFirstPost = ((this.state.currentPage - 1) * this.state.postsPerPage);
                currentPosts = postsRev.slice(indexOfFirstPost, indexOfLastPost);

                for (let i = 1; i <= Math.ceil(postsRev.length / this.state.postsPerPage); i++) {
                    pageNumbers.push(i);
                }

                posts = currentPosts.map(post => {
                    return (
                        <Post
                            key={post.id}
                            imageURL={post.imageURL}
                            name={post.name}
                            hashtags={post.hashtags}
                            createdAt={post.createdAt}
                            post={post}
                        />
                    );
                });
            }else{
                posts = postsRev.map(post => {
                    return (
                        <Post
                            key={post.id}
                            imageURL={post.imageURL}
                            name={post.name}
                            hashtags={post.hashtags}
                            createdAt={post.createdAt}
                            post={post}
                        />
                    );
                });
            }
        }

        let filter = (
            <div style={{margin: '0 auto', width: '1100px'}}>
                <hr/>
                <label>By HashTags: &nbsp;</label>
                <input name="hashtag" type="text" id='hashtag'/>&nbsp;&nbsp;
                <label>By Account: &nbsp;</label>
                <input name="account" type="text" id='accountName'/>&nbsp;&nbsp;
                <label>By Date Of Creation: &nbsp;</label>
                <input name="date" type="text" id='date'/>&nbsp;&nbsp;
                <button onClick={(e) => this.onChangeFilterHandler(e)}> Apply </button>
                <hr/>
            </div>
        );

        let pagination = null;
        if((this.props.isAuthenticated && !this.props.loading) && postsRev.length > 5) {
            pagination = (<nav style={{textAlign: 'center' ,width: '100px', margin: '0 auto'}}>
                <ul className='pagination'>
                    {pageNumbers.map(number => (
                        <li key={number} className={(this.state.currentPage === number) ? 'page-item active' : 'page-item'}>
                            <a onClick={() => this.paginate(number)} className='page-link'>
                                {number}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>);
        }

        return (
            <div>
                {redirect}
                {spinner}
                {error}
                {filter}
                {posts}
                {pagination}
            </div>
        );
    };
};

const mapStateToProps = state => {
    return {
        posts: state.post.posts,
        loading: state.post.loading,
        token: state.auth.token,
        userId: state.auth.userId,
        isAuthenticated: state.auth.token !== null,
        error: state.post.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchPosts: (token, userId) => dispatch(actions.fetchPosts(token, userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
