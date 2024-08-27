import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, Table } from 'flowbite-react';
import axios from 'axios';
import { FaRegEdit, FaTrash } from 'react-icons/fa';

import { usePrivilege } from '../../hooks/usePrivilege.hook';

const DashPosts = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);

  const isAdminEditor = usePrivilege('admineditor');
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/posts?userId=${currentUser._id}`);
        if (res.status === 200) {
          setUserPosts(res.data.posts);

          if (res.data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (isAdminEditor) {
      fetchPosts();
    }
  }, [currentUser._id, isAdminEditor]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await axios.get(
        `/api/posts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      if (res.status === 200) {
        setUserPosts((prev) => [...prev, ...res.data.posts]);

        if (res.data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumn-slate-500'>
      {isAdminEditor && userPosts.length > 0 ? (
        <>
          <Table>
            <Table.Head>
              <Table.HeadCell>Updated</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body key={post._id} className='divide-y'>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className='w-20 h-10 object-cover bg-gray-500'
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <span className='font-semibold'>{post.title}</span>
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category?.name}</Table.Cell>
                  <Table.Cell>
                    <Button color='failure' className='p-0' pill>
                      <FaTrash size={15} />
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <Button color='gray' className='p-0' pill>
                        <FaRegEdit size={15} />
                      </Button>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-purple-500 self-center font-semibold text-sm py-7'
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <div className='flex items-center justify-center my-7'>
          <p>
            No posts created yet!{' '}
            <Link to='/create-post'>
              <span>Create a new one</span>
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default DashPosts;