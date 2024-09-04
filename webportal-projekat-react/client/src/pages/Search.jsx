import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Select, Spinner, TextInput } from 'flowbite-react';
import axios from 'axios';
import PostCard from '../components/posts/PostCard';

const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    order: 'desc',
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (e.target.id === 'order') {
      const sort = e.target.value || 'desc';
      setSidebarData({ ...sidebarData, order: sort });
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const orderFromUrl = urlParams.get('order');

    if (searchTermFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
      });
    }

    if (orderFromUrl) {
      setSidebarData({
        ...sidebarData,
        order: orderFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);

      try {
        const searchQuery = urlParams.toString();
        const res = await axios.get(`/api/posts?${searchQuery}`);

        if (res.status === 200) {
          setPosts(res.data.posts);
          setLoading(false);

          if (res.data.posts.length === 9) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };

    fetchPosts();
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('order', sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    const searchQuery = urlParams.toString();
    setLoading(true);

    try {
      const res = await axios.get(
        `/api/posts?${searchQuery}&startIndex=${startIndex}`
      );

      if (res.status === 200) {
        setLoading(false);
        setPosts([...posts, ...res.data.posts]);
        if (res.data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>
              Search Term:
            </label>
            <TextInput
              placeholder='Search...'
              id='searchTerm'
              type='text'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Order:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.order}
              id='order'
            >
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>

          <Button type='submit' outline gradientDuoTone='purpleToPink'>
            Search
          </Button>
        </form>
      </div>

      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>
          Posts Results
        </h1>

        <div className='p-7 flex flex-wrap gap-4 justify-center'>
          {!loading && posts.length === 0 && (
            <p className='text-xl text-gray-500'>No posts found</p>
          )}

          {loading ? (
            <div className='w-full flex items-center justify-center'>
              <Spinner size='lg' />
            </div>
          ) : (
            <>
              {posts?.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </>
          )}

          {showMore && (
            <button
              onClick={handleShowMore}
              className='text-purple-500 text-lg hover:underline p-7 w-full'
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;