import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import HomeImg from '../assets/hero-bg.png';
import PostCard from '../components/posts/PostCard';
import { Spinner } from 'flowbite-react';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get('/api/posts');

        if (res.status === 200) {
          setPosts(res.data.posts);
          setLoading(false);
        }
      } catch (error) {
        setError(
          error?.response?.data?.message ||
            error?.message ||
            'Something went wrong!'
        );
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className='min-h-screen'>
      <section className='relative'>
        <div className='container flex flex-col-reverse lg:flex-row items-center gap-12 mt-14 lg:mt-28'>
          <div className='flex flex-1 flex-col items-center lg:items-start'>
            <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to Wired</h1>
            <p className='text-gray-500 text-xs sm:text-sm mt-5'>
              Here you'll find a variety of articles and tutorials on topics
              such as web development, software engineering, and programming
              languages.
            </p>
          </div>

          <div className='flex justify-center flex-1 mb-10 md:mb-16 lg:mb-0 z-10'>
            <img
              className='w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full'
              src={HomeImg}
              alt='banner'
            />
          </div>
        </div>

        <div className='hidden md:block overflow-hidden bg-purple-500 rounded-l-full absolute h-80 w-2/4 top-32 right-0 lg:-bottom-28'></div>
      </section>

      {loading ? (
        <div className='min-h-[30vh] flex justify-center items-center'>
          <Spinner size='lg' />
        </div>
      ) : error ? (
        <div className='min-h-[30vh] flex justify-center items-center'>
          <h1 className='text-3xl text-red-500 font-bold'>{error}</h1>
        </div>
      ) : (
        <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7 mt-52'>
          {posts && posts.length > 0 && (
            <div className='flex flex-col gap-6'>
              <h2 className='text-2xl font-semibold text-center'>
                Recent Posts
              </h2>
              <div className='flex flex-wrap justify-center gap-4'>
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              <Link
                to={'/search'}
                className='text-lg text-purple-500 hover:underline text-center'
              >
                View all posts
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;