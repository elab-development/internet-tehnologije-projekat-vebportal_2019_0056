import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import axios from 'axios';

import { app } from '../utils/firebase';
import { signInSuccess } from '../redux/user/userSlice';

const OAuth = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const dataForAPI = {
        name: resultsFromGoogle.user.displayName,
        email: resultsFromGoogle.user.email,
        googlePhotoUrl: resultsFromGoogle.user.photoURL,
      };

      const res = await axios.post('/api/auth/google', dataForAPI);

      if (res.status === 200) {
        dispatch(signInSuccess(res.data));
        navigate('/');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      type='button'
      gradientDuoTone='pinkToOrange'
      outline
      onClick={handleGoogleAuth}
    >
      <div className='flex items-center gap-2'>
        <AiFillGoogleCircle className='w-6 h-6' />
        <span>Continue with Google</span>
      </div>
    </Button>
  );
};

export default OAuth;