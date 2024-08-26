import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  FileInput,
  Select,
  Spinner,
  TextInput,
} from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

import { app } from '../utils/firebase';

const CreatePost = () => {
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [fileUploadingProgress, setFileUploadingProgress] = useState(null);
  const [fileUploadingError, setFileUploadingError] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const navigate = useNavigate();

  const handleUploadImage = async () => {
    try {
      setFileUploadingError(null);

      if (!file) {
        setFileUploadingError('Please select an image!');
        return;
      }

      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFileUploadingProgress(progress.toFixed(0));
        },
        (error) => {
          setFileUploadingError(
            'Could not upload image (File must be an image of the size less than 2MB)'
          );
          setFileUploadingProgress(null);
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFileUploadingProgress(null);
            setFileUploadingError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setFileUploadingError('Image uploading failed');
      setFileUploadingProgress(null);
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitLoading(true);

    if (!formData) {
      setSubmitError('No data for posting!');
      setSubmitLoading(false);
      return;
    }

    if (!formData.title) {
      setSubmitError('Please provide title of the post!');
      setSubmitLoading(false);
      return;
    }

    if (!formData.content) {
      setSubmitError('Please provide content of the post!');
      setSubmitLoading(false);
      return;
    }

    if (!formData.category || formData.category === 'uncategorized') {
      setSubmitError('Please provide category of the post!');
      setSubmitLoading(false);
      return;
    }

    try {
      const res = await axios.post('/api/posts', formData);
      if (res.status === 201) {
        setSubmitLoading(false);
        setFileUploadingError(null);
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
    const fetchCategories = async () => {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    };

    fetchCategories();
  }, []);

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>
        Create new Post
      </h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            id='title'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          {categories && (
            <Select
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value='uncategorized'>Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Select>
          )}
        </div>

        <div className='flex gap-4 items-center justify-between border-4 border-purple-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={handleUploadImage}
          >
            {fileUploadingProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={fileUploadingProgress || 0}
                  text={`${fileUploadingProgress || 0}%`}
                  strokeWidth={5}
                  styles={{
                    path: {
                      stroke: `rgba(168, 85, 247, ${
                        fileUploadingProgress / 100
                      })`,
                    },
                    text: {
                      stroke: `rgba(168, 85, 247, ${
                        fileUploadingProgress / 100
                      })`,
                    },
                  }}
                />
              </div>
            ) : (
              ' Upload Image'
            )}
          </Button>
        </div>

        {fileUploadingError && (
          <Alert color='failure'>{fileUploadingError}</Alert>
        )}

        {formData?.image && (
          <img
            src={formData.image}
            alt='uploaded'
            className='w-full h-72 object-cover'
          />
        )}

        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button
          type='submit'
          gradientDuoTone='purpleToPink'
          disabled={submitLoading}
        >
          {submitLoading ? <Spinner size='sm' /> : 'Publish'}
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

export default CreatePost;