import React, { useContext, useEffect, useState } from 'react'
import { appContext } from '../App'
import BookmarkPage from '../Components/BookmarkPage'
import Header from '../Components/Header'
import Nav from '../Components/Nav'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import LoadBookmarkPage from '../Components/LoadBookmarkPage'

const BookmarkedPages = () => {
  const { users, user, windowWidth } = useContext(appContext)
  const [bookmarks, setBookmarks] = useState()
  const loadArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const arr = []
    for (let i = 0; i < user?.pageSaves.value.length; i++) {
      const person = users.find(person => person.id === user?.pageSaves.value[i])
      if (person) {
        arr.push(person)
      }
    }
    setBookmarks(arr)
  }, [user])

  useEffect(() => {
    if (bookmarks) {
      setLoading(false)
    }
  }, [bookmarks])

  if (loading) {
    return (
      <main className='bookmark-main'>
        { windowWidth > 850 && <Header />}
        {windowWidth > 850 && <Nav />}
        <header className='bookmark-header'>
          <button onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
  
          <h1>
            Bookmarks
          </h1>
        </header>
        {loadArr.map((item, i) => {
          return (
            <>
              {i !== 0 && <hr />}
              <LoadBookmarkPage key={i}/>
            </>
          )
        })}
      </main>
    )
  } else {
    return (
      <main className='bookmark-main'>
        { windowWidth > 850 && <Header />}
        {windowWidth > 850 && <Nav />}
        <header className='bookmark-header'>
          <button onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
  
          <h1>
            Bookmarks
          </h1>
        </header>
        <div className="page-bookmarks">
          {bookmarks.map(bookmark => <BookmarkPage key={bookmark.id} bookmark={bookmark} />)}
        </div>
      </main>
    )
  }
}

export default BookmarkedPages