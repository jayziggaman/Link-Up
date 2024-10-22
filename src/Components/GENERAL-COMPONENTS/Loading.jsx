import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const Loading = ({ called }) => {
  
  const [index, setIndex] = useState(0)
  const location = useLocation()
  const spans = document.querySelectorAll('.loading span')


  useEffect(() => {
    const interval = setInterval(() => {
      if (index === 2) {
        setIndex(index => index - index)
      } else {
        setIndex(index => index + 1)
      }
    }, 500);

    return () => {
      clearInterval(interval)
    }
  }, [index])


  useEffect(() => {
    spans.forEach((div, i) => {
      if (i === index) {
        div.classList.add('active')
      } else {
        div.classList.remove('active')
      }
    })
  }, [index])


  const style = {
    height: '12px',
    width: '12px',
    borderRadius: '20px',
    display: 'block',
    margin: '0',
    padding: '0'
  }


  return (
    <section className={`loading ${called ? 'called' : ''}`}
      style={{
        height: !called ? '100vh' : '',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5px',
        opacity: called ? 0.5 : 1
      }}
    >
      <div className="loading-sect-div">
        <span style={style}></span>
        <span style={style}></span>
        <span style={style}></span>
      </div>
    </section>
  )
}

export default Loading