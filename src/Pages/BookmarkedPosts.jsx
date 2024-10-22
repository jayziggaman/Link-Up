import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import { FaArrowLeft } from 'react-icons/fa'
import Post from '../COMPONENTS/Post'
import Header from '../COMPONENTS/Header'
import Nav from '../COMPONENTS/Nav'
import LoadPosts from '../COMPONENTS/LoadPosts'
import noMedia from '../Images/no-media-found.jpg'
import { functionsContext } from '../CONTEXTS/FunctionsContext'
import { postsRef } from '../firebase/config'
import { doc, onSnapshot } from 'firebase/firestore'
import ReplyView from '../COMPONENTS/ReplyView'
import Comment from '../COMPONENTS/Comment'
import BackButton from '../COMPONENTS/GENERAL-COMPONENTS/BackButton'
import UserPfp from '../COMPONENTS/GENERAL-COMPONENTS/UserPfp'

const BookmarkedPosts = () => {
  const { user, allPosts, windowWidth, setShowShareMenu, showShareMenu } = useContext(appContext)
  const { routeToLogin } = useContext(functionsContext)
  
  const loadArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState(null)
  const navigate = useNavigate()
  
  

  useEffect(() => {
    if (routeToLogin()) {
      navigate('/auth?type=login');
    }
  }, [])



  useEffect(() => {
    if (user) {
      const postSaves = user.postSaves.value;
  
      const fetchData = async () => {
        const postsArr = [];
  
        try {
          // Collect all snapshot listeners
          const promises = postSaves.map((save) => {
            const { postId, replyId, commentId } = save;
            
            return new Promise((resolve) => {
              let docRef;
  
              if (postId && commentId && replyId) {
                docRef = doc(postsRef, postId, "comments", commentId, "replies", replyId);
              } else if (postId && commentId) {
                docRef = doc(postsRef, postId, "comments", commentId);
              } else if (postId) {
                docRef = doc(postsRef, postId);
              }
  
              if (docRef) {
                const unsubscribe = onSnapshot(
                  docRef,
                  (docSnapshot) => {
                    if (docSnapshot.exists()) {
                      postsArr.push({ ...docSnapshot.data(), postId, commentId, replyId });
                    }
                    resolve(); // Resolve the promise when data is processed
                  },
                  (error) => {
                    console.error("Error fetching post data:", error);
                    resolve(); // Resolve even if there's an error
                  }
                );
  
                // Return the unsubscribe function for cleanup
                return () => unsubscribe();
              }
  
              resolve(); // Resolve if no docRef is provided
            });
          });
  
          // Wait for all promises to resolve
          await Promise.all(promises);
  
          // Filter out any null or undefined results
          const validPosts = postsArr.filter((post) => post !== null);
          setPosts(validPosts);
        } catch (error) {
          console.error("Error in fetching data:", error);
        }
      };
  
      fetchData();
  
      // Cleanup function to prevent memory leaks from onSnapshot listeners
      return () => {
        // Optional: You can unsubscribe from all listeners here if needed
      };
    }
  }, [user]);
  


  

  useEffect(() => {
    if (posts) {
      setLoading(false)
    }
  }, [posts])




  if (loading) {
    return (
      <main className="post-bookmarks-main">
        <ThisHeader headerText="Bookmarked posts" />
  
        {windowWidth > 700 && <Header />}
        <Nav />
        
        <section className="posts-section">
          {loadArr.map((_, i) => <LoadPosts key={i} />)}
        </section>
      </main>
    )
  } else {
    return (
      <main className="post-bookmarks-main" onClick={() => {
        if (showShareMenu) { 
          setShowShareMenu(false)
        }
      }}>
        <ThisHeader headerText="Bookmarked posts" />
  
        {windowWidth > 700 && <Header />}
        <Nav />
  
        <section className="posts-section">
          {posts.length > 0 ?
            <>
              {posts.reverse().map((post, ind) => {
                const { postId, commentId, replyId } = post
                
                return (
                  <div key={post.id}>
                    {ind !== 0 && <hr />}

                    {commentId !== ''  && replyId !== '' ?
                      <ReplyView reply={post} replyType="full" commentId={commentId} postId={postId} />

                      : commentId !== '' && replyId === '' ?
                        <Comment comment={post} commentType="full" postId={postId} />

                        : <Post post={post} />
                    } 
                  </div>
                )
              })}
            </>
            :
            <div className='no-media-div'>
              <img className='no-media' src={noMedia} alt="" />
              <p>Nothing to show here.</p>
            </div>
          }
        </section>
  
      </main>
    )
  }
}

export default BookmarkedPosts





export const ThisHeader = ({ headerText }) => {
  const { user } = useContext(appContext)
  
  return (
    <header className='bookmark-header'>
      <BackButton navigateLink={-1}/>

      <h3>
        {headerText}
      </h3>

      <div className="bookmark-header-pfp">
        <UserPfp user={user} />
      </div>
    </header>
  )
}