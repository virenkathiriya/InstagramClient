import React from 'react';
import './Header.css';
import {Route, NavLink, withRouter, Switch} from "react-router-dom";
import Posts from "./Posts/Posts";
import CreatePost from "./CreatePost/CreatePost";
import Analytics from "./Analytics/Analytics";
import logo from './download.png';
import Auth from "./Auth/Auth";
import Logout from '../Header/Auth/Logout/Logout'
import {connect} from 'react-redux';

class Header extends React.Component {
    render() {
        return (
            <div className="Header">
                <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                    <div className='container-fluid'>
                        <div className='navbar-header' style={{width: '50px'}}>
                            <a className="navbar-left"><img style={{height: '50%', width: '50%'}} src={logo}
                                                            alt="Instagram"/></a>
                        </div>
                        <div className='collapse navbar-collapse' id='navbarNav'>
                            <ul className='navbar-nav'>
                                <li className='nav-item'>
                                    <NavLink className='nav-link' to='/' exact> Home </NavLink>
                                </li>
                                <li className='nav-item'>
                                    <NavLink className='nav-link' to='/create' exact> Create </NavLink>
                                </li>
                                <li className='nav-item'>
                                    <NavLink className='nav-link' to='/analytics' exact> Analytics </NavLink>
                                </li>

                            </ul>
                        </div>
                        <ul className="nav navbar-nav navbar-right">
                            <li className='nav-item'>
                                <NavLink className='nav-link'
                                         to={(!this.props.isAuthenticated) ? '/auth' : '/logout'}
                                         exact> {(!this.props.isAuthenticated) ? "Authenticate" : "Logout"} </NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>
                <Switch>
                    <Route path="/" exact component={Posts}/>
                    <Route path="/auth" exact component={Auth}/>
                    <Route path="/logout" component={Logout}/>
                    <Route path="/create" exact component={CreatePost}/>
                    <Route path="/analytics" exact component={Analytics}/>
                </Switch>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    };
}

export default withRouter(connect(mapStateToProps, null)(Header));
