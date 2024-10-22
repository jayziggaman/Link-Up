import React, { useContext, useEffect, useRef, useState } from 'react'
import { appContext } from '../App'
import CloseIcon from '@mui/icons-material/Close';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Button from '../COMPONENTS/Button'
import Post from '../COMPONENTS/Post'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Header from '../COMPONENTS/Header'
import LoadPosts from '../COMPONENTS/LoadPosts'
import ProfileList from '../COMPONENTS/ProfileList'
import Nav from '../COMPONENTS/Nav'
import Footer from '../COMPONENTS/Footer'
import VerifiedBadge from '../COMPONENTS/GENERAL-COMPONENTS/VerifiedBadge';
import MediaNotFound from '../COMPONENTS/GENERAL-COMPONENTS/MediaNotFound';
import { db, postsRef, usersRef } from '../firebase/config';
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { compareStrings } from '../GENERAL-FUNCTIONS/functions';
import UserPfp from '../COMPONENTS/GENERAL-COMPONENTS/UserPfp';
import NewPostIcon from '../ICONS/NewPostIcon';
import { functionsContext } from '../CONTEXTS/FunctionsContext';
import Options from '../COMPONENTS/GENERAL-COMPONENTS/Options';
import ReplyView from '../COMPONENTS/ReplyView';
import Comment from '../COMPONENTS/Comment';

