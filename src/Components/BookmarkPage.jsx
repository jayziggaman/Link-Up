import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { appContext } from '../App'
import verifiedBadge from '../Images/verified-badge.jpg'


const BookmarkPage = ({ bookmark }) => {
  const {userAuth, setShowVerifiedMessage, showVerifiedMessage} = useContext(appContext)
  
  return (
    <Link to={bookmark?.id} className="page-bookmark">
        
      <div className="bookmark-profile-username">
        <h3>
          {bookmark?.displayName}
          {bookmark.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} alt="" onClick={() => {
            setShowVerifiedMessage(!showVerifiedMessage)
          }}/> }
        </h3>
        <p> @{bookmark?.username} </p>
      </div>

      <div className="bookmark-profile-pfp">
        <img src={bookmark?.avatarUrl} alt="" />
      </div>


      <div className="bookmark-followers-following-div">
        <div className="followers-following">
          <div className="followers">
            <h1>{bookmark?.followers.value?.length || 0}</h1>
            <p>Followers</p>
          </div>

          <div className="following">
            <h1> {bookmark?.following.value?.length || 0} </h1>
            <p>Following</p>
          </div>

          <div className="posts">
            <h1>{bookmark?.posts.value?.length} </h1>
            <p>Posts</p>
          </div>
        </div>

        <div className="followers-following-after">
          {/* <button className='follow-btn'
            style={bookmark?.followers.value.find(follower => follower === userAuth) ? { backgroundColor: 'black', color: 'white' } : { backgroundColor: 'white', color: 'black' }} >
            {bookmark?.followers.value.find(follower => follower === userAuth) ? 'unfollow' : 'follow' }
          </button> */}

          {/* <button >

          state={currentUserPage}
              to={routeTo.current} */}
            {/* <Link to={bookmark?.id}>
              Go To Page
            </Link>
          </button> */}
          
        </div>
      </div>
    </Link>
  )
}

export default BookmarkPage