import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { appContext } from '../App'
import Footer from '../COMPONENTS/Footer'
import LoginMessage from '../COMPONENTS/GENERAL-COMPONENTS/LoginMessage'
import UserPfp from '../COMPONENTS/GENERAL-COMPONENTS/UserPfp'
import Header from '../COMPONENTS/Header'
import Nav from '../COMPONENTS/Nav'
import SearchResult from '../COMPONENTS/SearchResult'
import NewPostIcon from '../ICONS/NewPostIcon'

const Search = () => {
  const { setShowPostForm, user, users, windowWidth, suggestedAccounts } = useContext(appContext)
  const [searchResult, setSearchResult] = useState([])
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  
  useEffect(() => {
    if (search === '') {
      setSearchResult([])

    } else {
      setSearchResult(users.filter(user =>
        user.username.toLowerCase().trim().includes(search.toLowerCase().trim()) ||
        user.displayName.toLowerCase().trim().includes(search.toLowerCase().trim())
      ))
    }
  }, [search])




  return (
    <main className="search-main" role={'button'} onClick={() => setShowPostForm(false)}>
      {windowWidth > 699 && <Header />}
      {windowWidth > 699 && <Nav />}

      <LoginMessage />
      
      <header className="search-header">
        <div className="search-header-pfp-div">
          <UserPfp user={user} />
        </div>
        
        <div className="search-bar-div">
          <FaSearch />
          <input autoComplete='off' className='search-input'
            type="text" placeholder='Search users' value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
      </header>

      <section className="search-results">

        {searchResult.length === 0 ?
          <section className='suggested-accounts'>
            <h2>
              Suggested accounts
            </h2>

            {suggestedAccounts.map(result => {
              return (
                <SearchResult key={result.id} result={result} suggested={true} />
              )
            } )}
          </section>
          :
          <>
            {searchResult.map(result => <SearchResult key={result.id} result={result} /> )}
          </>
        }
      </section>
      
      <NewPostIcon />

      <Footer />
    </main>
  )
}

export default Search