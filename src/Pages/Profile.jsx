import React, { useContext, useEffect, useRef, useState } from 'react'
import { appContext } from '../App'
import { FaCog, FaTimes, FaPlus } from 'react-icons/fa'
import Button from '../Components/Button'
import Post from '../Components/Post'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from '../Components/Header'
import LoadPosts from '../Components/LoadPosts'
import ProfileList from '../Components/ProfileList'
import Nav from '../Components/Nav'
import Footer from '../Components/Footer'
import Form from '../Components/Form'
import verifiedBadge from '../Images/verified-badge.jpg'

const Profile = () => {
  const {
    userPosts, setShowForm, handleFollow, user, location, setShowOptionsDiv, showOptionsDIv, windowWidth, allPosts, users, setShowVerifiedMessage, showVerifiedMessage, VerifiedMessageRef, userStories, followStory, storyType, showShareMenu, setShowShareMenu
  } = useContext(appContext)
  const {userId} = useParams()
  const section = useRef('followers')
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [sectionTrigger, setSectionTrigger] = useState(true)
  const postType = useRef('All')
  const [postTypeArr, setPostTypeArr] = useState([])
  const postId = useRef('')
  const loadArr = [1, 2, 3, 4, 5]
  const [loading, setLoading] = useState(true)
  const [userFollowers, setUserFollowers] = useState([])
  const [userFollowing, setUserFollowing] = useState([])
  const uffRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    if(user) {
      setTimeout(() => {
        setLoading(false)
      }, 1000)

      let arr = []
      for(let i = 0; i < user?.followers.value.length; i++) {
        arr.push(users.find(person => person.id === user?.followers.value[i]))
      }
      setUserFollowers(arr)

      let arr2 = []
      for(let i = 0; i < user?.following.value.length; i++) {
        arr2.push(users.find(person => person.id === user?.following.value[i]))
      }
      setUserFollowing(arr2)
    }
  }, [user])


  useEffect(() => {
    if(!loading) {
      const followersFollowing = document.querySelector('.user-followers-following')
      const buttons = document.querySelectorAll('.user-followers-following header button')
      const followersFollowingDiv = document.querySelector('.followers-following')
      const span = followersFollowing.querySelector('span')
      const divs = followersFollowingDiv.querySelectorAll('div')

      if (section.current === 'followers') {
        setSearchResult(userFollowers.filter(user => user.username.includes(search)))
      } else if (section.current === 'following') {
        setSearchResult(userFollowing.filter(user => user.username.includes(search)))
      }

      buttons.forEach(btn => {
        btn.addEventListener('click', e => {
          section.current = e.currentTarget.textContent
          setSectionTrigger(!sectionTrigger)
          if (section.current === 'followers') {
            setSearchResult(userFollowers.filter(user => user.username.includes(search)))
          } else if (section.current === 'following') {
            setSearchResult(userFollowing.filter(user => user.username.includes(search)))
          }
    
        })
      })

      function spanFtn() {
        uffRef.current.classList.remove('show-div')
      }
      span.addEventListener('click', spanFtn )


      function divFtn(e) {
        section.current = ''
        const classList = e.currentTarget.classList.value
        if (!classList) {
          return
        } else {
          section.current = e.currentTarget.classList.value
          setSectionTrigger(!sectionTrigger)
          uffRef.current.classList.add('show-div')
          // uffRef.current.style.transform = 'scale(100%)'
        }
      }
      divs.forEach(div => {
        div.addEventListener('click', e => divFtn(e)  )
      })

        
      return () => {
        divs.forEach(div => {
          div.removeEventListener('click', e => divFtn)
        })

        span.removeEventListener('click', spanFtn)
      }
    }
  }, [sectionTrigger, user, section.current, loading])
  
  useEffect(() => {
    if(!loading) {
      // const followDiv = document.querySelector('.followers-following-after')
      // followDiv.style.visibility = 'hidden'

      // const followersFollowing = document.querySelector('.user-followers-following')
      // followersFollowing.style.visibility = 'hidden'
    }
  }, [loading])


  useEffect(() => {
    setPostTypeArr([...userPosts])
    if (!loading) {
      const postTypeNav = document.querySelector('.post-type-nav')
      const btns = postTypeNav.querySelectorAll('button')

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          postType.current = btn.textContent
          if (btn.textContent === 'All') {
            setPostTypeArr([...userPosts])

          } else if (btn.textContent === 'Media') {
            setPostTypeArr(userPosts.filter(post => post.type !== 'Text'))

          } else if (btn.textContent === 'Text') {
            setPostTypeArr(userPosts.filter(post => post.type === 'Text'))

          }  else if (btn.textContent === 'Likes') {
            let arr = []
            for(let i = 0; i < user.likes.value.length; i++) {
              arr.push(allPosts.find(post => post.id === user.likes.value[i]))
            }
            setPostTypeArr(arr)
          } 
        })
      })
    }
  }, [postType.current, userPosts, loading])

  useEffect(() => {
    if (showVerifiedMessage) {
      VerifiedMessageRef.current.classList.add('show')
    } else {
      VerifiedMessageRef.current.classList.remove('show')
    }
  }, [showVerifiedMessage])

  useEffect(() => {
    return () => {
      setShowVerifiedMessage(false)
      VerifiedMessageRef.current?.classList.remove('show')

      const main = document.querySelector('main')
      const allVideos = main?.querySelectorAll('video')
      allVideos?.forEach(video => video.pause())
    }
  }, [])

  useEffect(() => {
    if (showShareMenu) {
      setShowShareMenu(false)
    }
  }, [windowWidth])

  function mineViewed() {
    let res
    userStories.map(story => {
      res = user?.visitedRoutes.value.some(route => route.includes(story.id))
    })
    return res
  }

  
  if (loading) {
    return (
      <main className="profile-main-loading profile-main">
        {windowWidth > 799 && <Header />}
        {windowWidth > 799 && <Nav />}

        <div className="profile-upper-loading">
          <div className="profile-upper-upper-loading">
            <div className="profile-img-loading"></div>
            <div className="profile-followers-following-loading">
              <div className='followers-loading'>
                <div></div>
                <div></div>
              </div>
              <div className='following-loading'>
                <div></div>
                <div></div>
              </div>
              <div className='posts-loading'>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
          <div className="profile-upper-lower-loading">
            <div></div>
            <div></div>
          </div>
        </div>

        <div className="profile-lower-loading">
          <div className="profile-lower-upper-sect">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="profile-lower-lower-sect">
            {loadArr.map((item, index) => <LoadPosts key={index} />)}
          </div>
        </div>
        <Footer />
      </main>
    )
  } else {
    return (
      <main className="profile-main" role={'button'} onClick={() => {
        setShowForm(false)
        if (showShareMenu) {
          setShowShareMenu(false)
        }
      }}>
        {windowWidth > 799 && <Header />}
        {windowWidth > 799 && <Nav />}
        
        <div className="settings-div">
          <Link to='/profile/settings' >
            <FaCog />
          </Link>
        </div>
        
        <section className="profile-desc-sect">
          <div className="profile-pfp-followers">
  
            <div className="profile-username">
              <h3> {user?.displayName} </h3>
              <p>
                @{user?.username}
                {user.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} alt="" onClick={() => {
                  setShowVerifiedMessage(!showVerifiedMessage)
                }}/> }
              </p>
            </div>
  
            <>
              {mineViewed() ?
                <Link
                  style={{
                    border: userStories?.length < 1 ? 'none' : '2px solid gray'
                  }}
                  to={userStories[0] !== undefined && `/f/stories/${user?.username}/${userStories[0]?.id}`}
                  state={{ url: location.pathname, user: user }}
                  className="profile-pfp"
                  onClick={() => {
                    followStory.current = user?.id
                    storyType.current = 'user'
                  }}
                >
                  <img src={user?.avatarUrl} alt="" />
                </Link>
                :
                <Link
                  style={{
                    border: userStories?.length < 1 ? 'none' : '2px solid red'
                  }}
                  to={userStories[0] !== undefined && `/f/stories/${user?.username}/${userStories[0]?.id}`}
                  state={{ url: location.pathname, user: user }}
                  className="profile-pfp"
                  onClick={() => {
                    followStory.current = user?.id
                    storyType.current = 'user'
                  }}
                >
                  <img src={user?.avatarUrl} alt="" />
                </Link>
              }
            </>
  
  
            <div className="followers-following-div">
              <div className="followers-following">
                <div className="followers">
                  <h1>{user?.followers.value?.length || 0}</h1>
                  <p> {user?.followers.value?.length === 1 ? 'Follower' : 'Followers' } </p>
                </div>
  
                <div className="following">
                  <h1> {user?.following.value?.length || 0} </h1>
                  <p>Following</p>
                </div>
  
                <div>
                  <h1>{userPosts?.length} </h1>
                  <p>Posts</p>
                </div>
              </div>
  
              {/* <div className="followers-following-after">
                <button onClick={ () => handleFollow(userId) } >
                  Follow
                </button>
                <button>
                  <Link to='/profile/messaging' >
                    Message
                  </Link>
                </button>
              </div> */}
            </div>
          </div>
  
          <div className='about-div'>
            <p className="profile-about">
             {user?.about}
            </p>
          </div>
        </section>
        
  
  
        <section className="profile-posts-sect">
          <div className="post-type-nav">
            <Button postType={postType.current} textContent='All' />
            <Button postType={postType.current} textContent='Text' />
            <Button postType={postType.current} textContent='Media' />
            <Button postType={postType.current} textContent='Likes' />
          </div>
  
          <div className="profile-posts">
            {
              postTypeArr?.map((post, index) => {
                return (
                  <div key={index} className='post-div'>
                    {index !== 0 && <hr />}
                    <Post key={post.id} post={post} postId={postId}
                      func={[
                        { id: postId.current, text: 'Bookmark post', prop: 'bookmark-post' },
                        { id: postId.current, text: 'Delete post', prop: 'delete-post red' }
                        ]}
                    />
                  </div>
                )
              })
            }
          </div>
        </section>
  
  
        <section ref={uffRef} className="user-followers-following">
          <span> <FaTimes /> </span>
          <div className="user-followers-following-main-div">
            <header>
              <input autoComplete='off' type="text" placeholder={`Search ${section.current}`} value={search} onChange={ e => setSearch(e.target.value) } />
              <button>
                followers
              </button> 
              <button>
                following
              </button>
            </header>
  
            <div className="search-results">
              {searchResult?.map(result => <ProfileList key={result.id} result={result} type={section.current} /> )}
            </div>
          </div>
        </section>

        <button className='new-post-icon' onClick={() => {
          if (user) {
            setShowForm(true)
          } else {
            navigate('/login')
          }
        } }>
          <FaPlus />
        </button>
        <Form />

        <Footer />
      </main>
    )
  }
}

export default Profile