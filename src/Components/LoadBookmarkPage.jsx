import React from 'react'

const LoadBookmarkPage = () => {
  return (
    <div className="profile-upper-loading">
      <div className="profile-upper-upper-loading">
        <div className="profile-img-loading"></div>
        <div className="profile-followers-following-loading">
          <div className='followers-loading'>
            <div></div>
            <div></div>
          </div>
          <div className='following-loading'>
            <div></div>
            <div></div>
          </div>
          <div className='posts-loading'>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>

      {/* <div className="profile-upper-lower-loading">
        <div></div>
        <div></div>
      </div> */}
    </div>
  )
}

export default LoadBookmarkPage