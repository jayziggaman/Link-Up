import React, { useContext, useState } from 'react'
import { appContext } from '../App'
import verifiedBadge from '../Images/verified-badge.jpg'

const FriendsList = ({ result, handleSelected, remove }) => {
  const {users} = useContext(appContext)
  const [user, setUser] = useState(users.find(user => user.id === result))
  

  return (
    <div className="friends-list" onClick={() => handleSelected(user)}>
      <div className="search-result-img-div">
        <img src={user?.avatarUrl} alt="" />
      </div>
      <div className="search-result-username">
        <p>@{user?.username} {user.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} />} . {user?.followers.value?.length} {user?.followers.value?.length === 1 ? 'Follower' : 'Followers' }</p>
        <p> {user?.displayName} </p>
      </div>
    </div>
  )
}

export default FriendsList