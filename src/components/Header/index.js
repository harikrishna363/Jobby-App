import {Link, withRouter} from 'react-router-dom'
import {HiHome} from 'react-icons/hi'
import {BsFillBagFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onLogoutBtn = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav className="navbar-container">
      <ul className="nav-menu">
        <Link to="/">
          <li>
            <img
              className="navbar-website-logo"
              alt="website logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            />
          </li>
        </Link>
        <div className="home-job-container">
          <Link to="/">
            <li className="desktop-nav-link">Home</li>
            <HiHome className="mobile-nav-link home-nav-link" />
          </Link>
          <Link to="/jobs">
            <li className="desktop-nav-link">Jobs</li>
            <BsFillBagFill className="mobile-nav-link jobs-nav-link" />
          </Link>
        </div>
        <li>
          <button
            className="desktop-logout"
            type="button"
            onClick={onLogoutBtn}
          >
            Logout
          </button>
          <FiLogOut onClick={onLogoutBtn} className="mobile-logout" />
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
