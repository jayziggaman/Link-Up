import React, { useContext, useEffect, useState } from 'react'
import { appContext } from '../App'
import BookmarkPage from '../COMPONENTS/BookmarkPage'
import Header from '../COMPONENTS/Header'
import Nav from '../COMPONENTS/Nav'
import LoadBookmarkPage from '../COMPONENTS/LoadBookmarkPage'
import noMedia from '../Images/no-media-found.jpg'
import { functionsContext } from '../CONTEXTS/FunctionsContext'
import BackButton from '../COMPONENTS/GENERAL-COMPONENTS/BackButton'
import { useNavigate } from 'react-router-dom'
import { ThisHeader } from './BookmarkedPosts'

const BookmarkedPages = () => {
  const { users, user, windowWidth } = useContext(appContext)
  const { routeToLogin } = useContext(functionsContext)

  const [bookmarks, setBookmarks] = useState(null)
  const loadArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()


  useEffect(() => {
    if (routeToLogin()) {
      navigate('/auth?type=login');
    }
  }, [])



  useEffect(() => {
    if (user?.id && users) {
      const arr = []
      const pageSaves = user.pageSaves.value
      pageSaves.map(save => {
        const user = users.find(user => user.id === save)

        if (user) arr.push(user)
      })

      setBookmarks([...arr])
    }
  }, [user, users])




  useEffect(() => {
    if (bookmarks) {
      setLoading(false)
    }
  }, [bookmarks])




  if (loading) {
    return (
      <main className='bookmark-main'>
        { windowWidth >= 700 && <Header />}
        {windowWidth >= 700 && <Nav />}

        <ThisHeader headerText="Bookmarked pages" />
        
        {loadArr.map((_, i) => {
          return (
            <div key={i}
              style={{
                padding: '0 1rem'
              }}
            >
              {i !== 0 && <hr />}
              <LoadBookmarkPage key={i}/>
            </div>
          )
        })}
      </main>
    )
  } else {

    return (
      <main className='bookmark-main'>
        { windowWidth >= 700 && <Header />}
        {windowWidth >= 700 && <Nav />}

        <ThisHeader headerText="Bookmarked pages" />

        <div className="page-bookmarks">
          {bookmarks.length > 0 ?
            <>
              {bookmarks.reverse().map(bookmark => {
                const { id } = bookmark

                return (
                  <BookmarkPage key={id} bookmark={bookmark} />
                )
              })}
            </>
            :
            <div className='no-media-div'>
              <img className='no-media' src={noMedia} alt="" />
              <p>Nothing to show here.</p>
            </div>
          }
        </div>
      </main>
    )
  }
}

export default BookmarkedPages