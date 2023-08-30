import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import { FaArrowLeft } from 'react-icons/fa'
import PostBookmark from '../Components/PostBookmark'
import CommentBookmark from '../Components/CommentBookmark'
import ReplyBookmark from '../Components/ReplyBookmark'
import Post from '../Components/Post'
import ReplyForm from '../Components/ReplyForm'
import ReplyReplyForm from '../Components/ReplyReplyForm'
import Header from '../Components/Header'
import Nav from '../Components/Nav'
import LoadPosts from '../Components/LoadPosts'

const BookmarkedPosts = () => {
  const { users, user, allPosts, userAuth, windowWidth, setShowShareMenu, showShareMenu } = useContext(appContext)
  const loadArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState()
  const postId = useRef()
  const commntId = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    return () => {
      const main = document.querySelector('main')
      const allVideos = main.querySelectorAll('video')
      allVideos.forEach(video => video.pause())
    }
  }, [])

  useEffect(() => {
    if (posts) {
      setLoading(false)
    }
  }, [posts])
  

  useEffect(() => {
    const arr = []

    for (let i = 0; i < user?.postSaves.value.length; i++) {
      if (user?.postSaves.value[i].type === 'post') {
        arr.push({
          type: 'post',
          value: allPosts.find(post => post.id === user?.postSaves.value[i].postId)
        })

      } else if (user?.postSaves.value[i].type === 'comment') {
        const post = allPosts.find(post => post.id === user?.postSaves.value[i].postId)
        const comment = post.comments.value.find(comment => comment.id === user?.postSaves.value[i].commentId)
        arr.push({
          type: 'comment',
          value: {post, comment}
        })

      } else if (user?.postSaves.value[i].type === 'reply') {
        const post = allPosts.find(post => post.id === user?.postSaves.value[i].postId)
        const comment = post?.comments.value.find(comment => comment.id === user?.postSaves.value[i].commentId)
        const reply = comment?.replies.value.find(reply => reply.id === user?.postSaves.value[i].replyId)
        arr.push({
          type: 'reply',
          value: {post, comment, reply}
        })
      }
    }
    setPosts(arr)
  }, [user])

  if (loading) {
    return (
      <>
        <header className='bookmark-header'>
          <button onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
  
          <h1>
            Bookmarks
          </h1>
        </header>
  
        {windowWidth > 800 && <Header />}
        <Nav />
        
        {loadArr.map((item, i) => <LoadPosts key={i} />)}
      </>
    )
  } else {
    return (
      <main className="post-bookmarks-main" onClick={() => {
        if (showShareMenu) { 
          setShowShareMenu(false)
        }
      }}>
        <header className='bookmark-header'>
          <button onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
  
          <h1>
            Bookmarks
          </h1>
        </header>
  
        {windowWidth > 800 && <Header />}
        <Nav />
  
        <section className="post-bookmarks-section">
          {posts?.map((post, index) => {
            return (
              <section key={index}>
                {post.type === 'post' &&
                  <>
                    {post?.value?.creator === userAuth ?
                      <>
                        {index !== 0 && <hr />}
                        <Post post={post.value} postId={postId}
                          func={[
                            { id: postId.current, text: 'Remove bookmark', prop: 'remove-bookmark' },
                            { id: postId.current, text: 'Delete post', prop: 'delete-post red' }
                          ]}
                        />
                      </>
                      :
                      <>
                        {index !== 0 && <hr />}
                        <Post post={post.value} postId={postId}
                          func={[
                            { id: postId.current, text: 'Remove bookmark', prop: 'remove-bookmark' }
                          ]}
                        />
                      </>
                    }
                  </>
                }
  
                
  
  
  
                {post.type === 'comment' &&
                  <>
                    {index !== 0 && <hr />}
                    <CommentBookmark post={post} postId={postId} commntId={commntId} />
                  </>
                }
  
                {post.type === 'reply' &&
                  <>
                    {index !== 0 && <hr />}
                    <ReplyBookmark post={post} />
                  </>
                }
              </section>
            )
          })}
        </section>
  
        <ReplyForm />
        <ReplyReplyForm postId={postId.current} commentId={commntId.current} />
  
      </main>
    )
  }
}

export default BookmarkedPosts