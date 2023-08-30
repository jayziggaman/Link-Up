import React, { useContext, useEffect } from 'react'
import { appContext } from '../App'
import loadVideoLight from '../Images/load-video-light.mp4'
import loadVideoDark from '../Images/load-video-dark.mp4'

const Processing = () => {
  const { processing, processingType, setProcessing } = useContext(appContext)
  const darkMode = document.querySelector('.dark-mode')

  useEffect(() => {
    const processingDiv = document.querySelector('.processing-div')
    if(processing) {
      processingDiv.classList.add('processing')
      // setTimeout(() => {
      //   setProcessing(false)
      // }, 1000);
    } else {
      processingDiv.classList.remove('processing')
    }
  }, [processing])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setProcessing(false)
    }, 1000);

    // clearTimeout(timeout)
  })

  return (
    <div className={processing ? 'processing processing-div' : 'processing-div'}>
      <p>{processingType.current}</p>
    </div>
  )

  // return (
  //   <div className={processing ? 'processing processing-div' : 'processing-div processing'}>
  //     {!darkMode &&
  //       <>
  //         {!processing ?
  //           <video autoPlay muted loop src={loadVideoLight}></video>
  //          : <p>{processingType}</p>
  //         }
  //       </>
  //     }

  //     {darkMode &&
  //       <>
  //         {processing ?
  //           <video autoPlay muted loop src={loadVideoDark}></video>
  //          : <p>{processingType}</p>
  //         }
  //       </>
  //     }
  //   </div>
  // )
}

export default Processing