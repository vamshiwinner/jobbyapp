import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {AiOutlineSearch, AiFillStar, AiFillEnvironment} from 'react-icons/ai'
import {FaBriefcase} from 'react-icons/fa'

import Cookies from 'js-cookie'

import Header from '../Header'

import './index.css'

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
//

class Jobs extends Component {
  state = {
    isLoading: true,

    isProfileLoading: true,
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
      this.setState({jobsList: updateData, isLoading: false})
    }
  }

  getProfile = async () => {
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
    const updateProfile = {
      name: data.profile_details.name,
      profileImageUrl: data.profile_details.profile_image_url,
      shortBio: data.profile_details.short_bio,
    }
    console.log(updateProfile)
    this.setState({profileData: updateProfile, isProfileLoading: false})
  }

  renderEmploymentTypes = () => {
    const {profileData, onChangeEmployment} = this.state

    const onClickRadio = event => {
      this.setState({isLoading: true})
      this.setState({minimumPackage: event.target.value}, this.getJobs)
    }

    const onClickCheckBox = event => {
      this.setState({isLoading: true})
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
          <p>Type of Employment</p>
        </li>
        {employmentTypesList.map(eachType => (
          <li className="employment-type-list-item">
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
        <p>Salary Range</p>
        {salaryRangesList.map(eachRange => (
          <li className="employment-type-list-item">
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
          <p>we could not find any jobs. try another filters</p>
        </div>
      )
    }
    return (
      <ul className="jobs-ul-conatiner">
        {jobsList.map(eachJob => (
          <li className="job-item-container">
            <div className="logo-title-container">
              <img
                className="company-logo"
                src={eachJob.companyLogoUrl}
                alt="logo"
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

  render() {
    const {isLoading, searchInput, isProfileLoading, jobsList} = this.state

    const filterdJobs = jobsList.filter(eachJob =>
      eachJob.title.toLowerCase().includes(searchInput.toLowerCase()),
    )

    return (
      <div className="jobs-bg-container">
        <Header />
        <div className="container-items">
          <div className="filters-container">
            {isProfileLoading
              ? this.loadingProfileView()
              : this.renderEmploymentTypes()}
          </div>
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
            {isLoading ? this.loadingView() : this.renderProfiles(filterdJobs)}
          </div>
        </div>
      </div>
    )
  }
}
export default Jobs
