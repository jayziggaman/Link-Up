import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaAngleDown, FaAngleUp, FaRegComment } from 'react-icons/fa'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IosShareIcon from '@mui/icons-material/IosShare';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import CommentReply from './CommentReply'
import PostCaption from './GENERAL-COMPONENTS/PostCaption'
import UserPfp from './GENERAL-COMPONENTS/UserPfp'
import VerifiedBadge from './GENERAL-COMPONENTS/VerifiedBadge'
import GroupMedia from './GENERAL-COMPONENTS/GroupMedia';
import { postsRef } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { functionsContext } from '../CONTEXTS/FunctionsContext';
import Options from './GENERAL-COMPONENTS/Options';
import LoadPosts from './LoadPosts';
import Video from './GENERAL-COMPONENTS/Video';

const Comment = ({ comment, postId, commentType }) => {
  const {
    user, users, setShowShareMenu, setSelectedMessage, setShowPostForm, setPostFormFor, setPostFormIDs, postFormIDs, selectedMessage
  } = useContext(appContext)
  const { likeComment, bookmarkPost, removeBookmarkedPost, deletePost } = useContext(functionsContext)
  
  const { media, likes, id, creator, type, caption, shares, date } = comment

  const [loading, setLoading] = useState(true)
  const [showReplies, setShowReplies] = useState(false)
  const [replies, setReplies] = useState(null)
  const [commentCreator, setCommentCreator] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [showOptionsDiv, setShowOptionsDiv] = useState(false)
  const [viewLink, setViewLink] = useState(`/posts/${postId}/comments/${id}`)

  const optionId = useRef(null)
  const navigate = useNavigate()



  useEffect(() => {
    const thisCommentCreator = users.find(person => person.id === creator)

    if (thisCommentCreator) {
      setCommentCreator(thisCommentCreator)

    } else {
      setLoading(false)
      setNotFound(true)
    }
  }, [users])


  useEffect(() => {
    if (commentCreator) {
      setLoading(false)
    }
  }, [commentCreator])



  useEffect(() => {
    if (comment) {
      const repliesRef = collection(postsRef, postId, 'comments', id, 'replies')

      onSnapshot(repliesRef, snap => {
        const repliesArr = []
        snap.docs.forEach(doc => {
          repliesArr.push({ ...doc.data(), id: doc.id })
        })

        setReplies([...repliesArr])
      })
    }
  }, [comment])


  const linkTo = (e) => {
    if (e.target.nodeName !== 'path' && e.target.nodeName !== 'svg' && e.target.nodeName !== 'BUTTON') {
      e.preventDefault()
      navigate(viewLink)
    }
  }
  


  if (loading) {
    <LoadPosts />
    
    
  } else if (notFound) {
    return (
      <div className="deleted-comment">
        This comment was made by a deleted account
      </div>
    )
    
  } else {
    const { id: creatorId, username, displayName, userType } = commentCreator

    const callDeletePost = () => deletePost(postId, id);
    const callRemoveBookmarkedPost = () => removeBookmarkedPost(id);
    const callBookmarkPost = () => bookmarkPost(id, postId, id);


    const functionsForOption = [
      ...(user?.id && user.id === creatorId ? [{ text: 'Delete comment', func: callDeletePost, color: 'red' }] : []),

      ...(user?.id && user.postSaves.value.find(save => save.postId === id) ?
        [{ text: 'Remove from bookmarked posts', func: callRemoveBookmarkedPost }] :
        [{ text: 'Bookmark post', func: callBookmarkPost }]),
    ];
    
    return (
      <div className={`comment ${commentType}`} id={id}>
        <div className="upper-sect">
          {user?.id &&
            <Options
              optionId={optionId} functions={functionsForOption}
              setShowOptionsDiv={setShowOptionsDiv} showOptionsDiv={showOptionsDiv}
            />
          }

          <a href={`/${username}`}>
            <div className="upper-sect-img-div">
              <UserPfp user={commentCreator} />
            </div>
  
            <div className="post-username-div">
              <p className="post-display-name">
                {displayName}  {userType === 'creator' && <VerifiedBadge />}
              </p>
              <p className="post-username"> @{username} </p>
            </div>
          </a>
  
          <div className='upper-sect-options'
            onClick={() => {
              optionId.current = id
              setShowOptionsDiv(!showOptionsDiv)
            }}
          >
            <MoreHorizIcon />
          </div>
        </div>


        <div className="middle-sect">
          {type === 'Text' &&
            <PostCaption caption={caption} postLink={viewLink} />
          }

          {type === 'Picture-Media' &&
            <div className="img-post-body-div">
              <PostCaption caption={caption} postLink={viewLink} />

              <div onClick={e => linkTo(e)} className='in-link'>
                <img className='img-post-body' src={media} alt="" />
              </div>
            </div>
          }

          {type === 'Video-Media' &&
            <div className="img-post-body-div">
              <PostCaption caption={caption} postLink={viewLink} />

              <div onClick={e => linkTo(e)} className='in-link'>
                <Video haveControls={true} classname='img-post-body' source={media} />
              </div>
            </div>
          }
        
          {type === 'Group-Media' &&
            <div className="img-post-body-div">
              <PostCaption caption={caption} postLink={viewLink} />

              <GroupMedia
                linkTo={linkTo} post={comment}
              />
            </div>
          }
        </div>


        <div className="lower-sect">
          {commentType !== 'full' ?
            <span className='show-comment-replies' onClick={() => {
              setShowReplies(!showReplies)
              // setShowMore(!showMore)
              }}
            >
              { showReplies ? <FaAngleUp /> : <FaAngleDown /> }
            </span>
            : 
            <span className="post-time">
              <span>{date} </span>
            </span>
          }

          <span style={likes.value.find(like => like === user.id) ? { color: 'red' } : null} onClick={() => {
            if (user && user.id) {
              likeComment(postId, comment)
            }
          }}>
            {likes.value.find(like => like === user.id) ? 
            <FavoriteIcon style={{ color: 'red' }} />
            :
            <FavoriteBorderIcon />
            }
            {likes?.value.length}
          </span>

          <span className='reply' onClick={e => {
            if (user && user.id) {
              setShowPostForm(true)
              setPostFormFor("reply")
              setPostFormIDs({...postFormIDs, postId, commentId: id})
            }
          } }>
            <FaRegComment /> {replies ? replies.length : 0}
          </span>
          
          <span onClick={e => {
            if (user && user.id) {
              setShowShareMenu(true)
              setSelectedMessage({
                ...selectedMessage, postId, commentId: id, post: comment, creator: commentCreator
              })
            }
          }}>
            <IosShareIcon /> {shares.value.length}
          </span>
        </div>
  
        <div className='comment-reply-div'>
          {showReplies && replies && replies.map((reply, ind) => {
              const { creator } = reply
              if (creator === user.id) {
                return (
                  <div key={ind} className='post-div'>
                    {ind !== 0 && <hr />}
                    <CommentReply key={reply.id} reply={reply} postId={postId} commentId={id} 
                    />
                  </div>
                ) 
              } else {
                return (
                  <div key={ind} className='post-div'>
                    {ind !== 0 && <hr />}
                    <CommentReply key={reply.id} reply={reply} postId={postId} commentId={id} 
                    />
                  </div>
                ) 
              }
            })}
        </div>
      </div>
    )
  }
}

export default Comment