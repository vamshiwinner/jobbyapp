import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiFillStar, AiFillEnvironment} from 'react-icons/ai'
import {FaBriefcase} from 'react-icons/fa'
import {BsBoxArrowUpRight} from 'react-icons/bs'

import './index.css'
import Header from '../Header'

const apiJobDetailsStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    apiJobDetailsStatus: apiJobDetailsStatusConstants.initial,
    jobDetails: '',
    similarJobs: '',
  }

  componentDidMount() {
    this.getJobDetails()
  }

  apiSuccessView = data => {
    console.log(data)
    const jobDetails = {
      companyLogoUrl: data.job_details.company_logo_url,
      companyWebsiteUrl: data.job_details.company_website_url,
      employmentType: data.job_details.employment_type,
      id: data.job_details.id,
      jobDescription: data.job_details.job_description,
      lifeAtCompany: data.job_details.life_at_company,
      location: data.job_details.location,
      packagePerAnnum: data.job_details.package_per_annum,
      rating: data.job_details.rating,
      skills: data.job_details.skills,
      title: data.job_details.title,
    }
    const similarJobs = data.similar_jobs
    console.log(similarJobs)
    console.log(jobDetails)
    this.setState({
      apiJobDetailsStatus: apiJobDetailsStatusConstants.success,
      jobDetails,
      similarJobs,
    })
  }

  getJobDetails = async () => {
    this.setState({
      apiJobDetailsStatus: apiJobDetailsStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.apiSuccessView(data)
    } else {
      this.setState({apiJobDetailsStatus: apiJobDetailsStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderSuccesJobDetailsView = () => {
    const {jobDetails, similarJobs} = this.state
    console.log(jobDetails, similarJobs)

    return (
      <div className="jobDetails-success-container">
        <Header />
        <div className="job-detail-container">
          <div className="job-box">
            <div className="logo-title-container">
              <img
                className="company-logo"
                src={jobDetails.companyLogoUrl}
                alt="company logo"
              />
              <div>
                <h1 className="company-heading">{jobDetails.title}</h1>
                <div className="rating-section">
                  <AiFillStar className="star-icon" />
                  <p className="rating-pera">{jobDetails.rating}</p>
                </div>
              </div>
            </div>
            <div className="location-lpa-section">
              <div className="location-type-section">
                <div className="location-logo icons">
                  <AiFillEnvironment />
                  <p>{jobDetails.location}</p>
                </div>
                <div className="location-logo">
                  <FaBriefcase />
                  <p>{jobDetails.employmentType}</p>
                </div>
              </div>
              <p>{jobDetails.packagePerAnnum}</p>
            </div>
            <hr className="hr-line" />
            <div className="heading-visit">
              <h1 className="heading">Description</h1>

              <a
                target="_blank"
                rel="noreferrer"
                href={jobDetails.companyWebsiteUrl}
                className="icon-visit"
              >
                <p>Visit</p>
                <BsBoxArrowUpRight />
              </a>
            </div>
            <p>{jobDetails.jobDescription}</p>
            <h1 className="heading">Skills</h1>
            <ul className="ul-skill-container">
              {jobDetails.skills.map(eachSkill => (
                <li className="skill-list" key={eachSkill.name}>
                  <img
                    className="skill-image"
                    src={eachSkill.image_url}
                    alt="skill"
                  />
                  <p>{eachSkill.name}</p>
                </li>
              ))}
            </ul>
            <h1 className="heading">Life At Company</h1>
            <div className="life-at-company-image">
              <p>{jobDetails.lifeAtCompany.description}</p>
              <img src={jobDetails.lifeAtCompany.image_url} alt="life" />
            </div>
          </div>
          <ul className="similar-jobs-ul">
            {similarJobs.map(eachSimilarJob => (
              <li className="similar-job-list ">
                {' '}
                <div className="logo-title-container">
                  <img
                    className="company-logo"
                    src={eachSimilarJob.company_logo_url}
                    alt="company logo"
                  />
                  <div>
                    <h1 className="company-heading">{eachSimilarJob.title}</h1>
                    <div className="rating-section">
                      <AiFillStar className="star-icon" />
                      <p className="rating-pera">{eachSimilarJob.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="location-lpa-section">
                  <div className="location-type-section">
                    <div className="location-logo icons">
                      <AiFillEnvironment />
                      <p>{eachSimilarJob.location}</p>
                    </div>
                    <div className="location-logo">
                      <FaBriefcase />
                      <p>{eachSimilarJob.employmentType}</p>
                    </div>
                  </div>
                  <p>{eachSimilarJob.packagePerAnnum}</p>
                </div>
                <hr className="hr-line" />
                <h1 className="description-heading">Description</h1>
                <p>{eachSimilarJob.job_description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  onClickRetry = () => {
    this.setState(
      {apiJobDetailsStatus: apiJobDetailsStatusConstants.inProgress},
      this.getJobDetails,
    )
  }

  renderFailureView = () => (
    <div className="failure-bg-container">
      <Header />
      <div className="failure-container-job-details">
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
    </div>
  )

  render() {
    const {apiJobDetailsStatus} = this.state
    switch (apiJobDetailsStatus) {
      case apiJobDetailsStatusConstants.success:
        return this.renderSuccesJobDetailsView()
      case apiJobDetailsStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiJobDetailsStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }
}

export default JobItemDetails
