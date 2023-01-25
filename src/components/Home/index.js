import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <>
    <div className="home-bg-container">
      <Header />
      <div className="home-context-container">
        <h1 className="heading">Find The Job That Fits Your Life</h1>
        <p className="pera">
          Millions of people are searching for jobs, salary information,company
          reviews.Find the job that fits your abilities and potential.
        </p>
        <Link className="link-item" to="/jobs">
          <button className="button-find-jobs" type="button">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </>
)

export default Home
