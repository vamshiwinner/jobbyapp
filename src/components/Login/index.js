import {Component} from 'react'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
  }

  onBlurUserName = event => {
    this.setState({username: event.target.value})
  }

  onBlurPassword = event => {
    this.setState({password: event.target.value})
  }

  onClickLoginButton = async () => {
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
    console.log(data.jwt_token)
    console.log(responce)
    if (responce.ok === true) {
      Cookies.set('jwt_token', jwtToken, {expires: 30})
      history.replace('/')
    }
  }

  renderLoginBox = () => (
    <div className="login-box">
      <img
        className="app-logo-image"
        src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
        alt="website logo"
      />
      <div className="input-conatiners">
        <label htmlFor="user-name">USERNAME</label>
        <input
          onBlur={this.onBlurUserName}
          placeholder="Username"
          className="input-ele"
          id="user-name"
        />
      </div>
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

      <button
        onClick={this.onClickLoginButton}
        className="button-login"
        type="button"
      >
        Login
      </button>
    </div>
  )

  render() {
    const {username, password} = this.state
    console.log(username, password)
    return <div className="login-bg-container">{this.renderLoginBox()}</div>
  }
}

export default Login
