import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { appContext } from '../App'
import { functionsContext } from '../CONTEXTS/FunctionsContext'
import UserPfp from './GENERAL-COMPONENTS/UserPfp'
import VerifiedBadge from './GENERAL-COMPONENTS/VerifiedBadge'

const Notification = ({ noti }) => {
  const { users, allPosts, storyType, followStory, user } = useContext(appContext)
  const { sentAt, taggedBy, type, value, postId, commentId, repliedBy, likedBy } = noti

  const location = useLocation()


  if (type === 'post-tag') {
    const post = allPosts.find(post => post.id === value)
    const creator = users.find(user => user.id === taggedBy)
    
    if (creator && creator.id !== user.id) {
      return (
        <div className='notification' >
          <NotificationImage creator={creator} />

    
          <Link to={`/posts/${post?.id}`}>
            <CreatorDisplayName creator={creator} /> mentioned you in a post.
            
            <TimeSincePosted sentAt={sentAt} />
          </Link>
        </div>
      )
    }
    
  } else if (type === 'comment-tag') {
    const post = allPosts.find(post => post.id === postId)
    const comment = post.comments.value.find(comment => comment.id === value)
    const creator = users.find(user => user.id === noti?.taggedBy)

    if (creator && creator.id !== user.id) {
      return (
        <div className='notification' >
          <NotificationImage creator={creator} />
    
          <Link to={`/posts/${post?.id}/comments/${comment?.id}`}>
            <CreatorDisplayName creator={creator} /> mentioned you in a comment.
            
            <TimeSincePosted sentAt={sentAt} />
          </Link>
        </div>
      )
    }

  } else if (type === 'reply-tag') {
    const post = allPosts.find(post => post.id === postId)
    const comment = post.comments.value.find(comment => comment.id === commentId)
    const reply = comment.replies.value.find(reply => reply.id === value)
    const creator = users.find(user => user.id === noti?.taggedBy)

    if (creator && creator.id !== user.id) {
      return (
        <div className='notification'>
          <NotificationImage creator={creator} />
    
          <Link to={`/posts/${post?.id}/comments/${comment?.id}/replies/${reply?.id}`}>
            <CreatorDisplayName creator={creator} /> mentioned you in a reply.
            
            <TimeSincePosted sentAt={sentAt} />
          </Link>
        </div>
      )
    }

  } else if (type === 'post-like') {
    const post = allPosts.find(post => post.id === value)
    const creator = users.find(user => user.id === likedBy)
    
    if (creator && likedBy !== user.id) {
      return (
        <div className='notification' >
          <NotificationImage creator={creator} />
    
          <Link to={`/posts/${post?.id}`}>
            <CreatorDisplayName creator={creator} /> liked your post.
            
            <TimeSincePosted sentAt={sentAt} />
          </Link>
        </div>
      )
    }
    
  } else if (type === 'comment-like') {
    const post = allPosts.find(post => post.id === postId)
    const comment = post.comments.value.find(comment => comment.id === value)
    const creator = users.find(user => user.id === likedBy)

    if (creator && likedBy !== user.id) {
      return (
        <div className='notification' >
          <NotificationImage creator={creator} />
    
          <Link to={`/posts/${post?.id}/comments/${comment?.id}`}>
            <CreatorDisplayName creator={creator} /> liked your comment.
            
            <TimeSincePosted sentAt={sentAt} />
          </Link>
        </div>
      )
    }
    
  } else if (type === 'reply-like') {
    const post = allPosts.find(post => post.id === postId)
    const comment = post.comments.value.find(comment => comment.id === commentId)
    const reply = comment.replies.value.find(reply => reply.id === value)
    const creator = users.find(user => user.id === likedBy)

    if (creator && likedBy !== user.id) {
      return (
        <div className='notification' >
          <NotificationImage creator={creator} />
    
          <Link to={`/posts/${post?.id}/comments/${comment?.id}/replies/${reply?.id}`}>
            <CreatorDisplayName creator={creator} /> liked your reply.
            
            <TimeSincePosted sentAt={sentAt} />
          </Link>
        </div>
      )
   }

  } else if (type === 'post-reply') {
    const post = allPosts.find(post => post.id === value)
    const creator = users.find(user => user.id === repliedBy)

    if (creator && repliedBy !== user.id) {
      return (
        <div className='notification' >
          <NotificationImage creator={creator} />
    
          <Link to={`/posts/${post?.id}`}>
            <CreatorDisplayName creator={creator} /> commented on your post.
            
            <TimeSincePosted sentAt={sentAt} />
          </Link>
        </div>
      )
    }

  } else if (type === 'comment-reply') {
    const post = allPosts.find(post => post.id === postId)
    const comment = post.comments.value.find(comment => comment.id === value)
    const creator = users.find(user => user.id === repliedBy)

    if (creator && repliedBy !== user.id) {
      return (
        <div className='notification' >
          <NotificationImage creator={creator} />
    
          <Link to={`/posts/${post?.id}/comments/${comment?.id}`}>
            <CreatorDisplayName creator={creator} /> replied your comment.
            
            <TimeSincePosted sentAt={sentAt} />
          </Link>
        </div>
      )
    }

  } else if (type === 'reply-reply') {
    const post = allPosts.find(post => post.id === postId)
    const comment = post.comments.value.find(comment => comment.id === commentId)
    const reply = comment.replies.value.find(reply => reply.id === value)
    const creator = users.find(user => user.id === repliedBy)

    if (creator && repliedBy !== user.id) {
      return (
        <div className='notification' >
          <NotificationImage creator={creator} />
    
          <Link to={`/posts/${post?.id}/comments/${comment?.id}/replies/${reply?.id}`}>
            <CreatorDisplayName creator={creator} /> replied your reply to a comment.
            
            <TimeSincePosted sentAt={sentAt} />
          </Link>
        </div>
      )
    }
  } else if (type === 'story-tag') {
    const creator = users.find(user => user.id === taggedBy)

    if (creator && taggedBy !== user.id) {
      return (
        <div className='notification' >
          <NotificationImage creator={creator} />
    
          <Link
            to={`/f/stories/${creator && creator.username}/${value}`}
            state={{ url: location.pathname, user: user }}
            onClick={() => {
            storyType.current = 'following'
            followStory.current = creator.id
          }}>
            <CreatorDisplayName creator={creator} /> mentioned you in a story.
            
            <TimeSincePosted sentAt={sentAt} />
          </Link>
        </div>
      )
    }
  }
}

export default Notification




const NotificationImage = ({ creator }) => {

  return (
    <a href={creator && creator.id} className='noti-img-div'>
      <UserPfp user={creator} />
    </a>
  )
}



const CreatorDisplayName = ({ creator }) => {
  return (
    <b>
      {creator && creator.displayName} 
      {creator && creator.userType === 'creator' && <VerifiedBadge />}
    </b>
  )
}



const TimeSincePosted = ({ sentAt }) => {
  const { timeSincePosted } = useContext(functionsContext)
  
  return (
    <span className="noti-sentAt">
      {timeSincePosted(sentAt)}
    </span>
  )
}