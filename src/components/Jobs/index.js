import {Component} from 'react'
import {AiOutlineSearch} from 'react-icons/ai'

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

class Jobs extends Component {
  renderEmplymentTypes = () => (
    <ul>
      <li className="list">
        <img
          src="https://assets.ccbp.in/frontend/react-js/profile-bg.png"
          alt="profile"
        />
        <li className="list">
          <hr className="hr-line" />
        </li>
        <p>Type of Employment</p>
      </li>
      {employmentTypesList.map(eachType => (
        <li className="employment-type-list-item">
          <input value={eachType.employmentTypeId} id="input" type="checkbox" />
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

  renderProfiles = () => <div>hii</div>

  render() {
    return (
      <div className="jobs-bg-container">
        <Header />
        <div className="container-items">
          <div className="filters-container">{this.renderEmplymentTypes()}</div>
          <div className="profile-container">
            <div>
              <input className="search-input" type="search" />
              <button className="button" type="button">
                <AiOutlineSearch />
              </button>
            </div>
            {this.renderProfiles()}
          </div>
        </div>
      </div>
    )
  }
}
export default Jobs
