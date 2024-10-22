import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { appContext } from '../../App'
import { functionsContext } from '../../CONTEXTS/FunctionsContext'
import ChopText from './ChopText'

const PostCaption = ({ caption, postLink }) => {
  const { isLinkElement, hrefChecker } = useContext(functionsContext)

  return (
    <>
      {isLinkElement(caption) ?
        <a className='out-link' target='_blank' href={hrefChecker(caption)}>
          <LinkText caption={caption} />
        </a>
        :
        <Link className='in-link' to={postLink}>
          <LinkText caption={caption} />
        </Link>
      }
    </>
  )
}

export default PostCaption






const LinkText = ({ caption }) => {
  const { location } = useContext(appContext)

  const [inPostView, setInPostView] = useState(location.pathname.includes("posts"))


  useEffect(() => {
    setInPostView(location.pathname.includes("posts"))
  }, [location])

  return (
    <pre className='preRef'>
      {inPostView ?
        <>
          {caption}
        </>
        :
        <>
          <ChopText text={caption} num={300} /> {caption.length > 300 && <b> more </b>}
        </>
      }
    </pre>
  )
}