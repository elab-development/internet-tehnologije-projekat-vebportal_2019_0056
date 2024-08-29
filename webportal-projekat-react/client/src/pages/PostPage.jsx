import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Spinner, Tooltip } from 'flowbite-react';
import axios from 'axios';
import CommentSection from '../components/posts/CommentSection';
import RecentPosts from '../components/posts/RecentPosts';

const PostPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);

  const { postSlug } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/posts?slug=${postSlug}`);
        if (res.status === 200) {
          setPost(res.data.posts[0]);
          setError(false);
          setLoading(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
        console.error(error);
      }
    };

    fetchPost();
  }, [postSlug]);

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );

  if (error)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <span className='text-3xl text-red-500 font-bold'>
          Something went wrong while fetching the post!
        </span>
      </div>
    );

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 font-bold text-center mx-auto font-serif max-w-2xl lg:text-4xl'>
        {post?.title}
      </h1>

      <Link
        to={`/search?category=${post?.category}`}
        className='self-center mt-5'
      >
        <Tooltip
          content={post?.category?.name}
          style='light'
          placement='bottom'
        >
          <Button color='gray' pill size='xs' className='flex flex-col gap-3'>
            <img src={post?.category?.image} className='w-5' />
          </Button>
        </Tooltip>
      </Link>

      <img
        src={post?.image}
        alt={post?.title}
        className='mt-10 p-3 max-h-[600px] w-full object-cover'
      />

      <div className='flex justify-between p-3 border-b border-slate-300 mx-auto w-full max-w-2xl text-xs'>
        <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
        <span className='italic'>
          {(post?.content?.length / 1000 + 1).toFixed(0)} mins read
        </span>
      </div>

      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post?.content }}
      ></div>

      <CommentSection postId={post?._id} />

      <div className='max-w-full mx-auto w-full'>
        <RecentPosts />
      </div>
    </main>
  );
};

export default PostPage;