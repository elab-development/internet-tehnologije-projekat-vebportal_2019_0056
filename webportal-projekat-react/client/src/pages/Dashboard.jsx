import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import DashSidebar from '../components/dashboard/DashSidebar';
import DashProfile from '../components/dashboard/DashProfile';
import DashPosts from '../components/dashboard/DashPosts';

const Dashboard = () => {
  const [tab, setTab] = useState('');

  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    setTab(tabFromUrl);
  }, [location]);

  return (
    <div className='min-h-[80vh] flex flex-col md:flex-row'>
      <div className='md:w-56'>
        <DashSidebar />
      </div>
      {tab === 'profile' && <DashProfile />}
      {tab === 'posts' && <DashPosts />}
    </div>
  );
};

export default Dashboard;