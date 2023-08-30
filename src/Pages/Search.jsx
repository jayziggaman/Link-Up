import React, { useContext, useRef, useState } from 'react'
import { FaSearch, FaPlus } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import Footer from '../Components/Footer'
import Form from '../Components/Form'
import Header from '../Components/Header'
import Nav from '../Components/Nav'
import SearchResult from '../Components/SearchResult'

const Search = () => {
  const {setShowForm, user, users, windowWidth} = useContext(appContext)
  const [searchResult, setSearchResult] = useState([])
  const search = useRef()
  const navigate = useNavigate()

  const handleSearch = () => {
    setSearchResult(users.filter(user => user.username.includes(search.current.value)))
  }

  return (
    <main className="search-main" role={'button'} onClick={() => setShowForm(false)}>
      {windowWidth > 799 && <Header />}
      {windowWidth > 799 && <Nav />}
      <header className="search-header">
        <div className="search-bar-div">
          <FaSearch />
          <input autoComplete='off' className='search-input' type="text" placeholder='Search users' ref={search} onChange={e => {
            handleSearch()
          } } />
        </div>

        <div className="search-header-pfp-div">
          <img src={user?.avatarUrl} alt="" />
        </div>
      </header>

      <section className="search-results">
        {searchResult.map(result => <SearchResult key={result.id} result={result} /> )}
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

export default Search