import React, { useEffect, useState } from 'react';
import { Button, Modal, Table } from 'flowbite-react';
import axios from 'axios';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';

import { usePrivilege } from '../../hooks/usePrivilege.hook';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const DashUsers = () => {
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const isAdmin = usePrivilege('admin');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/users');
        if (res.status === 200) {
          setUsers(res.data.users);

          if (res.data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await axios.get(`/api/users?startIndex=${startIndex}`);
      if (res.status === 200) {
        setUsers((prev) => [...prev, ...res.data.users]);

        if (res.data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await axios.delete(`api/users/delete/${userIdToDelete}`);

      if (res.status === 200) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
      }

      setShowModal(false);
    } catch (error) {
      setShowModal(false);
      console.error(error);
    }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumn-slate-500'>
      {isAdmin && users.length > 0 ? (
        <>
          <Table>
            <Table.Head>
              <Table.HeadCell>Joined</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Username & Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body key={user._id} className='divide-y'>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className='w-10 h-10 rounded-full object-cover bg-gray-500'
                    />
                  </Table.Cell>
                  <Table.Cell className='flex flex-col'>
                    <span className='font-semibold'>@{user.username}</span>
                    <span className='font-semibold'>{user.email}</span>
                  </Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className='text-green-500' />
                    ) : (
                      <FaTimes className='text-red-500' />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      type='button'
                      color='failure'
                      className='p-0'
                      pill
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                    >
                      <FaTrash size={15} />
                    </Button>
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
          <p>No users joined yet!</p>
        </div>
      )}

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
              Are you sure you want to delete this user?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yer, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, abort
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashUsers;