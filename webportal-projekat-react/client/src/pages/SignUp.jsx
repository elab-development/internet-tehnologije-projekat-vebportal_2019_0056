import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Label, TextInput, Spinner } from 'flowbite-react';
import axios from 'axios';

import OAuth from '../components/OAuth';

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (!formData.username) {
      setErrorMessage('Please provide your username!');
      setLoading(false);
      return;
    }

    if (!formData.email) {
      setErrorMessage('Please provide your email!');
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setErrorMessage('Please provide your password!');
      setLoading(false);
      return;
    }

    try {
      await axios.post('/api/auth/signup', formData);
      navigate('/sign-in');
    } catch (error) {
      console.error(error);
      setErrorMessage(
        'Something went wrong! Username or Email might be taken.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-[80vh] my-20'>
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
              <Label value='Username' />
              <TextInput
                type='text'
                placeholder='Your username'
                id='username'
                onChange={handleChange}
              />
            </div>
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
              {loading ? <Spinner size='sm' /> : 'Sign Up'}
            </Button>

            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Already have an Account?</span>
            <Link to='/sign-in' className='text-blue-500'>
              Sing In
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

export default SignUp;