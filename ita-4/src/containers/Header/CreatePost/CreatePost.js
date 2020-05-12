import React, {Component} from 'react';
import Button from "../../../components/UI/Button/Button";
import Input from "../../../components/UI/Input/Input";
import classes from './CreatePost.css';
import {connect} from 'react-redux';

import {updatedObject, checkValidity} from '../../../shared/utility';
import axios from 'axios';
import {Redirect} from "react-router-dom";

class CreatePost extends Component {
    state = {
        createPostForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-Mail'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            hashtags: {
                elementType: 'textarea',
                elementConfig: {
                    type: 'text',
                    placeholder: 'add hashtags with #_HASHTAG_'
                },
                value: '',
                valid: true,
            }
        },
        formIsValid: false,
        loading: false,
        imageURL: null,
        finish: false
    };

    uploadImage = async e => {
        e.preventDefault();
        const files = e.target.files

        const data = new FormData()
        data.append('file', files[0])
        data.append('upload_preset', 'instaApp')
        this.setState({loading: true});
        const res = await fetch('https://api.cloudinary.com/v1_1/do8ljwuhy/image/upload',
            {
                method: 'POST',
                body: data
            }
        )
        const file = await res.json()

        this.setState({imageURL: file.secure_url});

        console.log("generated URL: " + this.state.imageURL);
        this.setState({loading: false});
    }

    postSubmitHandler = async event => {
        event.preventDefault();

        const formData = {};
        console.log(this.state.createPostForm.post);
        for (let formElementIdentifier in this.state.createPostForm) {
            formData[formElementIdentifier] = this.state.createPostForm[formElementIdentifier].value;
        }
        let today = new Date();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
        formData['imageURL'] = this.state.imageURL;
        formData['createdAt'] = today.toLocaleDateString("en-US", options) + ' ' + time;
        formData['userId'] = localStorage.getItem('userId');
        const response = await axios.post('https://instaapp-f2238.firebaseio.com/posts.json?auth=' + localStorage.getItem('token'), formData);
        console.log(response);
        if(response.status === 200) {
            this.setState({finish: true})
        }
    };

    inputChangedHandler = (event, inputIdentifier) => {

        const updatedFormElement = updatedObject(this.state.createPostForm[inputIdentifier], {
            value: event.target.value,
            valid: checkValidity(
                event.target.value,
                this.state.createPostForm[inputIdentifier].validation
            ),
            touched: true
        });

        const updatedCreatePostForm = updatedObject(this.state.createPostForm, {
            [inputIdentifier]: updatedFormElement
        });

        let formIsValid = true;
        for (let inputIdentifier in updatedCreatePostForm) {
            formIsValid =
                updatedCreatePostForm[inputIdentifier].valid &&
                formIsValid;
        }
        this.setState({
            createPostForm: updatedCreatePostForm,
            formIsValid: formIsValid
        });
    };

    render() {
        const formElementsArray = [];
        for (let key in this.state.createPostForm) {
            formElementsArray.push({
                id: key,
                config: this.state.createPostForm[key]
            });
        }

        let form = (
            <form onSubmit={this.postSubmitHandler}>
                {/*<form>*/}
                {formElementsArray.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={
                            formElement.config
                                .elementType
                        }
                        elementConfig={
                            formElement.config
                                .elementConfig
                        }
                        value={formElement.config.value}
                        invalid={
                            !formElement.config
                                .valid
                        }
                        shouldValidate={
                            formElement.config
                                .validation
                        }
                        touched={
                            formElement.config
                                .touched
                        }
                        changed={event =>
                            this.inputChangedHandler(
                                event,
                                formElement.id
                            )
                        }
                    />
                ))}
                <Input
                    elementType='file'
                    elementConfig={{
                        type: 'file',
                        placeholder: 'Upload YOur File.'
                    }}
                    invalid={false}
                    shouldvalidate={false}
                    changed={this.uploadImage}/>
                <Button
                    btnType='Success'
                    disabled={!this.state.formIsValid}>
                    POST
                </Button>
            </form>
        );

        let authRedirect = null;
        if (!this.props.isAuthenticated) {
            authRedirect = (<Redirect to='/auth'/>);
        }
        let image = null;
        if (this.state.loading === false && this.state.imageURL !== null) {
            image = <div style={{margin: '0 auto', width: '500px'}}>
                <img style={{width: '100%', height:'100%'}} src={this.state.imageURL} alt="Uploading..."/>
            </div>
        }
        let wait = null;
        if(this.state.loading){
            wait = <div style={{margin: '0 auto', width: '500px'}}>
                <p style={{textalign: 'center'}}> Uploading...</p>
            </div>
        }
        let finish = null;
        if(this.state.finish) {
            finish = <Redirect to="/" />
        }
        return (
            <div>
                {finish}
                {authRedirect}
                {image}
                {wait}
                <div className={classes.CreatePost}>
                    {form}
                </div>
            </div>
        );
    };
};

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
}

export default connect(mapStateToProps)(CreatePost);
