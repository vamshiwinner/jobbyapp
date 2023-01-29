import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {AiOutlineSearch, AiFillStar, AiFillEnvironment} from 'react-icons/ai'
import {FaBriefcase} from 'react-icons/fa'

import Cookies from 'js-cookie'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
const apiStatusConstantsProfile = {
  initialProfile: 'INITIAL',
  successProfile: 'SUCCESS',
  failureProfile: 'FAILURE',
  inProgressProfile: 'IN_PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
// https://apis.ccbp.in/jobs?employment_type=FULLTIME,PARTTIME&minimum_package=1000000&search=
//  {isLoading ? this.loadingView() : }

class Jobs extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,

    apiStatusProfile: apiStatusConstantsProfile.initialProfile,
    minimumPackage: '',
    searchInput: '',
    jobsList: [],
    profileData: {},
    onChangeEmployment: [],
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {onChangeEmployment, minimumPackage, searchInput} = this.state
    const changedEmployment = onChangeEmployment.join()

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${changedEmployment}&minimum_package=${minimumPackage}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const responce = await fetch(url, options)
    const data = await responce.json()
    console.log(responce)

    if (responce.ok === true) {
      const updateData = data.jobs.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
        location: eachJob.location,
      }))
      this.setState({
        jobsList: updateData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getProfile = async () => {
    this.setState({apiStatus: apiStatusConstantsProfile.inProgressProfile})
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const responce = await fetch(url, options)
    const data = await responce.json()
    console.log(responce)
    if (responce.ok === true) {
      const updateProfile = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileData: updateProfile,
        apiStatusProfile: apiStatusConstantsProfile.successProfile,
      })
    }
    if (responce.status === 400) {
      this.setState({
        apiStatusProfile: apiStatusConstantsProfile.failureProfile,
      })
    }
  }

  renderEmploymentTypes = () => {
    const {profileData, onChangeEmployment} = this.state

    const onClickRadio = event => {
      this.setState({apiStatus: apiStatusConstants.inProgress})
      this.setState({minimumPackage: event.target.value}, this.getJobs)
    }

    const onClickCheckBox = event => {
      this.setState({apiStatus: apiStatusConstants.inProgress})
      const newType = [...onChangeEmployment, event.target.value]

      this.setState({onChangeEmployment: newType}, this.getJobs)
    }
    return (
      <ul>
        <li className="list">
          <div className="list-image">
            <img
              className="profile-logo"
              src={profileData.profileImageUrl}
              alt="profile"
            />
            <h1 className="profile-heading">{profileData.name}</h1>
            <p className="profile-pera">{profileData.shortBio}</p>
          </div>
          <li className="list">
            <hr className="hr-line" />
          </li>
          <h1>Type of Employment</h1>
        </li>
        {employmentTypesList.map(eachType => (
          <li key={eachType.id} className="employment-type-list-item">
            <input
              onClick={onClickCheckBox}
              value={eachType.employmentTypeId}
              id="input"
              type="checkbox"
            />
            <label htmlFor="input">{eachType.label}</label>
          </li>
        ))}
        <li className="list">
          <hr className="hr-line" />
        </li>
        <h1>Salary Range</h1>
        {salaryRangesList.map(eachRange => (
          <li
            key={eachRange.salaryRangeId}
            className="employment-type-list-item"
          >
            <input
              onClick={onClickRadio}
              name="salary range"
              value={eachRange.salaryRangeId}
              id="input"
              type="radio"
            />
            <label htmlFor="input">{eachRange.label}</label>
          </li>
        ))}
      </ul>
    )
  }

  renderProfiles = jobsList => {
    if (jobsList.length === 0) {
      return (
        <div className="no-jobs">
          <img
            className="no-jobs-image"
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png "
            alt="no jobs"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters</p>
        </div>
      )
    }
    return (
      <ul className="jobs-ul-conatiner">
        {jobsList.map(eachJob => (
          <Link to={`/jobs/${eachJob.id}`}>
            {' '}
            <li className="job-item-container">
              <div className="logo-title-container">
                <img
                  className="company-logo"
                  src={eachJob.companyLogoUrl}
                  alt="company logo"
                />
                <div>
                  <h1 className="company-heading">{eachJob.title}</h1>
                  <div className="rating-section">
                    <AiFillStar className="star-icon" />
                    <p className="rating-pera">{eachJob.rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-lpa-section">
                <div className="location-type-section">
                  <div className="location-logo icons">
                    <AiFillEnvironment />
                    <p>{eachJob.location}</p>
                  </div>
                  <div className="location-logo">
                    <FaBriefcase />
                    <p>{eachJob.employmentType}</p>
                  </div>
                </div>
                <p>{eachJob.packagePerAnnum}</p>
              </div>
              <hr className="hr-line" />
              <h1 className="description-heading">Description</h1>
              <p>{eachJob.jobDescription}</p>
            </li>
          </Link>
        ))}
      </ul>
    )
  }

  loadingProfileView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  loadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onBlurSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickRetry = () => {
    this.setState({apiStatus: apiStatusConstants.inProgress}, this.getJobs)
  }

  failureView = () => (
    <div className="failure-container">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button onClick={this.onClickRetry} type="button">
        Retry
      </button>
    </div>
  )

  resultView = filterdJobs => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfiles(filterdJobs)
      case apiStatusConstants.inProgress:
        return this.loadingView()
      case apiStatusConstants.failure:
        return this.failureView()

      default:
        return null
    }
  }

  failureViewProfile = () => (
    <div>
      <button type="button">Retry</button>
    </div>
  )

  resultProfileView = () => {
    const {apiStatusProfile} = this.state

    switch (apiStatusProfile) {
      case apiStatusConstantsProfile.successProfile:
        return this.renderEmploymentTypes()
      case apiStatusConstantsProfile.inProgressProfile:
        return this.loadingProfileView()
      case apiStatusConstantsProfile.failureProfile:
        return this.failureViewProfile()

      default:
        return null
    }
  }

  render() {
    const {searchInput, jobsList} = this.state

    const filterdJobs = jobsList.filter(eachJob =>
      eachJob.title.toLowerCase().includes(searchInput.toLowerCase()),
    )
    console.log(filterdJobs)

    return (
      <div className="jobs-bg-container">
        <Header />
        <div className="container-items">
          <div className="filters-container">{this.resultProfileView()}</div>
          <div className="profile-container">
            <div>
              <input
                onBlur={this.onBlurSearch}
                placeholder="search"
                className="search-input"
                type="search"
              />
              <button className="button" type="button">
                <AiOutlineSearch className="search-icon" />
              </button>
            </div>
            {this.resultView(filterdJobs)}
          </div>
        </div>
      </div>
    )
  }
}
export default Jobs
