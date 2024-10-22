import React, { useContext, useEffect, useState } from 'react'
import { appContext } from '../App'

const NavigationIcon = ({ path, emptyIcon, filledIcon }) => {
  const { darkMode, location } = useContext(appContext)
  const [isActive, setIsActive] = useState(false)


  useEffect(() => {
    if (location.pathname.slice(1) === path) {
      setIsActive(true)

    } else {
      setIsActive(false)
    }
  }, [location])
  

  return (
    <>
      {isActive ?
        <>
          {filledIcon}
        </>
        :
        <>
          {emptyIcon}
        </>
      }
    </>
  )
}

export default NavigationIcon