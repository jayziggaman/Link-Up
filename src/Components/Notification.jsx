import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { appContext } from '../App'
import verifiedBadge from '../Images/verified-badge.jpg'

const Notification = ({ noti }) => {
  const { users, allPosts, userAuth, storyType, followStory, user } = useContext(appContext)
  const [diff, setDiff] = useState()

  const time = new Date()
  const location = useLocation()

  useEffect(() => {
    if (noti) {
      setDiff(time.getTime() - noti.sentAt)
    }
  }, [noti])


  if (noti.type === 'post-tag') {
    const post = allPosts.find(post => post.id === noti.value)
    const creator = users.find(user => user.id === noti.taggedBy)
    if (creator?.id !== userAuth) {
      return (
        <div className='notification' >
          <Link to={creator?.id} className='noti-img-div'>
            <img src={creator?.avatarUrl} alt="" />
          </Link>
    
          <Link to={`/post/${post?.id}`}>
            <b> {`@${creator?.username} `}
              {creator.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} />}
            </b> mentioned you in a post.
            <span className="noti-sentAt">
              {diff <= 60000 && `${Math.floor(diff / 1000)}s`}

              {diff <= 3600000 && diff > 60000 && `${Math.floor(diff / 60000)}m`}

              {diff > 3600000 && `${Math.floor(diff / 3600000)}h`}
            </span>
          </Link>
        </div>
      )
    }
    
  } else if (noti.type === 'comment-tag') {
    const post = allPosts.find(post => post.id === noti.postId)
    const comment = post.comments.value.find(comment => comment.id === noti.value)
    const creator = users.find(user => user.id === noti?.taggedBy)
    if (creator.id !== userAuth) {
      return (
        <div className='notification' >
          <Link to={creator?.id} className='noti-img-div'>
            <img src={creator?.avatarUrl} alt="" />
          </Link>
    
          <Link to={`/post/${post?.id}/comments/${comment?.id}`}>
            <b>
              {`@${creator?.username} `}
              {creator.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} />}
            </b> mentioned you in a comment.
            <span className="noti-sentAt">
              {diff <= 60000 && `${Math.floor(diff / 1000)}s`}

              {diff <= 3600000 && diff > 60000 && `${Math.floor(diff / 60000)}m`}

              {diff > 3600000 && `${Math.floor(diff / 3600000)}h`}
            </span>
          </Link>
        </div>
      )
    }

  } else if (noti.type === 'reply-tag') {
    const post = allPosts.find(post => post.id === noti.postId)
    const comment = post.comments.value.find(comment => comment.id === noti.commentId)
    const reply = comment.replies.value.find(reply => reply.id === noti.value)
    const creator = users.find(user => user.id === noti?.taggedBy)
    if (creator.id !== userAuth) {
      return (
        <div className='notification'>
          <Link to={creator?.id} className='noti-img-div'>
            <img src={creator?.avatarUrl} alt="" />
          </Link>
    
          <Link to={`/post/${post?.id}/comments/${comment?.id}/replies/${reply?.id}`}>
            <b>
              {`@${creator?.username} `}
              {creator.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} />}
            </b> mentioned you in a reply.
            <span className="noti-sentAt">
              {diff <= 60000 && `${Math.floor(diff / 1000)}s`}

              {diff <= 3600000 && diff > 60000 && `${Math.floor(diff / 60000)}m`}

              {diff > 3600000 && `${Math.floor(diff / 3600000)}h`}
            </span>
          </Link>
        </div>
      )
    }

  } else if (noti.type === 'post-like') {
    const post = allPosts.find(post => post.id === noti.value)
    const creator = users.find(user => user.id === noti.likedBy)
    if (noti.likedBy !== userAuth) {
      return (
        <div className='notification' >
          <Link to={creator?.id} className='noti-img-div'>
            <img src={creator?.avatarUrl} alt="" />
          </Link>
    
          <Link to={`/post/${post?.id}`}>
            <b>
              {`@${creator?.username} `}
              {creator?.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} />}
            </b> liked your post.
            <span className="noti-sentAt">
              {diff <= 60000 && `${Math.floor(diff / 1000)}s`}

              {diff <= 3600000 && diff > 60000 && `${Math.floor(diff / 60000)}m`}

              {diff > 3600000 && `${Math.floor(diff / 3600000)}h`}
            </span>
          </Link>
        </div>
      )
    }
    
  } else if (noti.type === 'comment-like') {
    const post = allPosts.find(post => post.id === noti.postId)
    const comment = post.comments.value.find(comment => comment.id === noti.value)
    const creator = users.find(user => user.id === noti.likedBy)
    if (noti.likedBy !== userAuth) {
      return (
        <div className='notification' >
          <Link to={creator?.id} className='noti-img-div'>
            <img src={creator?.avatarUrl} alt="" />
          </Link>
    
          <Link to={`/post/${post?.id}/comments/${comment?.id}`}>
            <b>
              {`@${creator?.username} `}
              {creator?.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} />}
            </b> liked your comment.
            <span className="noti-sentAt">
              {diff <= 60000 && `${Math.floor(diff / 1000)}s`}

              {diff <= 3600000 && diff > 60000 && `${Math.floor(diff / 60000)}m`}

              {diff > 3600000 && `${Math.floor(diff / 3600000)}h`}
            </span>
          </Link>
        </div>
      )
    }
    
  } else if (noti.type === 'reply-like') {
    const post = allPosts.find(post => post.id === noti.postId)
    const comment = post.comments.value.find(comment => comment.id === noti.commentId)
    const reply = comment.replies.value.find(reply => reply.id === noti.value)
    const creator = users.find(user => user.id === noti.likedBy)
    if (noti.likedBy !== userAuth) {
      return (
        <div className='notification' >
          <Link to={creator?.id} className='noti-img-div'>
            <img src={creator?.avatarUrl} alt="" />
          </Link>
    
          <Link to={`/post/${post?.id}/comments/${comment?.id}/replies/${reply?.id}`}>
            <b>
              {`@${creator?.username} `}
              {creator?.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} />}
            </b> liked your reply.
            <span className="noti-sentAt">
              {diff <= 60000 && `${Math.floor(diff / 1000)}s`}

              {diff <= 3600000 && diff > 60000 && `${Math.floor(diff / 60000)}m`}

              {diff > 3600000 && `${Math.floor(diff / 3600000)}h`}
            </span>
          </Link>
        </div>
      )
   }

  } else if (noti.type === 'post-reply') {
    const post = allPosts.find(post => post.id === noti.value)
    const creator = users.find(user => user.id === noti.repliedBy)
    if (noti.repliedBy !== userAuth) {
      return (
        <div className='notification' >
          <Link to={creator?.id} className='noti-img-div'>
            <img src={creator?.avatarUrl} alt="" />
          </Link>
    
          <Link to={`/post/${post?.id}`}>
            <b>
              {`@${creator?.username} `}
              {creator?.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} />}
            </b> commented on your post.
            <span className="noti-sentAt">
              {diff <= 60000 && `${Math.floor(diff / 1000)}s`}

              {diff <= 3600000 && diff > 60000 && `${Math.floor(diff / 60000)}m`}

              {diff > 3600000 && `${Math.floor(diff / 3600000)}h`}
            </span>
          </Link>
        </div>
      )
    }

  } else if (noti.type === 'comment-reply') {
    const post = allPosts.find(post => post.id === noti.postId)
    const comment = post.comments.value.find(comment => comment.id === noti.value)
    const creator = users.find(user => user.id === noti.repliedBy)
    if (noti.repliedBy !== userAuth) {
      return (
        <div className='notification' >
          <Link to={creator?.id} className='noti-img-div'>
            <img src={creator?.avatarUrl} alt="" />
          </Link>
    
          <Link to={`/post/${post?.id}/comments/${comment?.id}`}>
            <b>
              {`@${creator?.username} `}
              {creator?.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} />}
            </b> replied your comment.
            <span className="noti-sentAt">
              {diff <= 60000 && `${Math.floor(diff / 1000)}s`}

              {diff <= 3600000 && diff > 60000 && `${Math.floor(diff / 60000)}m`}

              {diff > 3600000 && `${Math.floor(diff / 3600000)}h`}
            </span>
          </Link>
        </div>
      )
    }

  } else if (noti.type === 'reply-reply') {
    const post = allPosts.find(post => post.id === noti.postId)
    const comment = post.comments.value.find(comment => comment.id === noti.commentId)
    const reply = comment.replies.value.find(reply => reply.id === noti.value)
    const creator = users.find(user => user.id === noti.repliedBy)
    if (noti.repliedBy !== userAuth) {
      return (
        <div className='notification' >
          <Link to={creator?.id} className='noti-img-div'>
            <img src={creator?.avatarUrl} alt="" />
          </Link>
    
          <Link to={`/post/${post?.id}/comments/${comment?.id}/replies/${reply?.id}`}>
            <b>
              {`@${creator?.username} `}
              {creator?.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} />}
            </b> replied your reply to a comment.
            <span className="noti-sentAt">
              {diff <= 60000 && `${Math.floor(diff / 1000)}s`}

              {diff <= 3600000 && diff > 60000 && `${Math.floor(diff / 60000)}m`}

              {diff > 3600000 && `${Math.floor(diff / 3600000)}h`}
            </span>
          </Link>
        </div>
      )
    }
  } else if (noti.type === 'story-tag') {
    // const post = allPosts.find(post => post.id === noti.value)
    const creator = users.find(user => user.id === noti.taggedBy)
    if (noti.taggedBy !== userAuth) {
      return (
        <div className='notification' >
          <Link to={creator?.id} className='noti-img-div'>
            <img src={creator?.avatarUrl} alt="" />
          </Link>
    
          <Link
            to={`/f/stories/${creator?.username}/${noti.value}`}
            state={{ url: location.pathname, user: user }}
            onClick={() => {
            storyType.current = 'following'
            followStory.current = creator.id
          }}>
            <b>
              {`@${creator?.username} `}
              {creator?.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} />}
            </b> mentioned you in a story.
            <span className="noti-sentAt">
              {diff <= 60000 && `${Math.floor(diff / 1000)}s`}

              {diff <= 3600000 && diff > 60000 && `${Math.floor(diff / 60000)}m`}

              {diff > 3600000 && `${Math.floor(diff / 3600000)}h`}
            </span>
          </Link>
        </div>
      )
    }
  }
}

export default Notification