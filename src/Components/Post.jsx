import React, { useContext, useEffect, useRef, useState } from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { FaRegComment } from 'react-icons/fa'
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link, useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import LoadPosts from "./LoadPosts"
import Options from './GENERAL-COMPONENTS/Options'
import GroupMedia from './GENERAL-COMPONENTS/GroupMedia'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import IosShareIcon from '@mui/icons-material/IosShare';
import VerifiedBadge from './GENERAL-COMPONENTS/VerifiedBadge';
import PostCaption from './GENERAL-COMPONENTS/PostCaption';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { postsRef } from '../firebase/config';
import UserPfp from './GENERAL-COMPONENTS/UserPfp';
import { functionsContext } from '../CONTEXTS/FunctionsContext';
import Video from './GENERAL-COMPONENTS/Video';



const Post = ({ post, isProcessing, opacity, postLink }) => {
  const { allPosts, users, user,  } = useContext(appContext)
  const { id, creator } = post

  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState(null)
  const [postCreator, setPostCreator] = useState(null)
  const [postByDeletedAccount, setPostByDeletedAccount] = useState(false)


  useEffect(() => {
    if (users) {
      const userObj = users.find(p => p.id === creator)

      if (!userObj) {
        setPostByDeletedAccount(true)
        setLoading(false)

      } else {
        setPostCreator(userObj)
      }
    }
  }, [creator, users])


  useEffect(() => {
    if (post) {
      const commentRef = collection(postsRef, id, 'comments')

      onSnapshot(commentRef, snap => {
        const commentsArr = []
        snap.docs.forEach(doc => {
          commentsArr.push({ ...doc.data(), id: doc.id })
        })

        setComments([...commentsArr])
      })
    }
  }, [post])


  useEffect(() => {
    if (post && postCreator && comments) {
      setLoading(false)
    } 
  }, [post, postCreator, comments])




  if (postByDeletedAccount) {
    return (
      <div className="deleted-comment">
        This post was made by a deleted account
      </div>
    )

  } else if (loading) {
    return (
      <LoadPosts />
    )

  } else {
    return (
      <div id={id} className="post"
        style={{ opacity: opacity ? opacity : 1 }}
      >
        {allPosts && 
          <PostSections post={post} 
            postCreator={isProcessing ? user : postCreator} 
            isProcessing={isProcessing}
            comments={comments}
            postLink={postLink ? postLink : `/posts/${id}`}
          /> 
        }
      </div>
    )
  }
}

export default Post






const PostSections = ({ post, postCreator, isProcessing, comments, postLink }) => {
  const { setShowShareMenu, selectedMessage, setSelectedMessage, user, setShowPostForm, setPostFormFor, setPostFormIDs, postFormIDs
  } = useContext(appContext)
  const { likePost, bookmarkPost, removeBookmarkedPost, deletePost } = useContext(functionsContext)
  
  const { id, media, date, likes, caption, type, shares } = post
  const { id: creatorId, username, displayName, userType } = postCreator

  const [showOptionsDiv, setShowOptionsDiv] = useState(false)

  const optionId = useRef(null)
  
  const navigate = useNavigate()

  const postLinkTo = (e) => {
    if (e.target.nodeName !== 'path'
      && e.target.nodeName !== 'svg'
      && e.target.nodeName !== 'BUTTON'
    ) {
      e.preventDefault()
      navigate(`/posts/${id}`)
    }
  }


  const callDeletePost = () => deletePost(id);
  const callRemoveBookmarkedPost = () => removeBookmarkedPost(id);
  const callBookmarkPost = () => bookmarkPost(id, id);


  const functionsForOption = [
    ...(user?.id && user.id === creatorId ? [{ text: 'Delete post', func: callDeletePost, color: 'red' }] : []),

    ...(user?.id && user.postSaves.value.find(save => save.postId === id) ?
      [{ text: 'Remove from bookmarked posts', func: callRemoveBookmarkedPost }] :
      [{ text: 'Bookmark post', func: callBookmarkPost }]),
  ];



  return (
    <>
      <div className="upper-sect">
        {user?.id &&
          <Options
            optionId={optionId} functions={functionsForOption}
            setShowOptionsDiv={setShowOptionsDiv} showOptionsDiv={showOptionsDiv}
          />
        }
        
        <a href={`/${username}`}>
          <div className="upper-sect-img-div">
            <UserPfp user={postCreator} />
          </div>

          <div className="post-username-div">
            <p className="post-display-name">
              <span>
                {displayName} 
              </span> 

              {userType === 'creator' && 
                <VerifiedBadge />
              }
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
          <PostCaption caption={caption} postLink={postLink} />
        }

        {type === 'Picture-Media' &&
          <div className="img-post-body-div">
            <PostCaption caption={caption} postLink={postLink} />
            
            <div onClick={e => postLinkTo(e)} className='in-link'>
              <img  className='img-post-body' src={media} alt="" />
            </div>
          </div>
        }

        {type === 'Video-Media' &&
          <div className="img-post-body-div">
            <PostCaption caption={caption} postLink={postLink} />

            <div onClick={e => postLinkTo(e)} className='in-link'>
              <Video haveControls={true} classname='img-post-body' source={media} />
            </div>
          </div>
        }
      
        {type === 'Group-Media' &&
          <div className="img-post-body-div">
          <PostCaption caption={caption} postLink={postLink} />

            <GroupMedia
              linkTo={postLinkTo} post={post}
            />
          </div>
        }
      </div>

      {!isProcessing &&
        <div className="lower-sect">
          <span className="post-time">
            {/* <span>{time}</span> */}
            <span>{date} </span>
          </span>

          <span style={likes.value.find(like => like === user.id) ? { color: 'red' } : null} onClick={() => {
            if (user && user.id) {
              likePost(post)
            }
          }}>
            {likes.value.find(like => like === user.id) ? 
              <FavoriteIcon style={{ color: 'red' }} />
              :
              <FavoriteBorderIcon />
            }
            <span className='lower-sect-number'>
              {likes.value?.length}
            </span>
          </span>

          <span>
            <Link to={`/posts/${id}`} role="button"
              onClick={() => {
                if (user && user.id) {
                  setShowPostForm(true)
                  setPostFormFor("comment")
                  setPostFormIDs({...postFormIDs, postId: id})
                }
              }}
            >
              <FaRegComment />

              <span className='lower-sect-number'>
                {comments.length}
              </span>
            </Link>
          </span>
        
          <span 
            onClick={() => {
              if (user && user.id) {
                setShowShareMenu(true)
                setSelectedMessage({
                  ...selectedMessage, postId: "", post, creator: postCreator,
                })
              }
            }}
          >
            <IosShareIcon />
            <span className='lower-sect-number'>
              {shares?.value?.length} 
            </span>
          </span>
        </div>
      }
    </>
  )
}








