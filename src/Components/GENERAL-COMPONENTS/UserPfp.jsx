import React, { useContext, useEffect, useRef, useState } from 'react'
import PersonIcon from '@mui/icons-material/Person';
import { functionsContext } from '../../CONTEXTS/FunctionsContext';
import { db } from '../../firebase/config';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const UserPfp = ({ user }) => {
  const { isStoryViewed } = useContext(functionsContext)

  const [stories, setStories] = useState([])
  const [divHeight, setDivHeight] = useState(0);
  const divRef = useRef(null);


  useEffect(() => {
    if (divRef.current) {
      const height = divRef.current.getBoundingClientRect().height 
      setDivHeight(height);
    }
  }, [user]); 


  useEffect(() => {
    if (user?.id) {
      const userRef = collection(db, 'users', user.id, 'stories')
      const q = query(userRef, orderBy("createdAt", "asc"));
      
      onSnapshot(q, snap => {
        const userArr = []
        snap.docs.forEach(doc => {
          userArr.push({ ...doc.data(), id: doc.id })
        })
  
        setStories([...userArr])
      })
    }
  }, [user])



  
  return (
    <>
      {user?.avatarUrl === '' || !user?.avatarUrl ? 
      <div
        className='empty-story-pfp'
        ref={divRef} 
        style={{
          maxHeight: divHeight > 0 ?  `${divHeight}px` : 'unset',
          maxWidth: divHeight > 0 ?  `${divHeight}px` : 'unset'
        }}
      >
        <PersonIcon
          style={{
            height: divHeight > 0 ?  `${divHeight * 0.65}px` : 'unset',
            width: divHeight > 0 ?  `${divHeight * 0.65}px` : 'unset',
          }}
        />
      </div>
       : 
        <img className='pfp' src={user?.avatarUrl}
          alt={`${user?.username}'s profile picture`}
          style={{
            maxHeight: divHeight > 0 ?  `${divHeight}px` : 'unset',
            maxWidth: divHeight > 0 ? `${divHeight}px` : 'unset',
            fontSize: 0,
          }}
        />
      }
    </>
  );
};

export default UserPfp;