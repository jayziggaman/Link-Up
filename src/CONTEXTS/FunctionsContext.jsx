import React, { useContext, useEffect } from 'react'
import {v4 as uuidv4} from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db, messageRoomsRef, postsRef, storage } from '../firebase/config'
import { appContext } from '../App';
import { useLocation, useNavigate } from 'react-router-dom';


export const functionsContext = React.createContext()

const FunctionsContext = ({ children }) => {
  const { user, allPosts, users, setError, setShowError, userAuth, userPosts } = useContext(appContext)

  const location = useLocation()
  const navigate = useNavigate()
  const time = new Date()
  

  function routeToLogin() {
    const userAuth = JSON.parse(localStorage.getItem('wowi-auth-token'))

    if (!userAuth) {
      return true

    } 
    return false
  }



  const updateUserLikes = (id, type, postId = "", commentId = "", replyId = "") => {  
    const docRef = doc(db, 'users', user.id)
    updateDoc(docRef, {
      posts: {
        value: [...userPosts]
      }
    })

    const condition = user.likes.value.find(like => like.id === id)

    if (condition) { 
      updateDoc(docRef, {
        likes: {
          value: [...user.likes.value.filter(like => like.id !== id)]
        }

      }).catch(() => {
        updateUserLikes(id, type, postId, commentId, replyId)
      })
    }
    else {
      updateDoc(docRef, {
        likes: {
          value: [...user.likes.value, { id, type, postId, commentId, replyId }]
        }
      }).catch(() => {
        updateUserLikes(id, type, postId, commentId, replyId)
      })
    }
  }

  
  const sendLikeNotification = (type, postId = "", commentId = "", replyId = "", creator) => {
    const notiId = uuidv4()
    const userRef = doc(db, 'users', creator)
    const postCreator = users.find(user => user.id === creator)

    if (postCreator) {
      const postCreatorNotifications = postCreator.notifications.value

      updateDoc(userRef, {
        notifications: {
          value: [...postCreatorNotifications, {
            id: notiId,
            type, 
            replyId,
            commentId,
            postId,
            likedBy: user.id,
            sentAt: time.getTime()
          }]
        }
      })
    }
  }


  const likePost = (post) => {
    const { id } = post
    
    const docRef = doc(postsRef, id)
    
    finishLike(docRef, post, 'post', 'post-like')
  }


  const likeComment = (postId, comment) => {
    const { id } = comment
    
    const docRef = doc(postsRef, postId, 'comments', id)

    finishLike(docRef, comment, 'comment', 'comment-like', postId, id)
  }


  const likeCommentReply = (postId, commentId, reply) => {
    const { id } = reply
    
    const docRef = doc(postsRef, postId, 'comments', commentId, 'replies', id)

    finishLike(docRef, reply, 'reply', 'reply-like', postId, commentId, id)
  }


  const finishLike = (ref, post, likeType, notificationType, postId, commentId="", replyId="") => {
    let tryCount = 0

    const { id, creator, likes } = post
  
    const postLikes = likes.value

    const condition = postLikes.find(like => like === user.id)
  
    if (condition) {
      updateDoc(ref, {
        likes: {
          value: postLikes.filter(like => like !== user.id)
        }
      }).then(() => {
        updateUserLikes(id, likeType, postId, commentId, replyId)

      }).catch(() => {
        if (tryCount === 10) {
          callError("Couldn't complete request. Check your connection and try again.")
          
        } else {
          tryCount++
          finishLike(ref, post, likeType, notificationType)
        }
      })

    } else {
      updateDoc(ref, {
        likes: {
          value: [...postLikes, user.id]
        }

      }).then(() => {
        updateUserLikes(id, likeType, postId, commentId, replyId)
        const condition = creator !== user.id
        
        if (condition) {
          sendLikeNotification(notificationType, postId, commentId, replyId, creator)
        }
        
      }).catch((err) => {
        if (tryCount === 10) {
          callError("Couldn't complete request. Check your connection and try again.")
          
        } else {
          tryCount++
          finishLike(ref, post, likeType, notificationType)
        }
      })
    }
  }



  const bookmarkPost = (id, postId, commentId, replyId) => {
    const docRef = doc(db, 'users', user.id)
    const userBookmarks = user.postSaves.value
  
    updateDoc(docRef, {
      postSaves: {
        value: [...userBookmarks, {
          id, 
          postId: postId ? postId : '',
          commentId: commentId ? commentId : '',
          replyId: replyId ? replyId : '',
        }]
      }

    }).then(() => {
      callError(`Post successfully added to your bookmarks`)

    }).catch(() => {
      callError(`Couldn't add post to your bookmarks. Please try again`)
    })
  }
  
  
  const removeBookmarkedPost = (postId) => {
    const docRef = doc(db, 'users', user.id)
    const userBookmarks = user.postSaves.value
    
    updateDoc(docRef, {
      postSaves: {
        value: userBookmarks.filter(bookmark => bookmark.id !== postId)
      }

    }).then(() => {
      callError(`Post successfully removed from your bookmarks`)

    }).catch(() => {
      callError(`Couldn't remove post from your bookmarks. Please try again`)
    })
  }


  const deletePost = async (postId, commentId, replyId) => {
    const isInPostView = location.pathname.includes('posts')

    let docRef;
    let post;
    if (commentId && replyId) {
      docRef = doc(db, 'posts', postId, 'comments', commentId, 'replies', replyId);
      post = document.getElementById(replyId);

    } else if (commentId) {
      docRef = doc(db, 'posts', postId, 'comments', commentId);
      post = document.getElementById(commentId);

    } else {
      docRef = doc(db, 'posts', postId);
      post = document.getElementById(postId);
    }
  
    try {
      if (post) {
        post.style.opacity = 0.5;
      }

      if (isInPostView) {
        navigate(-1)
      }

      await deleteDoc(docRef);

      callError(`Post deleted successfully`)
  
      if (post) {
        post.remove();
      }
  
    } catch (error) {
      callError(`Couldn't delete post, please try again`);
  
      if (post) {
        post.style.opacity = 1;
      }
    }
  };
  

  const checkIfDMExists = (ref) => {
    return new Promise((resolve, reject) => {
      onSnapshot(ref, (docSnapshot) => {
        if (docSnapshot.exists()) {
          resolve(docSnapshot.data());
        } else {
          resolve(null);
        }
      }, (error) => {
        reject(error);
      });
    });
  };
  


  function createDM(user, otherUser, dmUrl) {
    setDoc(doc(messageRoomsRef, dmUrl), {
      id: dmUrl,
      users: {
        [user.firstUsername]: { lastActive:  serverTimestamp(), isActive: true },
        [otherUser.firstUsername]: { lastActive: 0, isActive: false }
      }
    });
  }

  

  function isLinkElement(textContent) {
    const text = textContent;
    
    const linkLikeRegexB = /^(https?|www\.|ftp)/gi;
    const linkLikeRegexE = /(\.com|\.de|\.org|\.net|\.us|\.co|\.edu|\.gov|\.biz|\.za|\.info|\.cc|\.ca|\.cn|\.fr|\.ch|\.au|\.in|\.jp|\.be|\.it|\.nl|\.uk|\.mx|\.no|\.ru|\.br|\.se|\.es|\.at|\.dk|\.eu|\.il)$/gi;

    if (linkLikeRegexB.test(text) || linkLikeRegexE.test(text)) {
      return true

    } else {
      return false 
    }
  }


  const hrefChecker = (el) => {
    if (el.includes('http://') || el.includes('https://')) {
      return `${el}` 
    }

    return `http://${el}`
  }


  function timeSincePosted(postedTime) {
    const diff = time.getTime() - postedTime
  
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) {
      return `${seconds} s`;
    }
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} m`;
    }
    
    const hours = Math.floor(minutes / 60);
    return `${hours} h`;
  }


  function callError(message) {
    setShowError(true)
    setError(message)
  }



  const loadMedia = (files, setMediaState) => {
    const media = []
    let fileTooLarge = false
    

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileURL = URL.createObjectURL(file);

      if (file.size <= 50000000) {
        if (file.type.startsWith('image/')) {
          media.push({
            type: 'img',
            url: fileURL
          })
            
        } else if (file.type.startsWith('video/')) {
          media.push({
            type: 'video',
            url: fileURL
          })
        }

      } else {
        fileTooLarge = true
      }
    }
    setMediaState([...media])
    
    if (fileTooLarge) {
      callError("File to be uploaded is too large. It has to be 50MB or lower")
    }
  }


  const loadSingleMedia = ( file, setMediaState ) => {
    const fileURL = URL.createObjectURL(file);

    if (file.size <= 50000000) {
      if (file.type.startsWith('image/')) {
        setMediaState({
          type: 'img',
          url: fileURL
        })
          
      } else if (file.type.startsWith('video/')) {
        setMediaState({
          type: 'video',
          url: fileURL
        })
      }

    } else {
      callError("File to be uploaded is too large. It has to be 50MB or lower")
    }
  }


  async function generateLink(files) {
    // Convert files to an array, whether it's a FileList or a single File object
    const isFileList = files instanceof FileList;
    const fileArray = isFileList ? Array.from(files) : [files]; 
  
    // Filter out files that are too large
    const sizeLimit = 50000000; // 50MB
    const sizeFilteredFiles = fileArray.filter(file => file.size <= sizeLimit);
  
    if (sizeFilteredFiles.length !== fileArray.length) {
      callError("Some files were too large and have been excluded.");
    }
  
    // Filter out files that are not images
    const validFiles = sizeFilteredFiles.filter(file => 
      file.type.startsWith('image/')
    );
  
    if (validFiles.length === 0) {
      callError("No valid image files found.");
      return null;
    }
  
    // Function to convert image to WebP format
    const convertToWebP = async (file) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
  
      return new Promise((resolve) => {
        img.onload = async () => {
          // Create a canvas to draw the image
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
  
          // Convert to WebP
          const webpBlob = await new Promise((res) => {
            canvas.toBlob((blob) => {
              res(blob);
            }, 'image/webp');
          });
  
          resolve(webpBlob);
        };
      });
    };
  
    // Upload valid files and generate download URLs
    const uploadedFiles = await Promise.all(
      validFiles.map(async (file) => {
        const webpBlob = await convertToWebP(file);
        const id = uuidv4();
        const linkRef = ref(storage, `media-updates/${user.id}/${id}.webp`); // Ensure the correct extension
  
        await uploadBytes(linkRef, webpBlob);
        const url = await getDownloadURL(linkRef);
  
        return {
          type: 'img', // All files are now in WebP format
          url
        };
      })
    );
  
    // If a single file was uploaded, return the URL directly.
    if (uploadedFiles.length === 1) {
      return uploadedFiles[0].url;
    }
  
    // Otherwise, return the array of uploaded file details.
    return uploadedFiles;
  }
  


  const bookmarkPage = (userId) => {
    const pageSaves = user.pageSaves.value

    const condition = pageSaves.find(save => save === userId)

    if (!condition) {
      const userRef = doc(db, 'users', user.id)
      updateDoc(userRef, {
        pageSaves: {
          value: [...pageSaves, userId]
        }
      }).then(() => {
        callError(`This page has been added to your bookmarks`)
        
      }).catch(() => {
        callError(`Couldn't add to your bookmarks, please try again`)
      })
    }
  }


  const removeBookmarkPage = (userId) => {
    const pageSaves = user.pageSaves.value

    const userRef = doc(db, 'users', user.id)
      updateDoc(userRef, {
        pageSaves: {
          value: pageSaves.filter(save => save !== userId)
        }
      }).then(() => {
        callError(`This page has been removed to your bookmarks`)

      }).catch(() => {
        callError(`Couldn't remove from your bookmarks, please try again`)
      })
  }


  const blockUser = async (userId) => {
    const otherUser = users.find(user => user.id === userId)
    const { username } = otherUser

    const { id, blocked, followers, following, friends } = user
    const docRef = doc(db, 'users', id)

    const { id: otherId, followers: otherFollowers, following: otherFollowing, friends: otherFriends } = otherUser
    const userRef = doc(db, 'users', otherId)
    
    const userBlocks = blocked.value
    const userFollowers = followers.value
    const userFollowing = following.value
    const userFriends = friends.value

    const otherUserFollowers = otherFollowers.value
    const otherUserFollowing = otherFollowing.value
    const otherUserFriends = otherFriends.value

    const condition = userBlocks.find(person => person === otherId)

    if (!condition) {
      try {
        await updateDoc(docRef, {
          blocked: {
            value: [...userBlocks, otherId]
          },
  
          followers: {
            value: [...userFollowers.filter(follower => follower !== otherId)]
          },
  
          following: {
            value: [...userFollowing.filter(follow => follow !== otherId)]
          },
  
          friends: {
            value: [...userFriends.filter(follow => follow !== otherId)]
          }
        })
          
        
        await updateDoc(userRef, {
          followers: {
            value: [...otherUserFollowers.filter(follower => follower !== id)]
          },
  
          following: {
            value: [...otherUserFollowing.filter(follow => follow !== id)]
          },
  
          friends: {
            value: [...otherUserFriends.filter(follow => follow !== id)]
          }
        })

        callError(`You have blocked ${username}`)

      } catch (err) {
        callError(`Couldn't block ${username}, please try again`)
      }
    }
  }


  const unblockUser = (userId) => {
    const otherUser = users.find(user => user.id === userId)

    const { blocked } = user

    const userBlocks = blocked.value
    
    if (otherUser) {
      const { username } = otherUser

      const docRef = doc(db, 'users', user.id)

      updateDoc(docRef, {
        blocked: {
          value: [...userBlocks.filter(user => user !== userId)]
        }

      }).then(() => {
        callError(`You have unblocked ${username}`)

      }).catch(() => {
        callError(`Couldn't unblock ${username}, please try again`)
      })
    }
  }


  const fetchDM = async (dmUrl, setRoomMessages, otherUser, setThisRoom) => {
    const messageRoomRef = doc(messageRoomsRef, dmUrl);
  
    try {
      const data = await checkIfDMExists(messageRoomRef);
  
      // Check if the DM has been created
      if (data) {
        setThisRoom && setThisRoom(data);
  
        // Load messages in this DM
        const dmRef = collection(messageRoomsRef, dmUrl, "messages");
        const q = query(dmRef, orderBy("createdAt", "asc"));
  
        onSnapshot(q, (snap) => {
          let messages = [];
          snap.docs.forEach(doc => {
            messages.push({ ...doc.data(), id: doc.id });
          });
          setRoomMessages(
            messages.filter(message => message["deletedBy_" + user.username] !== true)
          );
        }, (error) => {
          callError("Couldn't get messages. Please try again");
        });
      } else {
        setRoomMessages([]);
  
        // Create the DM if it doesn't exist
        await createDM(user, otherUser, dmUrl);
      }
    } catch (error) {
      console.error("Error fetching DM: ", error);
      callError("Couldn't get DM. Please try again");
    }
  };


  function isStoryViewed(user, stories) {
    if (user?.id) {
      const visitedRoutes = user.visitedRoutes.value

      visitedRoutes.map(route => {
        const { value } = route

        stories.map(story => {
          const { id } = story

          if (value.includes(id)) {
            //
          } else {
            return false
          }
        })
      })

      return true
    }
  }



  function deleteMessage(dmUrl, messageId, condition, user, otherUser) {
    const messageRef = doc(messageRoomsRef, dmUrl, "messages", messageId)

    if (condition) {
      updateDoc(messageRef, {
        ["deletedBy_" + user.username]: true,
        ["deletedBy_" + otherUser.username]: true,
      });

    } else {
      updateDoc(messageRef, {
        ["deletedBy_" + user.username]: true,
      });
    }
  }
  





  return (
    <functionsContext.Provider
      value={{
        updateUserLikes, likePost, likeComment, bookmarkPost, removeBookmarkedPost, deletePost, checkIfDMExists, createDM, isLinkElement, hrefChecker, timeSincePosted, routeToLogin, callError, loadMedia, loadSingleMedia, generateLink, likeCommentReply, bookmarkPage, removeBookmarkPage, blockUser, unblockUser, fetchDM, isStoryViewed, deleteMessage
      }}
    >
      {children}
    </functionsContext.Provider>
  )
}

export default FunctionsContext