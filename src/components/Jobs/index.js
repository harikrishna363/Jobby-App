import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Sticky from 'react-stickynode'

import Header from '../Header'
import JobItem from '../JobItem'
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

const jobsApiConstants = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
  noJobs: 'NO_JOBS',
}

const profileApiConstants = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    employmentTypes: [],
    salaryRanges: '',
    searchInput: '',
    jobs: {},
    jobsApiStatus: jobsApiConstants.loading,
    profileApiStatus: profileApiConstants.loading,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  getJobs = async () => {
    const {employmentTypes, salaryRanges, searchInput} = this.state
    const employmentTypeParameter = employmentTypes.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeParameter}&minimum_package=${salaryRanges}&search=${searchInput}`
    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      if (data.total > 0) {
        const formattedData = {
          total: data.total,
          jobs: data.jobs.map(eachItem => ({
            companyLogoUrl: eachItem.company_logo_url,
            employmentType: eachItem.employment_type,
            id: eachItem.id,
            jobDescription: eachItem.job_description,
            location: eachItem.location,
            packagePerAnnum: eachItem.package_per_annum,
            rating: eachItem.rating,
            title: eachItem.title,
          })),
        }
        this.setState({
          jobs: formattedData.jobs,
          jobsApiStatus: jobsApiConstants.success,
        })
      } else {
        this.setState({jobsApiStatus: jobsApiConstants.noJobs})
      }
    } else {
      this.setState({jobsApiStatus: jobsApiConstants.failure})
    }
  }

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const apiUrl = 'https://apis.ccbp.in/profile'
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const formattedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails: formattedData,
        profileApiStatus: profileApiConstants.success,
      })
    } else {
      this.setState({profileApiStatus: profileApiConstants.failure})
    }
  }

  renderProfileLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileSuccessView = () => {
    const {profileDetails} = this.state
    return (
      <div className="profile-container">
        <img
          className="profile-image"
          alt="profile"
          src={profileDetails.profileImageUrl}
        />
        <h1 className="profile-name">{profileDetails.name}</h1>
        <p className="profile-bio">{profileDetails.shortBio}</p>
      </div>
    )
  }

  onRetryProfile = () =>
    this.setState(
      {profileApiStatus: profileApiConstants.loading},
      this.getProfileDetails,
    )

  renderProfileFailureView = () => (
    <button
      onClick={this.onRetryProfile}
      className="profile-retry-btn"
      type="button"
    >
      Retry
    </button>
  )

  renderProfileDetails = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case profileApiConstants.loading:
        return this.renderProfileLoadingView()
      case profileApiConstants.success:
        return this.renderProfileSuccessView()
      case profileApiConstants.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  onSearchInput = event => this.setState({searchInput: event.target.value})

  onSearchIcon = () => this.getJobs()

  updateEmploymentType = employmentTypeId => {
    const {employmentTypes} = this.state
    if (employmentTypes.includes(employmentTypeId)) {
      this.setState(
        prevState => ({
          employmentTypes: prevState.employmentTypes.filter(
            eachType => eachType !== employmentTypeId,
          ),
        }),
        this.getJobs,
      )
    } else {
      this.setState(
        prevState => ({
          employmentTypes: [...prevState.employmentTypes, employmentTypeId],
        }),
        this.getJobs,
      )
    }
  }

  updateSalaryRange = salaryRangeId => {
    const {salaryRanges} = this.state
    if (salaryRanges.includes(salaryRangeId)) {
      this.setState(
        prevState => ({
          salaryRanges: prevState.salaryRanges.filter(
            eachType => eachType !== salaryRangeId,
          ),
        }),
        this.getJobs,
      )
    } else {
      this.setState(
        prevState => ({
          salaryRanges: [...prevState.salaryRanges, salaryRangeId],
        }),
        this.getJobs,
      )
    }
  }

  renderEmploymentTypes = () => (
    <div className="filters-container">
      <h1 className="filter-types-heading">Type of Employment</h1>
      <ul className="filters-ul-container">
        {employmentTypesList.map(eachType => {
          const onCheckbox = () => {
            this.updateEmploymentType(eachType.employmentTypeId)
          }
          return (
            <li
              key={eachType.employmentTypeId}
              className="filter-list-container"
            >
              <input
                id={eachType.label}
                type="checkbox"
                onChange={onCheckbox}
              />
              <label htmlFor={eachType.label}>{eachType.label}</label>
            </li>
          )
        })}
      </ul>
    </div>
  )

  renderSalaryRanges = () => (
    <div className="filters-container">
      <h1 className="filter-types-heading">Salary Range</h1>
      <ul className="filters-ul-container">
        {salaryRangesList.map(eachType => {
          const onCheckbox = () => {
            this.updateSalaryRange(eachType.salaryRangeId)
          }
          return (
            <li key={eachType.salaryRangeId} className="filter-list-container">
              <input id={eachType.label} type="radio" onChange={onCheckbox} />
              <label htmlFor={eachType.label}>{eachType.label}</label>
            </li>
          )
        })}
      </ul>
    </div>
  )

  renderSearchInput = () => {
    const {searchInput} = this.state
    return (
      <div className="search-input-container">
        <input
          placeholder="Search"
          className="jobs-search-input"
          onChange={this.onSearchInput}
          type="search"
          value={searchInput}
        />
        <button
          onClick={this.onSearchIcon}
          className="search-icon-btn"
          type="button"
          data-testid="searchButton"
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderJobs = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case jobsApiConstants.loading:
        return this.renderJobsLoadingView()
      case jobsApiConstants.success:
        return this.renderJobsSuccessView()
      case jobsApiConstants.failure:
        return this.renderJobsFailureView()
      case jobsApiConstants.noJobs:
        return this.renderNoJobsView()
      default:
        return null
    }
  }

  renderJobsLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader
        className="loader"
        type="ThreeDots"
        color="#ffffff"
        height="50"
        width="50"
      />
    </div>
  )

  renderJobsSuccessView = () => {
    const {jobs} = this.state
    return (
      <ul className="jobs-ul-container">
        {jobs.map(eachJob => (
          <JobItem key={eachJob.id} job={eachJob} />
        ))}
      </ul>
    )
  }

  renderNoJobsView = () => (
    <div className="no-jobs-container">
      <img
        className="no-jobs-image"
        alt="no jobs"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
      />
      <h1 className="nojobs-heading">No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters.</p>
    </div>
  )

  renderJobsFailureView = () => (
    <div className="jobs-failure-view-container">
      <img
        className="jobs-failure-imaage"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        onClick={this.onRetryJobs}
        className="jobs-retry-btn"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  onRetryJobs = () =>
    this.setState({jobsApiStatus: jobsApiConstants.loading}, this.getJobs)

  render() {
    return (
      <div className="jobs-bg-container">
        <Sticky>
          <Header />
        </Sticky>

        <div className="jobs-content-container">
          <div className="mobile-search-input-container">
            {this.renderSearchInput()}
          </div>
          <div className="profile-filters-container">
            {this.renderProfileDetails()}
            <hr />
            {this.renderEmploymentTypes()}
            <hr />
            {this.renderSalaryRanges()}
          </div>

          <div className="jobs-display-container">
            <div className="desktop-search-input-container">
              {this.renderSearchInput()}
            </div>

            {this.renderJobs()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
