import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Button, Spinner, Textarea } from 'flowbite-react';
import axios from 'axios';

import Comment from './Comment';

const CommentSection = ({ postId }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [comments, setComments] = useState([]);
  const [refetch, setRefetch] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment) {
      setSubmitError('Please provide some comment!');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/comments', {
        content: comment,
        postId: postId,
        userId: currentUser._id,
      });

      if (res.status === 201) {
        setComment('');
        setLoading(false);
        setRefetch(!refetch);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setSubmitError(
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong!'
      );
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/comments/getPostComments/${postId}`);
        if (res.status === 200) {
          setComments(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchComments();
  }, [postId, refetch]);

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ? (
        <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
          <p>Signed in as:</p>
          <img
            className='h-5 w-5 object-cover rounded-full'
            src={currentUser.profilePicture}
            alt={currentUser.username}
          />
          <Link
            to='/dashboard?tab=profile'
            className='text-xs text-purple-500 hover:underline'
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className='text-sm text-gray-500 my-5 flex gap-1'>
          You must be signed in to comment!
          <Link className='text-purple-500 hover:underline' to='/sign-in'>
            Sign In
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className='border border-purple-500 rounded-md p-3'
        >
          <Textarea
            placeholder='Add a comment...'
            rows={3}
            maxLength='200'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className='flex justify-between items-center mt-5'>
            <p className='text-gray-500 text-xs'>
              {200 - comment.length} characters remaining
            </p>
            <Button
              outline
              gradientDuoTone='purpleToBlue'
              type='submit'
              disabled={loading}
            >
              {loading ? <Spinner size='sm' /> : 'Publish'}
            </Button>
          </div>
          {submitError && (
            <Alert className='mt-5' color='failure'>
              {submitError}
            </Alert>
          )}
        </form>
      )}

      {comments?.length === 0 ? (
        <p className='text-sm my-5'>No comments.</p>
      ) : (
        <>
          <div className='text-sm my-5 flex items-center gap-1'>
            <p>Comments:</p>
            <div className='border border-gray-400 py-1 px-2 rounded-sm'>
              {comments.length}
            </div>
          </div>
          {comments.map((comm) => (
            <Comment key={comm._id} comment={comm} />
          ))}
        </>
      )}
    </div>
  );
};

export default CommentSection;