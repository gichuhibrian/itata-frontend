import React from 'react'
import axiosInstance from "../../helpers/axios";
import { FormGroup, Label, Input, Form, Button} from 'reactstrap'
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import isLoggedIn from "../../helpers/isLoggedIn";
import { Redirect } from 'react-router-dom'


const loginform = {
    width: '100%',
    maxWidth: '330px',
    padding: '15px',
    height: '100%',
    display: 'inline-block'
}

toast.configure()
class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            token: '',
            loading: false,
            toastNotice : ''
        }
    }
    notifyError() {
        toast.error(this.state.toastNotice)
    }
    notifyInfo() {
        toast.info(this.state.toastNotice)
    }
    handleFormSubmit(event) {
        event.preventDefault()
        const { history } = this.props
        let email = this.state.email
        let password = this.state.password
        axiosInstance.post('/login', { email, password }).then((response) => {
            this.setState({
                token: response.data,
                toastNotice : 'Loading page'
            })
            this.notifyInfo()
            localStorage.setItem('token', this.state.token)
            history.push('/admin')
        }).catch((error) => {
            if(error.response)
            {
                this.setState({
                    toastNotice : 'Invalid login credentials'
                })
                this.notifyError()
                history.push('/login')
            }
        })
    }

    render() {
        if(isLoggedIn()) {
            return <Redirect to="/admin" />
        }
        const { username, password} = this.state
        return (
            <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                    <div className="col-10 col-md-8 col-lg-6">
                        <Form className="form-example" style={loginform} onSubmit={event => this.handleFormSubmit(event)}>
                            <h1>
                            <span className="font-weight-bold text-center">Itata Fresh</span> Ltd
                            </h1>
                            <h2 className="text-center">Welcome</h2>
                            <FormGroup className="form-group">
                                <Label for="email">Email:</Label>
                                <Input type="email" className="form-control username" id="email"
                                       placeholder="Email..." name="email"
                                       value={ username }
                                       onChange = {
                                           event => this.setState({email: event.target.value})
                                       } />
                            </FormGroup>
                            <FormGroup className="form-group">
                                <Label for="password">Password:</Label>
                                <Input type="password" className="form-control password" id="password"
                                       placeholder="Password..." name="password"
                                       value ={ password }
                                       onChange={event => this.setState({ password: event.target.value})} />
                            </FormGroup>
                            <Button className="btn btn-primary btn-customized">Login</Button>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

export default LoginPage