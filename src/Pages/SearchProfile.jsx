import React, { useContext, useEffect, useRef, useState } from 'react'
import { appContext } from '../App'
import { FaCog, FaTimes, FaPlus } from 'react-icons/fa'
import Button from '../Components/Button'
import Post from '../Components/Post'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { db, directMessagesRef } from '../firebase/config'
import Options from '../Components/Options'
import Header from '../Components/Header'
import LoadPosts from '../Components/LoadPosts'
import ProfileList from '../Components/ProfileList'
import blockedUserPfp from '../Images/blocked-user.jpg'
import PageOptions from '../Components/PageOptions'
import Nav from '../Components/Nav'
import Footer from '../Components/Footer'
import Form from '../Components/Form'
import verifiedBadge from '../Images/verified-badge.jpg'



const SearchProfile = () => {
  const {
    users, setShowForm, searchedUser, setSearchedUser, user, location, currentUserPage, setCurrentUserPage, directMessages, setShowOptionsDiv, showOptionsDIv, userAuth, gError, setGlobalError, windowWidth, allPosts, showVerifiedMessage, setShowVerifiedMessage, VerifiedMessageRef, followStory, storyType, userStories, followingStories, setShowShareMenu, showShareMenu
  } = useContext(appContext)
  const { userId } = useParams()
  const section = useRef('followers')
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [sectionTrigger, setSectionTrigger] = useState(true)
  const postType = useRef('All')
  const [postTypeArr, setPostTypeArr] = useState([])
  const postId = useRef('')
  const [loading, setLoading] = useState(true)
  const [userFollowers, setUserFollowers] = useState([])
  const [userFollowing, setUserFollowing] = useState([])
  const [blockList, setBlockList] = useState([])
  const [isBlocked, setIsBlocked] = useState(false)
  const [didBlock, setDidBlock] = useState(false)
  const [personStories, setPersonStories] = useState([])
  const [showPageOptionsDiv, setShowPageOptionsDiv] = useState(false)
  const uffRef = useRef()
  const routeTo = useRef()
  const loadArr = [1, 2]
  const navigate = useNavigate()

  const darkMode = document.querySelector('.dark-mode')

  const paraCondition = currentUserPage?.dmId.localeCompare(user?.dmId)
  let para 
  if (paraCondition === 1) {
    para = user?.dmId + currentUserPage?.dmId
    routeTo.current = `/messages/${para}`
  } else {
    para = currentUserPage?.dmId + user?.dmId
    routeTo.current = `/messages/${para}`
  }

  useEffect(() => {
    if(currentUserPage) {
      setTimeout(() => {
        setLoading(false)
      }, 1000)

      let arr = []
      for(let i = 0; i < currentUserPage?.followers.value.length; i++) {
        arr.push(users.find(user => user.id === currentUserPage?.followers.value[i]))
      }
      setUserFollowers(arr)

      let arr2 = []
      for(let i = 0; i < currentUserPage?.following.value.length; i++) {
        arr2.push(users.find(user => user.id === currentUserPage?.following.value[i]))
      }
      setUserFollowing(arr2)

      setBlockList(currentUserPage?.blocked.value)
    }
  }, [currentUserPage])

  useEffect(() => {
    const condition = blockList.find(user => user === userAuth)
    if (condition) {
      setIsBlocked(true)
    } else {
      setIsBlocked(false)
    }

    const conditionII = user?.blocked.value.find(person => person === userId)
    if (conditionII) {
      setDidBlock(true)
    } else {
      setDidBlock(false)
    }
  }, [blockList])


  useEffect(() => {
    if(!loading) {
      const followersFollowing = document.querySelector('.user-followers-following')
      const buttons = document.querySelectorAll('.user-followers-following header button')
      const followersFollowingDiv = document.querySelector('.followers-following')
      const span = followersFollowing?.querySelector('span')
      const divs = followersFollowingDiv?.querySelectorAll('div')

      if (userId) {
        if (section.current === 'followers') {
          setSearchResult(userFollowers.filter(user => user.username.includes(search)))
        } else if (section.current === 'following') {
          setSearchResult(userFollowing.filter(user => user.username.includes(search)))
        }
      }

      buttons.forEach(btn => {
        btn.addEventListener('click', e => {
          section.current = e.currentTarget.textContent
          setSectionTrigger(!sectionTrigger)
          if (userId) {
            if (section.current === 'followers') {
              setSearchResult(userFollowers.filter(user => user.username.includes(search)))
            } else if (section.current === 'following') {
              setSearchResult(userFollowing.filter(user => user.username.includes(search)))
            }
          }
    
        })
      })

      function spanFtn() {
        uffRef.current.classList.remove('show-div')
      }
      span?.addEventListener('click', spanFtn )

      function divFtn(e) {
        section.current = ''
        const classList = e.currentTarget.classList.value
        if (!classList) {
          return
        } else {
          section.current = e.currentTarget.classList.value
          setSectionTrigger(!sectionTrigger)
          uffRef.current.classList.add('show-div')
        }
      }
      divs.forEach(div => {
        div.addEventListener('click', e => divFtn(e)  )
      })

        
      return () => {
        divs?.forEach(div => {
          div.removeEventListener('click', e => divFtn)
        })
        span?.removeEventListener('click', spanFtn )
      }
    }
  }, [sectionTrigger, user, user?.following.value, user?.followers.value, currentUserPage?.followers.value, currentUserPage?.following.value, search, userId, loading])

  useEffect(() => {
    setSearchedUser(users.find(user => user.id === userId))
    setCurrentUserPage(users.find(user => user.id === userId))
  }, [users, userId])

  
  useEffect(() => {
    setPostTypeArr(currentUserPage?.posts.value)
    if(!loading) {
      const postTypeNav = document.querySelector('.post-type-nav')
      const btns = postTypeNav.querySelectorAll('button')

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          postType.current = btn.textContent
          if (btn.textContent === 'All') {
            setPostTypeArr(currentUserPage?.posts.value)

          } else if (btn.textContent === 'Media') {
            setPostTypeArr(currentUserPage?.posts.value?.filter(post => post.type !== 'Text'))

          } else if (btn.textContent === 'Text') {
            setPostTypeArr(currentUserPage?.posts.value?.filter(post => post.type === 'Text'))

          }  else if (btn.textContent === 'Likes') {
            let arr = []
            for (let i = 0; i < currentUserPage?.likes.value.length; i++) {
              const like = allPosts.find(post => post.id === currentUserPage?.likes.value[i])
              if (like) {
                arr.push(like)
              }
            }
            setPostTypeArr(arr)
          } 
        })
      })
    }
  }, [postType.current, currentUserPage, loading])

  useEffect(() => {
    if(!loading) {
      const condition = JSON.parse(localStorage.getItem('indicator')) === userId
      if (condition) {
        return
      } else {
        window.location.reload(true)
        localStorage.setItem('indicator', JSON.stringify(userId))
      }
    }
  }, [location, userId, loading]);

  const finish = () => {
    const meRef = doc(db, 'users', user.id)
    const otherUserRef = doc(db, 'users', currentUserPage.id)

    let userF
    onSnapshot(meRef, doc => {
      userF = doc.data()

      let otherUserF
      onSnapshot(otherUserRef, doc => {
        otherUserF = doc.data()

        const meCondition = userF.following.value.find(user => user === currentUserPage.id)
        const otherUserCondition = otherUserF.following.value.find(person => person === user.id)
        if (meCondition && otherUserCondition) {
          
          const cond = userF.friends.value.find(friend => friend === currentUserPage.id)
          const condII = otherUserF.friends.value.find(friend => friend === user.id)

          if (!cond && !condII) {
            updateDoc(meRef, {
              friends: {
                value: [...user.friends.value, userId]
              }
            }).then(() => {
              updateDoc(otherUserRef, {
                friends: {
                  value: [...user.friends.value, userAuth]
                }
              })
            })
          }
          
        } else {
          const meArr = user.friends.value.filter(friend => friend !== userId)
          updateDoc(meRef, {
            friends: {
              value: [...meArr]
            }
          }).then(() => {
            const otherArr = currentUserPage.friends.value.filter(friend => friend !== userAuth)
            updateDoc(otherUserRef, {
              friends: {
                value: [...otherArr]
              }
            })
          })
        }
      })
    })
  }

  const handleFollow = async (id) => {
    const condition = user.following.value.find(follower => follower === id)
    const otherRef = doc(db, 'users', id)
    const meRef = doc(db, 'users', userAuth)
    try {
     if(condition) {
        const meArr = user.following.value.filter(follow => follow !== id)
        updateDoc(meRef, {
          following: {
            value: [...meArr]
          }
        })

        const otherArr = currentUserPage.followers.value.filter(follower => follower !== userAuth)
        updateDoc(otherRef, {
          followers: {
            value: [...otherArr]
          }
        })
     } else {
        updateDoc(meRef, {
         following: {
           value: [...user.following.value, id]
         }
        })

       updateDoc(otherRef, {
         followers: {
           value: [...currentUserPage.followers.value, userAuth]
         }
       })
     }
    } catch(err) {
      console.log(err.message)
    } finally {
      finish()
    }
  }

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
    if (currentUserPage) {
      const userRef = collection(db, 'users', currentUserPage.id, 'stories')
      onSnapshot(userRef, snap => {
        const arr = []
        snap.docs.forEach(doc => {
          arr.push({...doc.data(), id:doc.id})
        })
        setPersonStories([...arr])
      })
    }
  }, [currentUserPage])

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

  function yoursViewed() {
    let res
    personStories.map(story => {
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
  } else if (!loading && !isBlocked) {
    return (
      <main className="profile-main" role={'button'} onClick={() => {
        setShowForm(false)
        if (showShareMenu) {
          setShowShareMenu(false)
        }
      }}>
        { windowWidth > 799 && <Header />}
        { windowWidth > 799 && <Nav />}
        <PageOptions showPageOptionsDiv={showPageOptionsDiv} setShowPageOptionsDiv={setShowPageOptionsDiv}
          func={[
          { id: userId , text: 'Bookmark page', prop: 'bookmark-page' },
          {
            id: userId, text: `${didBlock ? 'Unblock user' : 'Block user'}`,
            prop:`${didBlock ? 'unblock-user' : 'block-user red'}`,
          }
          ]} 
        />
        <div className="settings-div">
          {
            userId === userAuth ?
              <Link to='/profile/settings' >
                <FaCog />
              </Link>
            :  
            <div className='page-upper-sect-options' onClick={() => {
              setShowPageOptionsDiv(!showPageOptionsDiv)
            }}>
              <p>.</p>
              <p>.</p>
              <p>.</p>
            </div>
          }
        </div>
        
        <section className="profile-desc-sect">
          <div className="profile-pfp-followers">
  
            <div className="profile-username">
              <h3> {searchedUser?.displayName} </h3>
              <p>
                @{searchedUser?.username}
                {searchedUser?.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} alt="" onClick={() => {
                  setShowVerifiedMessage(!showVerifiedMessage)
                }}/> }
              </p>
            </div>
  
            <>
              {mineViewed() ?
                <Link
                  to={personStories[0] !== undefined && `/f/stories/${currentUserPage?.username}/${personStories[0]?.id}`}
                  state={{ url: location.pathname, user: currentUserPage }}
                  style={{
                    border: personStories?.length < 1 ? 'none' : '2px solid gray'
                  }}
                  className="profile-pfp"
                  onClick={() => {
                    followStory.current = currentUserPage?.id
                    storyType.current = currentUserPage?.id === userAuth ? 'user' : 'following'
                  }}
                >
                  <img src={currentUserPage?.avatarUrl} alt="" />
                </Link>
                :
                <Link
                  to={personStories[0] !== undefined && `/f/stories/${currentUserPage?.username}/${personStories[0]?.id}`}
                  state={{ url: location.pathname, user: currentUserPage }}
                  style={{
                    border: personStories?.length < 1 ? 'none' : '2px solid red'
                  }}
                  className="profile-pfp"
                  onClick={() => {
                    followStory.current = currentUserPage?.id
                    storyType.current = currentUserPage?.id === userAuth ? 'user' : 'following'
                  }}
                >
                  <img src={currentUserPage?.avatarUrl} alt="" />
                </Link>
              }
            </>
  
  
            <div className="followers-following-div">
              <div className="followers-following">
                <div className="followers">
                  <h1>{searchedUser?.followers.value?.length || 0}</h1>
                  <p>Followers</p>
                </div>
  
                <div className="following">
                  <h1> {searchedUser?.following.value?.length || 0} </h1>
                  <p>Following</p>
                </div>
  
                <div>
                  <h1>{searchedUser?.posts.value?.length} </h1>
                  <p>Posts</p>
                </div>
              </div>
  
              {userId !== userAuth &&
                <div className="followers-following-after">
                  <button className='follow-btn'
                    style={
                      darkMode ? currentUserPage?.followers.value.find(follower => follower === userAuth) ? { backgroundColor: 'steelblue', color: 'white' } : { backgroundColor: 'black', color: 'white' }
                        :
                        currentUserPage?.followers.value.find(follower => follower === userAuth) ? { backgroundColor: 'steelblue', color: 'white' } : { backgroundColor: 'white', color: 'black' }
                    }
                    onClick={() => {
                      handleFollow(searchedUser.id)
                    }} >
                    {currentUserPage?.followers.value.find(follower => follower === userAuth) ? 'unfollow' : 'follow' }
                  </button>
                  <button>
                    <Link state={currentUserPage}
                      to={userAuth && routeTo.current}
                    >
                      Message
                    </Link>
                  </button>
                </div>
              }
            </div>
          </div>
  
          <div className='about-div'>
            <p className="profile-about">
             {searchedUser?.about}
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
            {postTypeArr?.map((post, index) => {
              const { creator } = post
              return (
                <div key={post.id}>
                  {creator === userAuth ?
                    <>
                      {index !== 0 && <hr />}
                      <Post post={post} postId={postId}
                        func={[
                          { id: postId.current, text: 'Bookmark post', prop: 'bookmark-post' },
                          { id: postId.current, text: 'Delete post', prop: 'delete-post red' }
                        ]}
                      />
                    </>
                  : 
                    <>
                      {index !== 0 && <hr />}
                      <Post post={post} postId={postId}
                        func={[
                          { id: postId.current, text: 'Bookmark post', prop: 'bookmark-post' }
                        ]}
                      />
                    </>
                  }
                </div>
              )
            })}
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
              {search && searchResult?.map(result => <ProfileList key={result.id} result={result} type={section.current} userId={userId} />)}

              {section.current === 'followers' && !search && userFollowers.map(follower => <ProfileList key={follower.id} result={follower} type={section.current} userId={userId} />)}

              {section.current === 'following' && !search && userFollowing.map(follow => <ProfileList key={follow.id} result={follow} type={section.current}userId={userId}  />)}
            </div>
          </div>
        </section>
        <button className='new-post-icon' onClick={() => {
          if (userAuth) {
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
  } else if (!loading && isBlocked) {
    return (
      <main className="profile-main" role={'button'} onClick={() => setShowForm(false)}>
        { windowWidth > 799 && <Header />}
        { windowWidth > 799 && <Nav />}
        <div className="overlay" role={'button'} onClick={() => setShowOptionsDiv(false)}>
        </div>
        <Options func={[
          { id: userId , text: 'Bookmark page', prop: 'bookmark-page' },
          {
            id: userId, text: `${didBlock ? 'Unblock user' : 'Block user'}`,
            prop:`${didBlock ? 'unblock-user' : 'block-user red'}`,
          }
          ]}
        />
        <div className="settings-div">
          {
            userId === userAuth ?
              <Link to='/profile/settings' >
                <FaCog />
              </Link>
            :  
            <div className='upper-sect-options' onClick={() => {
              setShowOptionsDiv(!showOptionsDIv)
            }}>
              <p>.</p>
              <p>.</p>
              <p>.</p>
            </div>
          }
        </div>
        
        <section className="profile-desc-sect">
          <div className="profile-pfp-followers">
  
            <div className="profile-username">
              <h3> {searchedUser?.displayName} </h3>
              <p> @{searchedUser?.username} </p>
            </div>
  
            <div className="profile-pfp">
              <img src={blockedUserPfp} alt="" />
            </div>
  
  
            <div className="followers-following-div">
              <div className="followers-following">
                <div className="followers">
                  <h1>0</h1>
                  <p>Followers</p>
                </div>
  
                <div className="following">
                  <h1> 0 </h1>
                  <p>Following</p>
                </div>
  
                <div className="posts">
                  <h1>0 </h1>
                  <p>Posts</p>
                </div>
              </div>
  
              
            </div>
          </div>
  
          <div className='about-div'>
            <p className="profile-about">
            </p>
          </div>
        </section>
        
  
  
        <section className="profile-posts-sect">
          <div className="post-type-nav">
            <button>All</button>
            <button>Text</button>
            <button>Media</button>
            <button>Likes</button>
          </div>
  
          <div className="profile-posts-b">
            <h2>
              {currentUserPage?.username} blocked you.
            </h2>
          </div>
        </section>
        <Footer />
      </main>
    )
  }
}

export default SearchProfile