import React from 'react'

const LoadPosts = () => {
  return (
    <div className="post-loading">
      <div className="upper-sect-loading">
        <div className="img-loading-div"></div>
        <div className="username-displayname-loading-div">
          <div className="username-loading"></div>
          <div className="displayname-loading"></div>
        </div>
      </div>

      <div className="middle-sect-loading"></div>

      <div className="lower-sect-loading">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default LoadPosts