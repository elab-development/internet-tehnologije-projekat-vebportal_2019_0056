import React, { useEffect, useState } from 'react';
import axios from 'axios';

import PostCard from './PostCard';

const RecentPosts = () => {
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await axios.get(`/api/posts?limit=2`);
        if (res.status === 200) {
          setRecentPosts(res.data.posts);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecentPosts();
  }, []);

  return (
    <div className='flex flex-col justify-center items-center mb-5'>
      <h1 className='text-xl mt-5'>Recent articles</h1>
      <div className='flex flex-wrap gap-5 mt-5 justify-center'>
        {recentPosts?.length > 0 &&
          recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>
    </div>
  );
};

export default RecentPosts;