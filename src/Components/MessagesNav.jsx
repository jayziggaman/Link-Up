import React, { useContext, useState } from 'react'
import { appContext } from '../App'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { faMessage, faHome, faSearch, faBell, faUser, faBars, faCog, faBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { auth } from '../firebase/config';
import notificationsInactiveIcon from '../img-icons/notifications-inactive.JPG'
import notificationsActiveIcon from '../img-icons/notifications-active.JPG'
import messagesInactiveIcon from '../img-icons/messages-inactive.JPG'
import messagesActiveIcon from '../img-icons/messages-active.JPG'
import searchInactiveIcon from '../img-icons/search-inactive.JPG'
import searchActiveIcon from '../img-icons/search-active.JPG'
import dmNotificationsInactiveIcon from '../img-icons/dm-notifications-inactive.JPG'
import dmNotificationsActiveIcon from '../img-icons/dm-notifications-active.JPG'
import dmMessagesInactiveIcon from '../img-icons/dm-messages-inactive.JPG'
import dmMessagesActiveIcon from '../img-icons/dm-messages-active.JPG'
import dmSearchInactiveIcon from '../img-icons/dm-search-inactive.JPG'
import dmSearchActiveIcon from '../img-icons/dm-search-active.JPG'
import { signOut } from 'firebase/auth';

const MessagesNav = () => {
  const { setShowForm, user, userAuth, windowWidth, notiRed, messagesRed, appRef, cookies } = useContext(appContext)
  const [showMoreDiv, setShowMoreDiv] = useState(false)
  const [messagesActive, setMessagesActive] = useState(false)
  const [searchActive, setSearchActive] = useState(false)
  const [notificationsActive, setNotificationsActive] = useState(false)
  const navigate = useNavigate()

  const logOut = async () => {
    signOut(auth).then(() => {
      navigate('/login')
      window.location.reload(true)
    }).then(() => {
      cookies.set('wowi-auth-token', '')
      localStorage.setItem('wowi-auth-token', '')
      cookies.remove('wowi-auth-token')
      localStorage.removeItem('wowi-auth-token')

      console.log(cookies.get('wowi-auth-token'))
      console.log(JSON.parse(localStorage.getItem('wowi-auth-token')))
    })
  }

  
  return (
    <nav className='messages-nav' role={'button'} onClick={() => setShowForm(false)}>
      <div className="messages-nav nav">
        <NavLink to='/'
        className={({isActive}) => isActive ? 'active-link' : ''}>
          <FontAwesomeIcon icon={faHome} />
        </NavLink>

        <NavLink to='/messages'
          className={({ isActive }) => isActive ? 'active-link messages-link' : 'messages-link'} 
          style={({ isActive }) => {
            if (isActive) {
              setMessagesActive(true)
            } else {
              setMessagesActive(false)
            }
          }} 
        >
          {appRef.current?.classList.contains('dark-mode') ?
            <>
              {messagesActive ?
                <img src={dmMessagesActiveIcon} alt="" className='icon-img' />
                :
                <img src={dmMessagesInactiveIcon} alt="" className='icon-img'/>
              }
            </>
            :
            <>
              {messagesActive ?
                <img src={messagesActiveIcon} alt="" className='icon-img' />
                :
                <img src={messagesInactiveIcon} alt="" className='icon-img'/>
              }
            </>
          }
          <span className={messagesRed ? 'noti-span show' : 'noti-span'}></span>
        </NavLink>

        <NavLink to='/search'
          className={({ isActive }) => isActive ? 'active-link' : ''}
          style={({ isActive }) => {
            if (isActive) {
              setSearchActive(true)
            } else {
              setSearchActive(false)
            }
          }}
        >
          {appRef.current?.classList.contains('dark-mode') ?
            <>
              {searchActive ?
                <img src={dmSearchActiveIcon} alt="" className='icon-img' />
                :
                <img src={dmSearchInactiveIcon} alt="" className='icon-img'/>
              }
            </>
            :
            <>
              {searchActive ?
                <img src={searchActiveIcon} alt="" className='icon-img' />
                :
                <img src={searchInactiveIcon} alt="" className='icon-img'/>
              }
            </>
          }
        </NavLink>

        <NavLink to='/notifications'
          className={({ isActive }) => isActive ? 'active-link notifications-link' : 'notifications-link'}
          style={({ isActive }) => {
            if (isActive) {
              setNotificationsActive(true)
            } else {
              setNotificationsActive(false)
            }
          }} 
        >
          <div className="notifications-icon-div">
            {appRef.current?.classList.contains('dark-mode') ?
            <>
              {notificationsActive ?
                <img src={dmNotificationsActiveIcon} alt="" className='icon-img' />
                :
                <img src={dmNotificationsInactiveIcon} alt="" className='icon-img'/>
              }
            </>
            :
            <>
              {notificationsActive ?
                <img src={notificationsActiveIcon} alt="" className='icon-img' />
                :
                <img src={notificationsInactiveIcon} alt="" className='icon-img'/>
              }
            </>
            }
            <span className={notiRed ? 'noti-span show' : 'noti-span'}></span>
          </div>
        </NavLink>

        <NavLink to={!auth.currentUser?.uid && !userAuth ? '/login' : '/profile'} 
        className={({isActive}) => isActive ? 'active-link' : ''}>
          {!auth.currentUser?.uid && !userAuth &&
            <>
              <FontAwesomeIcon icon={faUser} />
            </>
          }

          {userAuth &&
            <>
              <img src={user?.avatarUrl} alt="" className='footer-profile-img'/>
            </>
          }
        </NavLink>

        <div role={'button'} onClick={() => setShowMoreDiv(!showMoreDiv)}>
          <FontAwesomeIcon icon={faBars} />

          <div style={showMoreDiv ? {display: 'block'} : {display: 'none'}} className="more-div">
            <Link to='/profile/settings'>
              <FontAwesomeIcon icon={faCog} />
              Settings
            </Link>

            <Link to='/profile/settings/bookmarked-posts'>
              <FontAwesomeIcon icon={faBookmark} />
              Bookmarks
            </Link>

            <button id='log-out-btn' onClick={logOut}>
              Log out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default MessagesNav