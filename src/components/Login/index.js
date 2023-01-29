import {Component} from 'react'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    isErrmessage: false,
    errmessage: '',
  }

  onBlurUserName = event => {
    this.setState({username: event.target.value})
  }

  onBlurPassword = event => {
    this.setState({password: event.target.value})
  }

  onClickLoginButton = async event => {
    event.preventDefault()
    const {history} = this.props
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const responce = await fetch(url, options)
    const data = await responce.json()
    const jwtToken = data.jwt_token

    if (responce.ok === true) {
      Cookies.set('jwt_token', jwtToken, {expires: 30})
      history.replace('/')
    } else {
      console.log(data.error_msg)
      this.setState({isErrmessage: true, errmessage: data.error_msg})
    }
  }

  renderLoginBox = () => {
    const {isErrmessage, errmessage} = this.state

    return (
      <div className="login-box">
        <img
          className="app-logo-image"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
        <form onSubmit={this.onClickLoginButton} className="input-conatiners">
          <label htmlFor="user-name">USERNAME</label>
          <input
            onBlur={this.onBlurUserName}
            placeholder="Username"
            className="input-ele"
            id="user-name"
          />

          <div className="input-conatiners">
            <label htmlFor="password">PASSWORD</label>
            <input
              onBlur={this.onBlurPassword}
              placeholder="Password"
              className="input-ele"
              id="password"
              type="password"
            />
          </div>

          <button className="button-login" type="submit">
            Login
          </button>
        </form>
        {isErrmessage && <p className="err-msg">*{errmessage}</p>}
      </div>
    )
  }

  render() {
    const {username, password, isErrmessage, errmessage} = this.state
    console.log(username, password, isErrmessage, errmessage)
    return <div className="login-bg-container">{this.renderLoginBox()}</div>
  }
}

export default Login
