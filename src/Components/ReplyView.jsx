import React, { useContext, useEffect, useRef, useState } from 'react'
import { appContext } from '../App'
import { FaRegComment } from 'react-icons/fa'
import IosShareIcon from '@mui/icons-material/IosShare';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useNavigate } from 'react-router-dom'
import UserPfp from './GENERAL-COMPONENTS/UserPfp';
import PostCaption from './GENERAL-COMPONENTS/PostCaption';
import VerifiedBadge from './GENERAL-COMPONENTS/VerifiedBadge';
import GroupMedia from './GENERAL-COMPONENTS/GroupMedia';
import Options from './GENERAL-COMPONENTS/Options';
import { functionsContext } from '../CONTEXTS/FunctionsContext';
import LoadPosts from './LoadPosts';
import Video from './GENERAL-COMPONENTS/Video';

const ReplyView = ({ reply, postId, commentId, replyType }) => {
  const {
    users, user, setShowShareMenu, setSelectedMessage, setShowPostForm, postFormIDs, setPostFormIDs, setPostFormFor, selectedMessage
  } = useContext(appContext)
  const { likeCommentReply, bookmarkPost, removeBookmarkedPost, deletePost } = useContext(functionsContext)

  const { id, caption, type, media, likes, shares, creator, date } = reply

  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [replyCreator, setReplyCreator] = useState()
  const [showOptionsDiv, setShowOptionsDiv] = useState(false)
  const [viewLink, setViewLink] = useState(`/posts/${postId}/comments/${commentId}/replies/${id}`)

  const optionId = useRef(null)
  const navigate = useNavigate()



 
  useEffect(() => {
    const thisReplyCreator = users.find(person => person.id === creator)

    if (thisReplyCreator) {
      setReplyCreator(thisReplyCreator)

    } else {
      setLoading(false)
      setNotFound(true)
    }
  }, [users])


  useEffect(() => {
    if (replyCreator) {
      setLoading(false)
    }
  }, [replyCreator])



  const linkTo = (e, link) => {
    if (e.target.nodeName !== 'path' &&
      e.target.nodeName !== 'svg' &&
      e.target.nodeName !== 'BUTTON'
    ) {
      e.preventDefault()
      navigate(viewLink)
    }
  }



  if (loading) {
    <LoadPosts />
    
    
  } else if (notFound) {
    return (
      <div className="deleted-comment">
        This reply was made by a deleted account
      </div>
    )
    
  } else if (replyCreator) {
    const { id: creatorId, username, displayName, userType } = replyCreator

    const callDeletePost = () => deletePost(postId, commentId, id);
    const callRemoveBookmarkedPost = () => removeBookmarkedPost(id);
    const callBookmarkPost = () => bookmarkPost(id, postId, commentId, id);


    const functionsForOption = [
      ...(user?.id && user.id === creatorId ? [{ text: 'Delete reply', func: callDeletePost, color: 'red' }] : []),

      ...(user?.id && user.postSaves.value.find(save => save.postId === id) ?
        [{ text: 'Remove from bookmarked posts', func: callRemoveBookmarkedPost }] :
        [{ text: 'Bookmark post', func: callBookmarkPost }]),
    ];
    
    return (
      <div className={`comment ${replyType}`} id={id}>
        <div className="upper-sect">
          {user?.id &&
            <Options
              optionId={optionId} functions={functionsForOption}
              setShowOptionsDiv={setShowOptionsDiv} showOptionsDiv={showOptionsDiv}
            />
          }

          <a href={`/${username}`}>
            <div className="upper-sect-img-div">
              <UserPfp user={replyCreator} />
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
                linkTo={linkTo} post={reply}
              />
            </div>
          }
        </div>


        <div className="lower-sect">
          {replyType === 'full' ?
            <span className="post-time">
              <span>{date} </span>
            </span>
            : <></>
          }

          <span
            style={likes.value.find(like => like === user.id) ? { color: 'red' } : null} onClick={() => {
              if (user && user.id) {
                likeCommentReply(postId, commentId, reply)
              }
            }}
          >
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
              setPostFormIDs(
                { ...postFormIDs, postId, commentId, replyId: id }
              )
            }
          } }>
            <FaRegComment /> 0
          </span>
          
          <span onClick={e => {
            if (user && user.id) {
              setShowShareMenu(true)
              setSelectedMessage({
                ...selectedMessage, postId, commentId, replyId: id, post: reply, creator: replyCreator
              })
            }
          }}>
            <IosShareIcon /> {shares.value.length}
          </span>
        </div>
      </div>
    )
  }
}

export default ReplyView