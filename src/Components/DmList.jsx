import React, { useContext, useEffect, useRef, useState } from 'react'
import { appContext } from '../App'
import verifiedBadge from '../Images/verified-badge.jpg'

const DmList = ({ selected, setSelected, showUserList, setShowUserList }) => {
  const { users,  showNewMessageForm, setShowNewMessageForm, userAuth } = useContext(appContext)
  const [search, setSearch] = useState('')
  const [searchedUsers, setSearchedUsers] = useState([])
  const userList = useRef()

  useEffect(() => {
    if (showUserList) {
      userList.current.classList.add('show')
    } else {
      userList.current.classList.remove('show')
    }
  }, [showUserList])

  useEffect(() => {
    const mainUsers = users.filter(user => user.id !== userAuth)
    setSearchedUsers(mainUsers.filter(user => user.username.includes(search)))
  }, [search, users])

  const handleSelected = (user) => {
    const condition = selected.find(select => select.id === user.id)
    if (condition) {
      return
    } else {
      setSelected([...selected, user])
    }
  }
  
  const removeSelected = (id) => {
    setSelected(selected.filter(item => item.id !== id))
  }

  const showMessageForm = () => {
    setShowUserList(false)
    setShowNewMessageForm(true)
  }


  return (
    <article ref={userList} className="new-dm-users-list">
      <div className="new-dm-users-list-container">
        <section className="input-cancel-btn">
          <button className='red' onClick={() => setShowUserList(false)}> cancel </button>
          <input type="text" placeholder='Search users' value={search} onChange={e => setSearch(e.target.value)}/>
          <button onClick={showMessageForm} disabled={selected.length < 1 && true} style={{ opacity: selected.length < 1 && '0.4' }}>
            continue
          </button>
        </section>

        {selected.length > 0 &&
          <section className="new-dm-selected-users">
            {selected.map(select => {
              return (
                <div key={select.id} className='new-dm-selected-users-div'>
                  <img src={select.avatarUrl} alt="" />

                  <div onClick={() => removeSelected(select.id) }>
                    <div className="remove-select"></div>
                    <div className="remove-select"></div>
                  </div>
                </div>
              )
            })}
          </section>
        }

        <section className="users-list">
          {search !== '' ?
            searchedUsers.map(user => {
              return (
                <div key={user.id} onClick={() => handleSelected(user)} className="search-result">
                  <div className="search-result-img-div">
                    <img src={user?.avatarUrl} alt="" />
                  </div>
                  <div className="search-result-username">
                    <p>{user?.username} {user.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} />} . {user?.followers.value?.length} {user?.followers.value?.length === 1 ? 'Follower' : 'Followers' }</p>
                    <p> {user?.displayName} </p>
                  </div>
                </div>
              )
            }) 
            :
            users.filter(user => user.id !== userAuth).map(user => {
              return (
                <div key={user.id} onClick={() => handleSelected(user)} className="search-result">
                  <div className="search-result-img-div">
                    <img src={user?.avatarUrl} alt="" />
                  </div>
                  <div className="search-result-username">
                    <p>{user?.username} {user.userType === 'creator' && <img className='verified-badge' src={verifiedBadge} />} . {user?.followers.value?.length} {user?.followers.value?.length === 1 ? 'Follower' : 'Followers' }</p>
                    <p> {user?.displayName} </p>
                  </div>
                </div>
              )
            })
          }
        </section>
      </div>
    </article>
  )
}

export default DmList