const Profile = ({ profileFor }) => {
  
  const {
    setShowPostForm, user, windowWidth, allPosts, users, setShowVerifiedMessage, showVerifiedMessage, userStories, showShareMenu, setShowShareMenu, splitRegex,  searchedUser, setSearchedUser
  } = useContext(appContext)
  const { isLinkElement, hrefChecker, routeToLogin, bookmarkPage, removeBookmarkPage, blockUser, unblockUser, isStoryViewed } = useContext(functionsContext)

  const { userName } = useParams()
  
  const [USER, SETUSER] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [section, setSection] = useState(null)
  const [searchResult, setSearchResult] = useState([])
  const [postType, setPostType] = useState('All')
  const [postsArr, setPostsArr] = useState(null)
  const [USERSTORIES, SETUSERSTORIES] = useState(null)
  const [search, setSearch] = useState('')
  const [userFollowers, setUserFollowers] = useState(null)
  const [userFollowing, setUserFollowing] = useState(null)
  const [userPosts, setUserPosts] = useState(null)
  const [dmUrl, setDmUrl] = useState(null)
  const [showOptionsDiv, setShowOptionsDiv] = useState(false)
  
  //are you blocked by user
  const [isBlocked, setIsBlocked] = useState(false)

  //did you block user
  const [didBlock, setDidBlock] = useState(false)
  const [personStories, setPersonStories] = useState(null)

  const uffRef = useRef()
  const optionId = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()


  useEffect(() => {
    if (profileFor !== 'search') {
      if (routeToLogin()) {
        navigate('/auth?type=login');
      }
    }
  }, [])
  

  useEffect(() => {
    if (users && userName) {
      setSearchedUser(users.find(user => user.username.trim() === userName.trim()))
    }
  }, [users, userName])


  useEffect(() => {
    if (profileFor === "search") {
      if (searchedUser) {
        SETUSER(searchedUser)
      }

    } else {
      if (user && user.id) {
        SETUSER(user)
      }
    }

    if (user && user.id && searchedUser) {
      setDmUrl(compareStrings(user.id, searchedUser.id))
    }
  }, [user, searchedUser])
  


  useEffect(() => {
    if (!searchParams.get("section")) {
      setSection("followers")

    } else (
      setSection(searchParams.get("section"))
    )
  }, [searchParams])


  const searchItem = (array, property, term) => {
    const newArray = []

    array.map(item => {
      if (item[property].toLowerCase().trim().includes(term.toLowerCase().trim())) {
        newArray.push(item)
      }
    })

    return newArray
  }


  useEffect(() => {
    if(USER && userFollowers && userFollowing && userPosts && postsArr && section && USERSTORIES) {
      setLoading(false)
    }
  }, [USER, userFollowers, userFollowing, postsArr, userPosts, section, USERSTORIES])



  useEffect(() => {
    if (USER) {
      // get followers
      let arr = []
      for (let i = 0; i < USER.followers.value.length; i++) {
        const follower = users.find(person => person.id === USER.followers.value[i])
        follower && arr.push(follower)
      }
      setUserFollowers(arr)

      //get following
      let arr2 = []
      for (let i = 0; i < USER.following.value.length; i++) {
        const following = users.find(person => person.id === USER.following.value[i])
        following && arr2.push(following)
      }
      setUserFollowing(arr2)

      // check if account blocked user
      const condition = USER.blocked.value.find(person => person === user.id)
      if (condition) {
        setIsBlocked(true)

      } else {
        setIsBlocked(false)
      }

      // check if user blocked account
      if (user?.id) {
        const conditionII = user.blocked.value.find(person => person === USER.id)
        if (conditionII) {
          setDidBlock(true)

        } else {
          setDidBlock(false)
        }
      }

      // get USER posts
      let loadingPosts = []
      for (let i = 0; i < USER.posts.value.length; i++) {
        const post = allPosts.find(post => post.id === USER.posts.value[i].id)
        post && loadingPosts.push(post)
      }
      setUserPosts(loadingPosts)
    }
  }, [USER, allPosts, user])


  useEffect(() => {
    if (USER) {
      const { id } = USER
      
      if (profileFor === 'search') {
        if (id === user?.id) {
          SETUSERSTORIES([...userStories])

        } else {
          const storiesRef = collection(usersRef, id, 'stories')
          const storyQuery = query(storiesRef, orderBy('createdAt', 'asc'))

          onSnapshot(storyQuery, snap => {
            const arr = []
            snap.docs.forEach(doc => {
              arr.push({...doc.data(), id: doc.id})
            })
            SETUSERSTORIES([...arr])
          })
        }

      } else {
        SETUSERSTORIES([...userStories])
      }
    }
  }, [USER, userStories])



  useEffect(() => {
    if(!loading) {
      const followersFollowing = document.querySelector('.user-followers-following')
      const buttons = document.querySelectorAll('.user-followers-following header button')
      const followersFollowingDiv = document.querySelector('.followers-following')
      const span = followersFollowing.querySelector('span')
      const divs = followersFollowingDiv.querySelectorAll('div')

      const postTypeNav = document.querySelector('.post-type-nav')
      const postTypeBtns = postTypeNav.querySelectorAll('button')

      function btnFtn(e) {
        searchParams.set('section', e.currentTarget.textContent);
        setSearchParams(searchParams);
      }
      buttons.forEach(btn => btn.addEventListener('click', e => btnFtn(e)))

      function spanFtn() {
        uffRef.current.classList.remove('show-div')
        setSearch("")
      }
      span.addEventListener('click', spanFtn )


      function divFtn(e) {
        const classList = e.currentTarget.classList.value
        if (!classList) {
          return

        } else {
          searchParams.set('section', classList);
          setSearchParams(searchParams);
          
          uffRef.current.classList.add('show-div')
        }
      }
      divs.forEach(div => {
        div.addEventListener('click', e => divFtn(e)  )
      })

      function changePostType(text) {
        setPostType(text)
      }

      postTypeBtns.forEach(btn => {
        btn.addEventListener('click', e => changePostType(e.currentTarget.textContent))
      })

        
      return () => {
        buttons.forEach(btn => btn.removeEventListener('click', () => btnFtn()))
        postTypeBtns.forEach(btn => btn.removeEventListener('click', () => changePostType()))
        divs.forEach(div => div.removeEventListener('click', () => divFtn()))
        span.removeEventListener('click', spanFtn)
      }
    }
  }, [loading])



  useEffect(() => {
    if (!loading) {
      let newArray

      if (section === 'following') {
        newArray = searchItem(userFollowing, "username", search)
      }
  
      if (section === 'followers') {
        newArray = searchItem(userFollowers, "username", search)
      }

      setSearchResult(newArray)
    }
  }, [search, userFollowers, userFollowing, section, loading])



  useEffect(() => {
    if (userPosts) {
      if (postType === 'All') {
        setPostsArr([...userPosts])
    
      } else if (postType === 'Media') {
        setPostsArr(userPosts.filter(post => post.type !== 'Text'))
    
      } else if (postType === 'Text') {
        setPostsArr(userPosts.filter(post => post.type === 'Text'))
    
      } else if (postType === 'Likes') {
        const userLikes = USER.likes.value

        const likedPosts = []
        userLikes.map(like => {
          const { id, postId, commentId, replyId, type } = like

          if (type === 'post') {
            const thisPost = allPosts.find(like => like.id === id)

            if (thisPost) {
              likedPosts.push({...thisPost, likeType: type})
            }

          } else if (type === 'comment') {
            const docRef = doc(postsRef, postId, 'comments', commentId)

            return new Promise((resolve, reject) => {
              onSnapshot(docRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                  likedPosts.push({...docSnapshot.data(), likeType: type})
                } 
              }, (error) => {
                reject(error);
              });
            });

          } else if (type === 'reply') {
            const docRef = doc(postsRef, postId, 'comments', commentId, 'replies', replyId)

            return new Promise((resolve, reject) => {
              onSnapshot(docRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                  likedPosts.push({...docSnapshot.data(), likeType: type})
                } 
              }, (error) => {
                reject(error);
              });
            });
          }
        })
        setPostsArr([...likedPosts.reverse()])
      } 
    }
  }, [postType, userPosts, allPosts])



  useEffect(() => {
    if (user && user.id && searchedUser) {
      if (user.id !== searchedUser.id) {
        const meRef = doc(db, "users", user.id)
        const otherUserRef = doc(db, "users", searchedUser.id)

        const conditionI = user.following.value.find(user => user === searchedUser.id)
        const conditionII = searchedUser.following.value.find(person => person === user.id)

        if (conditionI && conditionII) {
          const friendsBefore = user.friends.value.find(user => user === searchedUser.id) && searchedUser.friends.value.find(person => person === user.id)

          if (friendsBefore) {
            return

          } else {
            updateDoc(meRef, {
              friends: {
                value: [...user.friends.value, searchedUser.id]
              }
            })
            
            updateDoc(otherUserRef, {
              friends: {
                value: [...user.friends.value, user.id]
              }
            })
          } 

        } else {
          const meArr = user.friends.value.filter(friend => friend !== searchedUser.id)
          updateDoc(meRef, {
            friends: {
              value: [...meArr]
            }
          })
          
          const otherArr = searchedUser.friends.value.filter(friend => friend !== user.id)
          updateDoc(otherUserRef, {
            friends: {
              value: [...otherArr]
            }
          })
        }
      }
    }
  }, [user, searchedUser])



  useEffect(() => {
    if (showShareMenu) {
      setShowShareMenu(false)
    }
  }, [windowWidth])
  
  

  const handleFollow = async (id) => {
    const condition = user.following.value.find(follower => follower === id)
    const otherRef = doc(db, 'users', id)
    const meRef = doc(db, 'users', user.id)

    if(condition) {
      const meArr = user.following.value.filter(follow => follow !== id)
      updateDoc(meRef, {
        following: {
          value: [...meArr]
        }
      })

      const otherArr = searchedUser.followers.value.filter(follower => follower !== user.id)
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
          value: [...searchedUser.followers.value, user.id]
        }
      })
    }
  }


  
  


  const regex = /\b(https?:\/\/[^\s/$.?#].[^\s]*|www\.[^\s]+)\b/g;


  
  if (loading) {
    return (
      <Loading />
    )

  } else {
    const { id, username, displayName, about, userType } = USER

    const storyCreator = id === user?.id ? 'user' : 'following' 

    const storyLink = USERSTORIES.length === 0 ? '' :
      `/stories/${username}/${[USERSTORIES[0].id]}?storyBy=${storyCreator}`

    const callBookmarkPage = () => bookmarkPage(id);
    const callRemoveBookmarkedPage = () => removeBookmarkPage(id);
    const callBlockUser = () => blockUser(id);
    const callUnblockUser= () => unblockUser(id);


    const functionsForOption = [
      ...(user?.id && user.pageSaves.value.find(save => save.postId === id) ?
        [{ text: 'Remove from profile bookmarks', func: callRemoveBookmarkedPage }] :
        [{ text: 'Bookmark profile', func: callBookmarkPage }]),
      
        ...(didBlock ?
        [{ text: `Unblock ${username}`, func: callUnblockUser }] :
        [{ text: `Block ${username}`, func: callBlockUser, color: 'red' }])
    ];


    let isFollowing = user?.following?.value?.find(user => user === id)


    return (
      <main className="profile-main" role={'button'} onClick={() => {
        setShowPostForm(false)
        if (showShareMenu) {
          setShowShareMenu(false)
        }
      }}>
        {windowWidth > 699 && <Header />}
        {windowWidth > 699 && <Nav />}

        {user?.id &&
          <Options
            optionId={optionId} functions={functionsForOption}
            setShowOptionsDiv={setShowOptionsDiv} showOptionsDiv={showOptionsDiv}
          />
        }
        
        <div className="settings-div">
          {profileFor === 'search' ?
            <button className='page-options-div'
              onClick={() => {
                optionId.current = id
                setShowOptionsDiv(!showOptionsDiv)
              }}
            >
              <MoreHorizIcon />
            </button>
            :
            <Link to='/settings' >
              <SettingsOutlinedIcon />
            </Link>
          }
        </div>
        
        <section className="profile-desc-sect">
          <div className="profile-pfp-followers">
  
            <div className="profile-username">
              <h3>
                {displayName}

                {userType === 'creator' &&
                  <span
                    onClick={() => setShowVerifiedMessage(!showVerifiedMessage)}
                  >
                    <VerifiedBadge fontSize={"1.25rem"} />
                  </span>
                }
              </h3>
              <p>
                @{username}
              </p>
            </div>
  
            <>
              {isBlocked ?
                <div className="profile-pfp">
                  <UserPfp />
                </div>
                :
                <Link
                  to={storyLink} role={'button'}
                  state={{ from: location.pathname }}
                  className={`profile-pfp ${!isStoryViewed(USER, USERSTORIES) ? "active" : ""}`}
                  style={{
                    backgroundColor: !USERSTORIES[0] ? 'transparent' : '',
                    border: !USERSTORIES[0] ? 'none' : '',
                  }}
                >
                  <UserPfp user={USER} />
                </Link>
              }
            </>
  
  
            <div className="followers-following-div">
              <div className="followers-following">
                <div className="followers">
                  <h1>
                    {isBlocked ? 
                      0
                      :
                      <>
                        {userFollowers.length || 0}
                      </>
                    }
                  </h1>

                  <p>
                    {userFollowers.length === 1 ? 'Follower' : 'Followers'}
                  </p>
                </div>
  
                <div className="following">
                  <h1>
                    {isBlocked ? 
                      0
                      :
                      <>
                        {userFollowing.length || 0}
                      </>
                    }
                  </h1>

                  <p>Following</p>
                </div>
  
                <div>
                  <h1>
                    {isBlocked ? 
                      0
                      :
                      <>
                        {userPosts.length || 0}
                      </>
                    }
                  </h1>
                  <p>Posts</p>
                </div>
              </div>

              {!isBlocked && !didBlock &&
                <div className="followers-following-after">
                  {user && searchedUser && searchedUser.id !== user.id && dmUrl &&
                    <>
                      <button className={`follow-btn ${isFollowing ? 'following' : ''}`}
                        onClick={() => {
                          handleFollow(USER.id)
                        }} >
                        {USER.followers.value.find(follower => follower === user.id) ? 'Unfollow' : 'Follow'}
                      </button>
                      
                      <button>
                        <Link state={{from: location.pathname, user: USER}} 
                          to={`/messages/${dmUrl}`}
                        >
                          Message
                        </Link>
                      </button>
                    </>
                  }
                </div>
              }
            </div>
          </div>
  
          <div className='about-div'>
            <pre className="profile-about">
              {/* {!isBlocked && !didBlock ? `${about}` : ''} */}
              {!isBlocked && !didBlock ? 
                <Bio bio={about}/>
              : ''}


              {/* {about.split(/(\.\s|,\s|:\s|;\s|\s)/).map((el, ind) => {
                if (isLinkElement(el)) {
                  return (
                    <a key={ind} target="_blank" href={hrefChecker(el)}
                      className={ind === 0 ? 'prof-about-first' : ''}
                    >
                      {el}
                    </a>
                  )
                  
                } else {
                  return (
                    <span key={ind}
                      className={ind === 0 ? 'prof-about-first' : ''}
                    >
                      {el}
                    </span>
                  )
                }
              })
              } */}
            </pre>
          </div>
        </section>
        
  
  
        <section className="profile-posts-sect">
          <div className="post-type-nav">
            <Button postType={postType} textContent='All' />
            <Button postType={postType} textContent='Text' />
            <Button postType={postType} textContent='Media' />
            <Button postType={postType} textContent='Likes' />
          </div>
  
          {isBlocked ?
            <div className="profile-posts-b">
              <h2>
                {displayName} blocked you.
              </h2>
            </div>
            
            : didBlock ?
              <div className="profile-posts-b">
                <h2>
                  You blocked {displayName}
                </h2>
              </div>

            : <div className="profile-posts">
              {postsArr.length > 0 &&
                <>
                  {postsArr.map((post, ind) => {
                    const { id, postType } = post
                    
                    if (postType) {
                      return (
                        <div key={id} className='post-div'>
                          {ind !== 0 && <hr />}
  
                          {postType === "post" ?
                            <Post key={post.id} post={post} />
  
                            : postType === 'comment' ?
                              <Comment key={post.id} post={post} />
  
                              : postType === 'reply' ?
                                <ReplyView key={post.id} post={post} />
                                : <></>
                          }
                        </div>
                      )

                    } else {
                      return (
                        <Post key={post.id} post={post} />
                      )
                    }
                  })}
                </>
              }

              {postsArr.length === 0 &&
                <MediaNotFound
                  headerText={"No Posts found "}
                  text={
                  postType === 'All' ?
                  `When ${profileFor === 'user' || id === user?.id ? "you" : displayName} posts it'll appear here`

                  : postType === 'Text' ?
                  `When ${profileFor === 'user' || id === user?.id ? "you" : displayName} posts it'll appear here`
              
                  : postType === 'Media' ?
                  `When ${profileFor === 'user' || id === user?.id ? "you" : displayName} posts it'll appear here`
                
                  : postType === 'Likes' &&
                  `When ${profileFor === 'user' || id === user?.id ? "you" : displayName} likes a post it'll appear here`
                  }
                />
              }
            </div>
          }
        </section>
  
  
        <SearchFollowers
          uffRef={uffRef} section={section} search={search}
          searchResult={searchResult} userFollowers={userFollowers}
          userFollowing={userFollowing} setSearch={setSearch} user={USER}
        />

        <NewPostIcon />

        <Footer />
      </main>
    )
  }
}

export default Profile



const Loading = () => {
  const { windowWidth } = useContext(appContext)
  
  return (
    <main className="profile-main-loading profile-main">
      {windowWidth > 699 && <Header />}
      {windowWidth > 699 && <Nav />}

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
          {[1, 1,1,1,1,1,1].map((item, index) => <LoadPosts key={index} />)}
        </div>
      </div>
      <Footer />
    </main>
  )
}


const SearchFollowers = ({
  uffRef, section, search, userFollowers, userFollowing, searchResult, setSearch, user
}) => {
  
  return (
    <section ref={uffRef} className="user-followers-following">
      <span>
        <CloseIcon />
      </span>
      
      <div className="user-followers-following-main-div">
        <header>
          <button>
            followers
          </button> 

          <button>
            following
          </button>

          <input autoComplete='off' type="text"
            placeholder={`Search ${section}`} value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </header>

        <div className="search-results">
          {searchResult.length === 0 ?
            <MediaNotFound
              headerText={"No users found "}
            />
            :
            <>
              {search !== "" ?
                <>
                {searchResult.map(result =>
                    <ProfileList key={result.id} result={result}
                      type={section} person={user}
                    />)
                  }
                </>

              : section === 'following' ?
                <>
                {userFollowing.map(result =>
                    <ProfileList key={result.id} result={result}
                      type={section} person={user}
                    />)
                  }
                </>

              : section === 'followers' &&
                <>
                {userFollowers.map(result =>
                    <ProfileList key={result.id} result={result}
                      type={section} person={user}
                    />)
                  }
                </>
              }
            </>
          }
        </div>
      </div>
    </section>
  )
}



const Bio = ({ bio }) => {
  const formatBio = (text) => {
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Replace URLs with anchor tags
    const formattedText = text.split('\n').map((line, index) => (
      <p key={index}>
        {line.split(urlRegex).map((part, i) => {
          if (urlRegex.test(part)) {
            return (
              <a key={i} href={part} target="_blank" rel="noopener noreferrer">
                {part}
              </a>
            );
          }
          return part;
        })}
      </p>
    ));

    return formattedText;
  };

  return (
    <div>
      {formatBio(bio)}
    </div>
  );
};

