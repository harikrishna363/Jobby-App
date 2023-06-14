import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    loginErrorMessage: '',
    showErrorMessage: false,
  }

  loginStatus = () => {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      const {history} = this.props
      history.replace('/')
    }
  }

  updateUsername = event => this.setState({username: event.target.value})

  updatePassword = event => this.setState({password: event.target.value})

  loginSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  loginFailure = errorMessage =>
    this.setState({loginErrorMessage: errorMessage, showErrorMessage: true})

  onLoginBtn = async event => {
    event.preventDefault()
    this.setState({showErrorMessage: false})
    const {username, password} = this.state
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const apiUrl = 'https://apis.ccbp.in/login'
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.loginSuccess(data.jwt_token)
    } else {
      this.loginFailure(data.error_msg)
    }
  }

  render() {
    this.loginStatus()
    const {username, password, loginErrorMessage, showErrorMessage} = this.state
    return (
      <div className="login-bg-container">
        <form className="login-card-container" onSubmit={this.onLoginBtn}>
          <img
            className="login-page-website-logo"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          />
          <label className="login-label" htmlFor="username">
            USERNAME
          </label>
          <input
            id="username"
            value={username}
            onChange={this.updateUsername}
            className="login-page-input"
            placeholder="Username"
            type="text"
          />
          <label className="login-label" htmlFor="password">
            PASSWORD
          </label>
          <input
            id="password"
            value={password}
            onChange={this.updatePassword}
            className="login-page-input"
            placeholder="Password"
            type="password"
          />
          <button className="login-btn" type="submit">
            Login
          </button>
          {showErrorMessage && (
            <p className="login-error-msg">*{loginErrorMessage}</p>
          )}
        </form>
        <p>
          *Try with this sample credentials <br />
          Username: rahul, Password: rahul@2021
        </p>
      </div>
    )
  }
}

export default Login
