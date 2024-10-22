import React, { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { appContext } from '../App'
import Comment from '../COMPONENTS/Comment'
import LoadPosts from '../COMPONENTS/LoadPosts'
import Nav from '../COMPONENTS/Nav'
import Footer from '../COMPONENTS/Footer'
import postNotFoundImg from '../Images/no-media-found-IV.jpg'
import Post from '../COMPONENTS/Post';
import BackButton from '../COMPONENTS/GENERAL-COMPONENTS/BackButton'
import Header from '../COMPONENTS/Header'
import { collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { postsRef } from '../firebase/config'
import LoginMessage from '../COMPONENTS/GENERAL-COMPONENTS/LoginMessage'
import ReplyView from '../COMPONENTS/ReplyView'



const initialState = {
  thisPost: null,
  thisPostCreator: null,
  thisPostComments: null,
  thisComment: null,
  thisCommentCreator: null,
  thisCommentReplies: null,
  thisReply: null,
  thisReplyCreator: null,
  thisReplyReplies: null,
  postNotFound: false,
  postCreatorNotFound: false,
  commentNotFound: false,
  commentCreatorNotFound: false,
  replyNotFound: false,
  replyCreatorNotFound: false,
};


function reducer(state, action) {
  switch (action.type) {
    case 'SET_POST':
      return { ...state, thisPost: action.payload };
    case 'SET_POST_CREATOR':
      return { ...state, thisPostCreator: action.payload };
    case 'SET_POST_COMMENTS':
      return { ...state, thisPostComments: action.payload };
    case 'SET_COMMENT':
      return { ...state, thisComment: action.payload };
    case 'SET_COMMENT_CREATOR':
      return { ...state, thisCommentCreator: action.payload };
    case 'SET_COMMENT_REPLIES':
      return { ...state, thisCommentReplies: action.payload };
    case 'SET_REPLY':
      return { ...state, thisReply: action.payload };
    case 'SET_REPLY_CREATOR':
      return { ...state, thisReplyCreator: action.payload };
    case 'SET_REPLY_COMMENTS':
      return { ...state, thisReplyReplies: action.payload };
    case 'SET_POST_NOT_FOUND':
      return { ...state, postNotFound: action.payload };
    case 'SET_POST_CREATOR_NOT_FOUND':
      return { ...state, postCreatorNotFound: action.payload };
    case 'SET_COMMENT_NOT_FOUND':
      return { ...state, commentNotFound: action.payload };
    case 'SET_COMMENT_CREATOR_NOT_FOUND':
      return { ...state, commentCreatorNotFound: action.payload };
    case 'SET_REPLY_NOT_FOUND':
      return { ...state, replyNotFound: action.payload };
    case 'SET_REPLY_CREATOR_NOT_FOUND':
      return { ...state, replyCreatorNotFound: action.payload };
    default:
      return state;
  }
}


const PostView = ({ viewFor }) => {
  const { postId, commentId, replyId } = useParams()
  const {
  allPosts, users, showReplyForm, setShowShareMenu, showShareMenu, setSelectedMessage, setShowPostForm, setPostFormFor, setPostFormIDs, postFormIDs, user
  } = useContext(appContext)

  const [loading, setLoading] = useState(true)
  const [state, dispatch] = useReducer(reducer, initialState);
  const [POST, SETPOST] = useState(null)
  const [COMMENTS, SETCOMMENTS] = useState(null)

  const { thisPost, thisPostCreator, thisPostComments, thisComment, thisCommentCreator, thisCommentReplies, thisReply, thisReplyCreator, thisReplyReplies, postNotFound, postCreatorNotFound, commentNotFound, commentCreatorNotFound, replyCreatorNotFound, replyNotFound } = state
  

  const postSectionRef = useRef(null)
  const comtId = useRef('')
  const RepId = useRef('')

  const navigate = useNavigate()

  const loadArr = [1, 2, 3, 4, 5]



  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const loadingPost = allPosts.find(post => post.id === postId);
        const loadingPostCreator = users.find(person => person.id === loadingPost?.creator);
  
        let loadingComment = null;
        let loadingCommentCreator = null;
        if (commentId) {
          const commentRef = doc(postsRef, postId, 'comments', commentId);
          loadingComment = await getDoc(commentRef);
          loadingCommentCreator = users?.find(user => user.id === loadingComment.data()?.creator) 
        } 
  
        let loadingReply = null;
        let loadingReplyCreator = null;
        if (commentId && replyId) {
          const replyRef = doc(postsRef, postId, 'comments', commentId, 'replies', replyId);
          loadingReply = await getDoc(replyRef);
          loadingReplyCreator = users?.find(user => user.id === loadingReply.data()?.creator) 
        } 
        

        if (loadingPost && loadingPostCreator) {
          dispatch({ type: 'SET_POST', payload: loadingPost });
          dispatch({ type: 'SET_POST_CREATOR', payload: loadingPostCreator });
          dispatch({ type: 'SET_POST_NOT_FOUND', payload: false });
        } else {
          dispatch({ type: 'SET_POST_NOT_FOUND', payload: true });
        }
  
        if (loadingComment && loadingCommentCreator) {
          dispatch({ type: 'SET_COMMENT', payload: loadingComment.data() });
          dispatch({ type: 'SET_COMMENT_CREATOR', payload: loadingCommentCreator });
          dispatch({ type: 'SET_COMMENT_NOT_FOUND', payload: false });
        } else {
          dispatch({ type: 'SET_COMMENT_NOT_FOUND', payload: true });
        }
  
        if (loadingReply && loadingReplyCreator) {
          dispatch({ type: 'SET_REPLY', payload: loadingReply.data() });
          dispatch({ type: 'SET_REPLY_CREATOR', payload: loadingReplyCreator });
          dispatch({ type: 'SET_REPLY_NOT_FOUND', payload: false });
        } else {
          dispatch({ type: 'SET_REPLY_NOT_FOUND', payload: true });
        }
      } catch (error) {
        console.error("Error fetching posts or data:", error);

      } finally {
        // setLoading(false);
      }
    };
  
    if (allPosts && users) {
      fetchPosts();
    }
  }, [postId, commentId, replyId, allPosts, users]);




  useEffect(() => {
    if (thisPost) {
      const commentRef = collection(postsRef, thisPost.id, 'comments')
      const q = query(commentRef, orderBy("createdAt", "desc"))

      onSnapshot(q, snap => {
        const commentsArr = []
        snap.docs.forEach(doc => {
          commentsArr.push({ ...doc.data(), id: doc.id })
        })

        dispatch({ type: 'SET_POST_COMMENTS', payload: [...commentsArr] });
      })
    }


    if (thisComment && thisPost) {
      const replyRef = collection(postsRef, thisPost.id, 'comments', thisComment.id, 'replies')
      const q = query(replyRef, orderBy("createdAt", "desc"))

      onSnapshot(q, snap => {
        const repliesArr = []
        snap.docs.forEach(doc => {
          repliesArr.push({ ...doc.data(), id: doc.id })
        })

        dispatch({ type: 'SET_COMMENT_REPLIES', payload: [...repliesArr] });
      })
    }
  }, [thisPost, thisComment])



  useEffect(() => {
    if (!showShareMenu) {
      setSelectedMessage({})
    }
  }, [showShareMenu])



  useEffect(() => {
    if (viewFor === 'post') {
      if (thisPost) {
        SETPOST(thisPost)
        SETCOMMENTS(thisPostComments)
      }

    } else if (viewFor === 'comment') {
      if (thisComment) {
        SETPOST(thisComment)
        SETCOMMENTS(thisCommentReplies)
      }

    } else if (viewFor === 'reply') {
      if (thisReply) {
        SETPOST(thisReply)
        SETCOMMENTS(thisCommentReplies)
      }
    }
  }, [viewFor, thisPost, thisPostComments, thisComment, thisCommentReplies, thisReply])


  useEffect(() => {
    if (POST) {
      if (viewFor === 'post') {
        if (thisPostCreator) {
          setLoading(false)
        }
  
      } else if (viewFor === 'comment') {
        if (thisCommentCreator) {
          setLoading(false)
        }
  
      } else if (viewFor === 'reply') {
        if (thisReplyCreator) {
          setLoading(false)
        }
      }
    }
  }, [POST, thisPostCreator, thisCommentCreator, thisReplyCreator])



  
  useEffect(() => {
    if (!loading) {
      if (postSectionRef.current) {
        const elementPosition = postSectionRef.current.getBoundingClientRect().top + window.scrollY; 
        const offsetPosition = elementPosition - 41; 

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth' 
        });
      }
    }
  }, [loading, postId, commentId])





  if (loading) {
    return (
      <main className="post-view-main post-view-main-loading">
        <PostViewHeader />
        <Nav />

        <LoginMessage />

        <div className="pv-post-loading">
          <div className="pvp-upper-sect">
            <div className="pvp-img-loading"></div>
            <div className="pvp-username-name-loading"></div>
          </div>
          <div className="pvp-middle-sect">
            <div></div>
            <div></div>
          </div>
          <div className="pvp-lower-sect">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        {
          loadArr.map((item, index) => <LoadPosts key={index} />)
        }
      </main>
    )
  } else if (postNotFound) {
    return (
      <main className="post-view-main post-postNotFound">
        <PostViewHeader />
        
        <Nav />

        <LoginMessage />

        <div className="post-not-found">
          <img src={postNotFoundImg} alt=""/>
          <h2>Oops...</h2>
          <p>Looks like this post was deleted.</p>
          <Link to={-1}>Back</Link>
        </div>
        <Footer />
      </main>
      )
  } else {
    const { id } = POST

    return (
      <main className="post-view-main"
        style={{
          minHeight: viewFor !== 'post' ? '200vh' : ''
        }}
        onClick={e => {
          if (showShareMenu) { 
            setShowShareMenu(false)
          }
        }}
      >

        <LoginMessage />
  
        <PostViewHeader />

        <Nav />

        {viewFor === 'comment' || viewFor === 'reply' ?
          <section className="cv-post-section">
            {thisPost &&
              <Post post={thisPost} />
            }
          </section>
          : <></>
        }

        {viewFor === 'reply' ?
          <section className="cv-post-section">
            {thisComment &&
              <Comment comment={thisComment} postId={postId} commentType="full" />
            }
          </section>
          : <></>
        }
        
        
  
        <section ref={postSectionRef} id="post-view-content" className="post-view-content">
          {viewFor === 'post' ?
            <Post post={POST} />

            : viewFor === 'comment' ?
              <Comment comment={POST} postId={postId} commentType="full" />
              
              : viewFor === 'reply' ?
                <ReplyView postId={postId} commentId={commentId} reply={POST}
                  replyType="full"
                />
                
                : <></>
          }
        </section>
  
        <section className="comment-section">
          {user && user.id &&
            <button className="comment-btn"
              onClick={() => {
                setShowPostForm(true)

                if (commentId) {
                  setPostFormFor("reply")
                  setPostFormIDs(
                    { ...postFormIDs, postId, commentId, replyId: id }
                  )
                  
                } else {
                  setPostFormFor("comment")
                  setPostFormIDs({...postFormIDs, postId: id})
                }
              }}
            >
              <span>
                Leave a comment
              </span>

              <span>
                Post
              </span>
            </button>
          }
  
          <div className="comments">
            {COMMENTS && COMMENTS
              .filter(comment => comment.id !== replyId)
              .map((comment, ind) => {
              const { id } = comment

              if (viewFor === 'post') {
                return (
                  <div key={id} className='post-div'>
                    {ind !== 0 && <hr />}
                    <Comment comment={comment} postId={thisPost.id} />
                  </div>
                )

              } else {
                return (
                  <div key={id} className='post-div'>
                    {ind !== 0 && <hr />}
                    <ReplyView commentId={commentId}
                      postId={thisPost.id} reply={comment}
                    />
                  </div>
                )
              }
            })}
          </div>
        </section>
        
        <Footer />
      </main>
    )
  }
}

export default PostView





const PostViewHeader = () => {
  const { windowWidth } = useContext(appContext)

  return (
    <>
      {windowWidth >= 700 && <Header />}
      
      <header className="post-view-header">
        <BackButton navigateLink={-1} />

        <div className="post-view-header-div">
          Post
        </div>
      </header>
    </>
  )
}





