import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Alert, Button, Spinner } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const UpdatePost = () => {
  const [formData, setFormData] = useState({});
  const [content, setContent] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitLoading(true);

    if (!content) {
      setSubmitError('Please provide content of the post!');
      setSubmitLoading(false);
      return;
    }

    try {
      const res = await axios.put(
        `/api/posts/content/${postId}/${currentUser._id}`,
        {
          content: content,
        }
      );
      if (res.status === 202) {
        setSubmitLoading(false);
        navigate(`/post/${res.data.slug}`);
      }
    } catch (error) {
      setSubmitError(
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong!'
      );
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts?postId=${postId}`);
        if (res.status === 200) {
          setSubmitError(null);
          setContent(res.data.posts[0].content);
        }
      } catch (error) {
        setSubmitError(
          error?.response?.data?.message ||
            error?.message ||
            'Something went wrong!'
        );
      }
    };

    fetchPost();
  }, [postId]);

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>
        Update the Post
      </h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          onChange={(value) => {
            setContent(value);
          }}
          value={content}
        />

        <Button
          type='submit'
          gradientDuoTone='purpleToPink'
          disabled={submitLoading}
        >
          {submitLoading ? <Spinner size='sm' /> : 'Update'}
        </Button>
      </form>
      {submitError && (
        <Alert className='mt-5' color='failure'>
          {submitError}
        </Alert>
      )}
    </div>
  );
};

export default UpdatePost;