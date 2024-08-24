import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Button, TextInput } from 'flowbite-react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { app } from '../../utils/firebase';

const DashProfile = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [fileUploadingProgress, setFileUploadingProgress] = useState(null);
  const [fileUploadingError, setFileUploadingError] = useState(null);

  const filePickerRef = useRef();
  const { currentUser } = useSelector((state) => state.user);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const uploadImageToFB = async () => {
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
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
        });
      }
    );
  };

  useEffect(() => {
    if (imageFile) {
      uploadImageToFB();
    }
  }, [imageFile]);

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4'>
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
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
        />
        <TextInput type='password' id='password' placeholder='password' />
        <Button type='submit' gradientDuoTone='purpleToBlue' outline>
          Update
        </Button>
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  );
};

export default DashProfile;