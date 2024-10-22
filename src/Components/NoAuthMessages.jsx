import React, { useContext } from 'react'
import Footer from './Footer'
import Header from './Header'
import Nav from './Nav'
import noMedia from '../Images/no-media-found.jpg'
import { appContext } from '../App'

const NoAuthMessages = () => {
  const {windowWidth} = useContext(appContext)


  return (
    <main className="home-main no-auth"> 
      <Header />
      <Nav />

      { windowWidth > 699 &&
          <h1 className='no-userauth-messages-h1'>
            Messages
          </h1>
        }
      
      <div className='no-media-div' style={{ marginTop: '100px' }}>
        <img className='no-media' src={noMedia} alt="" />
        <p>Nothing to show here.</p>
      </div>
      
      <Footer />
    </main>
  )
}

export default NoAuthMessages