import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { appContext } from '../App'
import verifiedBadge from '../Images/verified-badge.jpg'

const StoryList = ({viewer}) => {
  const {users} = useContext(appContext)
  const [user, setUser] = useState(users.find(user => user.id === viewer))

  return (
    <Link to={`/${user?.id}`} className="friends-list">
      <div className="search-result-img-div">
        <img src={user?.avatarUrl} alt="" />
      </div>
      <div className="search-result-username">
        <p>
          @{user?.username} 
          {user?.userType === 'creator' && <img className='story-verified-badge' src={verifiedBadge} alt="" />}
        </p>
        <p> {user?.displayName} </p>
      </div>
    </Link>
  )
}

export default StoryList