import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Modal, Spinner, TextInput } from 'flowbite-react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import axios from 'axios';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

import { app } from '../../utils/firebase';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from '../../redux/user/userSlice';

const DashProfile = () => {
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [fileUploadingProgress, setFileUploadingProgress] = useState(null);
  const [fileUploadingError, setFileUploadingError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const uploadImageToFB = async () => {
    setImageFileUploading(true);
    setFileUploadingError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
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
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    if (Object.keys(formData).length === 0) {
      return;
    }

    try {
      dispatch(updateStart());
      if (formData.password?.length > 0) {
        if (
          !formData.confirmPassword ||
          formData.confirmPassword?.length === 0
        ) {
          dispatch(updateFailure('You must confirm your password!'));
          return;
        } else if (formData.password !== formData.confirmPassword) {
          dispatch(updateFailure('Passwords do not match!'));
          return;
        }
      }

      const res = await axios.put(
        `/api/users/update/${currentUser._id}`,
        formData
      );
      if (res.status === 202) {
        dispatch(updateSuccess(res.data));
        setUpdateUserSuccess('Profile updated successfully!');
      }
    } catch (error) {
      dispatch(
        updateFailure(
          error?.response?.data?.message ||
            error?.message ||
            'Something went wrong!'
        )
      );
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);

    try {
      dispatch(deleteUserStart());

      const res = await axios.delete(`/api/users/delete/${currentUser._id}`);
      if (res.status === 200) {
        dispatch(deleteUserSuccess(res.data));
      }
    } catch (error) {
      dispatch(
        deleteUserFailure(
          error?.response?.data?.message ||
            error?.message ||
            'Something went wrong!'
        )
      );
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImageToFB();
    }
  }, [imageFile]);

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}
        >
          {fileUploadingProgress && (
            <CircularProgressbar
              value={fileUploadingProgress || 0}
              text={`${fileUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  color: `rgba(168, 85, 247, ${fileUploadingProgress / 100})`,
                },
                path: {
                  stroke: `rgba(168, 85, 247, ${fileUploadingProgress / 100})`,
                },
                text: {
                  stroke: `rgba(168, 85, 247, ${fileUploadingProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl ? imageFileUrl : currentUser.profilePicture}
            alt='user'
            className={`rounded-full border-8 border-[lightgray] w-full h-full ${
              fileUploadingProgress &&
              fileUploadingProgress < 100 &&
              'opacity-60'
            }`}
          />
        </div>
        {fileUploadingError && (
          <Alert color='failure'>{fileUploadingError}</Alert>
        )}
        <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />

        <TextInput
          type='password'
          id='password'
          placeholder='password'
          onChange={handleChange}
        />
        <TextInput
          type='password'
          id='confirmPassword'
          placeholder='confirm password'
          onChange={handleChange}
        />
        <Button
          type='submit'
          gradientDuoTone='purpleToBlue'
          outline
          disabled={imageFileUploading || loading}
        >
          {loading ? <Spinner size='sm' /> : 'Update'}
        </Button>
      </form>
      {error && (
        <Alert className='mt-5' color='failure'>
          {error}
        </Alert>
      )}
      {updateUserSuccess && (
        <Alert className='mt-5' color='success'>
          {updateUserSuccess}
        </Alert>
      )}
      <div className='text-red-500 flex justify-between my-5'>
        <span className='cursor-pointer' onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button
                color='failure'
                onClick={handleDeleteUser}
                disabled={loading}
              >
                {loading ? <Spinner size='sm' /> : "Yer, I'm sure"}
              </Button>
              <Button
                color='gray'
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                No, abort
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;