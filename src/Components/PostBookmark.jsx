import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { appContext } from '../App'

const PostBookmark = ({ post }) => {
  const { users } = useContext(appContext)
  
  return (
    <>
      {
        post.value.type === 'Text' &&
        <div className='post-bookmark'>
          <Link>
            <div className="post-bookmark-upper">
              <div className="post-bookmark-img-div">
                <img src={users.find(person => person.id === post.value.creator).avatarUrl} alt="" className="post-bookmark-img"/>
              </div>

              <div className="post-bookmark-username-displayname">
                <p>
                  @{users.find(person => person.id === post.value.creator).username}
                </p>
                <p>
                  {users.find(person => person.id === post.value.creator).displayName}
                </p>
              </div>
                
              <div className="post-bookmark-options">
                <div></div>
                <div></div>
                <div></div>
              </div>
                
            </div>
              
            <div className="post-bookmark-lower">
              <pre>
                {post.value.body}
              </pre>
            </div>
          </Link>
        </div>
      }


      {
        post.value.type === 'Picture-Media' &&
        <Link className='post-bookmark'>
          <div className="post-bookmark-upper">
            <div className="post-bookmark-img-div">
              <img src={users.find(person => person.id === post.value.creator).avatarUrl} alt="" className="post-bookmark-img"/>
            </div>

            <div className="post-bookmark-username-displayname">
              @ {users.find(person => person.id === post.value.creator).username}
              {users.find(person => person.id === post.value.creator).displayName}
            </div>
          </div>
          <div className="post-bookmark-lower">
            {post.value.body}
          </div>
        </Link>
      }

      {
        post.value.type === 'Video-Media' &&
        <Link className='post-bookmark'>
          <div className="post-bookmark-upper">
            <div className="post-bookmark-img-div">
              <img src={users.find(person => person.id === post.value.creator).avatarUrl} alt="" className="post-bookmark-img"/>
            </div>

            <div className="post-bookmark-username-displayname">
              @ {users.find(person => person.id === post.value.creator).username}
              {users.find(person => person.id === post.value.creator).displayName}
            </div>
          </div>
          <div className="post-bookmark-lower">
            {post.value.body}
          </div>
        </Link>
      }
    </>
    
  )
}

export default PostBookmark