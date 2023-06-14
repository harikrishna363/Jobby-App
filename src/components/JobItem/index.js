import {Link} from 'react-router-dom'
import {BsStarFill, BsFillBagFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const JobItem = props => {
  const {job} = props

  return (
    <Link to={`/jobs/${job.id}`} className="job-link">
      <li className="job-item-container">
        <div className="company-role-container">
          <img
            className="company-logo"
            alt="company logo"
            src={job.companyLogoUrl}
          />
          <div className="role-rating-container">
            <h1 className="job-title">{job.title}</h1>
            <div className="rating-container">
              <BsStarFill className="rating-star" />
              <p>{job.rating}</p>
            </div>
          </div>
        </div>
        <div className="location-salary-container">
          <div className="location-jobtype-container">
            <div className="location-container">
              <MdLocationOn className="location-icon" />
              <p>{job.location}</p>
            </div>
            <div className="jobType-container">
              <BsFillBagFill className="bag-icon" />
              <p>{job.employmentType}</p>
            </div>
          </div>
          <p>{job.packagePerAnnum}</p>
        </div>
        <hr className="horizontal-line" />
        <h1 className="description-heading">Description</h1>
        <p>{job.jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
