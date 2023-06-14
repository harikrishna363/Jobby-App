import {BsStarFill, BsFillBagFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Sticky from 'react-stickynode'
import {VscLinkExternal} from 'react-icons/vsc'

import Header from '../Header'
import './index.css'

const jobItemDetailsApiConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class JobItemDetails extends Component {
  state = {
    jobItemDetails: {},
    jobItemDetailsApiStatus: jobItemDetailsApiConstants.loading,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const formattedData = {
        jobDetails: {
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          employmentType: data.job_details.employment_type,
          id: data.job_details.id,
          jobDescription: data.job_details.job_description,
          skills: data.job_details.skills.map(eachItem => ({
            imageUrl: eachItem.image_url,
            name: eachItem.name,
          })),
          lifeAtCompany: {
            description: data.job_details.life_at_company.description,
            imageUrl: data.job_details.life_at_company.image_url,
          },
          location: data.job_details.location,
          packagePerAnnum: data.job_details.package_per_annum,
          rating: data.job_details.rating,
        },
        similarJobs: data.similar_jobs.map(eachItem => ({
          companyLogoUrl: eachItem.company_logo_url,
          employmentType: eachItem.employment_type,
          id: eachItem.id,
          jobDescription: eachItem.job_description,
          location: eachItem.location,
          rating: eachItem.rating,
          title: eachItem.title,
        })),
      }
      this.setState({
        jobItemDetails: formattedData,
        jobItemDetailsApiStatus: jobItemDetailsApiConstants.success,
      })
    } else {
      this.setState({
        jobItemDetailsApiStatus: jobItemDetailsApiConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => {
    const {jobItemDetails} = this.state
    const {jobDetails} = jobItemDetails
    return (
      <>
        <div className="jobItem-container">
          <div className="company-role-container">
            <img
              className="company-logo"
              alt="job details company logo"
              src={jobDetails.companyLogoUrl}
            />
            <div className="role-rating-container">
              <h1 className="job-title">{jobDetails.title}</h1>
              <div className="rating-container">
                <BsStarFill className="rating-star" />
                <p>{jobDetails.rating}</p>
              </div>
            </div>
          </div>
          <div className="location-salary-container">
            <div className="location-jobtype-container">
              <div className="location-container">
                <MdLocationOn className="location-icon" />
                <p>{jobDetails.location}</p>
              </div>
              <div className="jobType-container">
                <BsFillBagFill className="bag-icon" />
                <p>{jobDetails.employmentType}</p>
              </div>
            </div>
            <p>{jobDetails.packagePerAnnum}</p>
          </div>
          <hr className="horizontal-line" />
          <div className="description-container">
            <h1 className="jobItemDetails-heading">Description</h1>
            <a
              className="anchor-link"
              href={jobDetails.companyWebsiteUrl}
              target="_blank"
              rel="noreferrer"
            >
              Visit
              <VscLinkExternal className="visit-link-image" />
            </a>
          </div>
          <p className="jobItemDetails-description">
            {jobDetails.jobDescription}
          </p>
          <h1 className="jobItemDetails-heading">Skills</h1>
          <ul className="skill-ul-container">
            {jobDetails.skills.map(eachSkill => (
              <li key={eachSkill.name} className="skill-li-container">
                <img
                  className="skill-image"
                  alt={eachSkill.name}
                  src={eachSkill.imageUrl}
                />
                <p>{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="jobItemDetails-heading">Life At Company</h1>
          <div className="lifeAtCompany-container">
            <p className="jobItemDetails-description">
              {jobDetails.lifeAtCompany.description}
            </p>
            <img
              className="lifeAtCompany-image"
              alt="life at company"
              src={jobDetails.lifeAtCompany.imageUrl}
            />
          </div>
        </div>
        <h1 className="jobItemDetails-heading similar-job-heading">
          Similar Jobs
        </h1>{' '}
        <ul className="similar-job-ul-container">
          {jobItemDetails.similarJobs.map(eachItem => (
            <li key={eachItem.id} className="similar-job-container">
              <div className="company-role-container">
                <img
                  className="company-logo"
                  alt="similar job company logo"
                  src={eachItem.companyLogoUrl}
                />
                <div className="role-rating-container">
                  <h1 className="job-title">{eachItem.title}</h1>
                  <div className="rating-container">
                    <BsStarFill className="rating-star" />
                    <p>{eachItem.rating}</p>
                  </div>
                </div>
              </div>
              <h1 className="description-heading">Description</h1>
              <p className="jobItemDetails-description">
                {eachItem.jobDescription}
              </p>
              <div className="location-salary-container">
                <div className="location-jobtype-container">
                  <div className="location-container">
                    <MdLocationOn className="location-icon" />
                    <p>{eachItem.location}</p>
                  </div>
                  <div className="jobType-container">
                    <BsFillBagFill className="bag-icon" />
                    <p>{eachItem.employmentType}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  onRetryJobItemDetails = () =>
    this.setState(
      {jobItemDetailsApiStatus: jobItemDetailsApiConstants.loading},
      this.getJobDetails,
    )

  renderFailureView = () => (
    <div className="jobItemDeatils-failure-view-container">
      <img
        className="jobItemDetails-failure-image"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      />
      <h1 className="jobItemDetails-failure-heading">
        Oops! Something Went Wrong
      </h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        onClick={this.onRetryJobItemDetails}
        className="jobItem-retry-btn"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderJobItemDetails = () => {
    const {jobItemDetailsApiStatus} = this.state
    switch (jobItemDetailsApiStatus) {
      case jobItemDetailsApiConstants.loading:
        return this.renderLoadingView()
      case jobItemDetailsApiConstants.success:
        return this.renderSuccessView()
      case jobItemDetailsApiConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="jobItemDetails-bg-container">
        <Sticky>
          <Header />
        </Sticky>
        <div className="jobItemDetails-container">
          {this.renderJobItemDetails()}
        </div>
      </div>
    )
  }
}

export default JobItemDetails
