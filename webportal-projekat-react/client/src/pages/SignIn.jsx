import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Label, TextInput, Spinner } from 'flowbite-react';
import axios from 'axios';

import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';


const SignIn = () => {
  const [formData, setFormData] = useState({});
  

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());

    if (!formData.email) {
      dispatch(signInFailure('Please provide your email!'));
      return;
    }

    if (!formData.password) {
      dispatch(signInFailure('Please provide your password!'));
      return;
    }

    try {
      const res = await axios.post('/api/auth/signin', formData);
      if (res.status === 200) {
        dispatch(signInSuccess(res.data));
        navigate('/');
      }
    } catch (error) {
      dispatch(
        signInFailure(
          error?.response?.data?.message ||
            error?.message ||
            'Something went wrong!'
        )
      );
    
    }
  };

  return (
    <div className='min-h-[80vh] my-40'>
      <div className='flex p-3 gap-5 max-w-3xl mx-auto flex-col md:flex-row md:items-center'>
        <div className='flex-1'>
          <Link to='/' className='text-4xl font-bold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
              Wired
            </span>
            Blog
          </Link>
          <p className='text-sm mt-5'>
            The Latest in Technology, Computer Science and Design. Sign up to
            explore more of it!
          </p>
        </div>
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className=''>
              <Label value='Email' />
              <TextInput
                type='email'
                placeholder='Your email'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div className=''>
              <Label value='Password' />
              <TextInput
                type='password'
                placeholder='Your password'
                id='password'
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone='purpleToPink'
              type='submit'
              disabled={loading}
            >
              {loading ? <Spinner size='sm' /> : 'Sign In'}
            </Button>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Don't have an Account?</span>
            <Link to='/sign-up' className='text-blue-500'>
              Sing Up
            </Link>
          </div>

          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;