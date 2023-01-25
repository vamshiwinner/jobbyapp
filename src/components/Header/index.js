import {Link} from 'react-router-dom'

import './index.css'

const Header = () => (
  <nav>
    <ul className="nav-container">
      <li className="nav-items">
        <img
          className="nav-website-logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt=" website logo"
        />
      </li>
      <li className="nav-items">
        <div className="home-jobs-section">
          <Link to="/">
            <li className="list-home-job">Home</li>
          </Link>
          <Link to="/jobs">
            <li className="list-home-job">Jobs</li>
          </Link>
        </div>
      </li>
      <li className="nav-items">
        <button type="button">Logout</button>
      </li>
    </ul>
  </nav>
)

export default Header
