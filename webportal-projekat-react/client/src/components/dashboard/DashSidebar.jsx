import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar } from 'flowbite-react';
import axios from 'axios';
import {
  HiAnnotation,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiUser,
} from 'react-icons/hi';
import { BsChatRightQuote } from 'react-icons/bs';
import { RiChatQuoteLine } from 'react-icons/ri';

import { signOutSuccess } from '../../redux/user/userSlice';
import { usePrivilege } from '../../hooks/usePrivilege.hook';

const DashSidebar = () => {
  const [tab, setTab] = useState('');
  const isAdminEditor = usePrivilege('admineditor');
  const isAdmin = usePrivilege('admin');
  const isEditor = usePrivilege('editor');

  const location = useLocation();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      const res = await axios.post('/api/users/signout');
      if (res.status === 200) {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    setTab(tabFromUrl);
  }, [location]);

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              active={tab === 'profile'}
              icon={HiUser}
              label={isAdmin ? 'Admin' : isEditor ? 'Editor' : 'User'}
              labelColor='dark'
              className='cursor-pointer'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>

          {isAdmin && (
            <Link to='/dashboard?tab=users'>
              <Sidebar.Item
                active={tab === 'users'}
                icon={HiOutlineUserGroup}
                className='cursor-pointer'
                as='div'
              >
                Users
              </Sidebar.Item>
            </Link>
          )}

          {isAdminEditor && (
            <Link to='/dashboard?tab=posts'>
              <Sidebar.Item
                active={tab === 'posts'}
                icon={HiDocumentText}
                className='cursor-pointer'
                as='div'
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}

          {isAdmin && (
            <Link to='/dashboard?tab=comments'>
              <Sidebar.Item
                active={tab === 'comments'}
                icon={RiChatQuoteLine}
                className='cursor-pointer'
                as='div'
              >
                Comments
              </Sidebar.Item>
            </Link>
          )}

          <Sidebar.Item
            icon={HiArrowSmRight}
            className='cursor-pointer'
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;