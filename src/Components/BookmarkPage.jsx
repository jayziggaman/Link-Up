import React from 'react'
import UserPfp from './GENERAL-COMPONENTS/UserPfp'
import VerifiedBadge from './GENERAL-COMPONENTS/VerifiedBadge'


const BookmarkPage = ({ bookmark }) => {
  const { id, username, displayName, userType, followers, following, posts } = bookmark
  
  return (
    <a href={`/${username}`} className="page-bookmark">
        
      <div className="bookmark-profile-username">
        <h3>
          {displayName}
          {userType === 'creator' && <VerifiedBadge fontSize={`1.25rem`} /> }
        </h3>
        <p> @{username} </p>
      </div>

      <div className="bookmark-profile-pfp">
        <UserPfp user={bookmark} />
      </div>


      <div className="bookmark-followers-following-div">
        <div className="followers-following">
          <div className="followers">
            <h1>{followers.value?.length || 0}</h1>
            <p>Followers</p>
          </div>

          <div className="following">
            <h1> {following.value?.length || 0} </h1>
            <p>Following</p>
          </div>

          <div className="posts">
            <h1>{posts.value?.length} </h1>
            <p>Posts</p>
          </div>
        </div>

        <div className="followers-following-after">
          {/* <button className='follow-btn'
            style={followers.value.find(follower => follower === userAuth) ? { backgroundColor: 'black', color: 'white' } : { backgroundColor: 'white', color: 'black' }} >
            {followers.value.find(follower => follower === userAuth) ? 'unfollow' : 'follow' }
          </button> */}

          {/* <button >

          state={currentUserPage}
              to={routeTo.current} */}
            {/* <Link to={id}>
              Go To Page
            </Link>
          </button> */}
          
        </div>
      </div>
    </a>
  )
}

export default BookmarkPage