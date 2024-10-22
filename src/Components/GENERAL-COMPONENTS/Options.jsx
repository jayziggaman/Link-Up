import { collection, getDocs, writeBatch } from 'firebase/firestore'
import React, { useContext, useEffect } from 'react'
import { appContext } from '../../App';
import { db } from '../../firebase/config'

const Options = ({ showOptionsDiv, setShowOptionsDiv, optionId, functions }) => {
  const { user } = useContext(appContext)
  

  useEffect(() => {
    const optionDivs = document.querySelectorAll('.options-div')
    optionDivs.forEach(option => {
      if (!option.id) {
        option.classList.remove('active')
      }
    })

    const scroll = e => {
      if (showOptionsDiv) {
        setShowOptionsDiv(false)
      }
    }

    window.addEventListener('scroll', scroll)





    if (!showOptionsDiv) {
      optionId.current = null
    }

    return () => {
      window.removeEventListener('scroll', scroll)
    }
  }, [showOptionsDiv]);
  


  const handleFunc = (e, id) => {

    const clearChat = async (chatId) => {
      const dmRef = collection(db, 'directMessages', chatId, 'messages')
        
      try {
        const querySnapshot = await getDocs(dmRef);
        
        if (querySnapshot.empty) {
          return;
        }

        // Create a batch
        const batch = writeBatch(db);

        // Add delete operations to the batch
        querySnapshot.forEach((doc) => {
          const docRef = doc.ref;
          batch.delete(docRef);
        });

        // Commit the batch (execute all the delete operations)
        await batch.commit();

      } catch (error) {
        console.error("Error deleting documents:", error);

      } finally {
      }
    }
  }


  return (
    <div id={optionId.current} role={'button'}
      onClick={() => setShowOptionsDiv(false)}
      className={showOptionsDiv ? 'active options-div' : 'options-div'}>
      {functions.map(item => {
        const { text, func, color } = item

        return (
          <button key={text} style={{ color: color }}
            onClick={() => {
              if (user?.id) {
                func()
                setShowOptionsDiv(false)
              }
            }}
          >
            {text}
          </button>
        )
      })}
      
      <button
        onClick={() => setShowOptionsDiv(false)}
      >
        cancel
      </button>
    </div>
  )
}

export default Options
