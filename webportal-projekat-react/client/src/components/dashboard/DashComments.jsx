import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Table } from 'flowbite-react';
import axios from 'axios';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';

import { usePrivilege } from '../../hooks/usePrivilege.hook';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const DashComments = () => {
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);

  const isAdmin = usePrivilege('admin');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get('/api/comments');
        if (res.status === 200) {
          setComments(res.data.comments);

          if (res.data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (isAdmin) {
      fetchComments();
    }
  }, [isAdmin]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await axios.get(`/api/comments?startIndex=${startIndex}`);
      if (res.status === 200) {
        setComments((prev) => [...prev, ...res.data.comments]);

        if (res.data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteComment = async () => {
    try {
      const res = await axios.delete(`api/comments/${commentIdToDelete}`);

      if (res.status === 200) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
      }

      setShowModal(false);
    } catch (error) {
      setShowModal(false);
      console.error(error);
    }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumn-slate-500'>
      {comments?.length > 0 ? (
        <>
          <Table>
            <Table.Head>
              <Table.HeadCell>Posted</Table.HeadCell>
              <Table.HeadCell>Content</Table.HeadCell>
              <Table.HeadCell>#Likes</Table.HeadCell>
              <Table.HeadCell>Post</Table.HeadCell>
              <Table.HeadCell>User</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body key={comment._id} className='divide-y'>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell className='flex flex-col'>
                    {comment.numberOfLikes}
                  </Table.Cell>
                  <Table.Cell>{comment.postId._id}</Table.Cell>
                  <Table.Cell>{comment.userId._id}</Table.Cell>
                  <Table.Cell>
                    <Button
                      type='button'
                      color='failure'
                      className='p-0'
                      pill
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
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
          <p>No comments posted yet!</p>
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
              Are you sure you want to delete this comment?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteComment}>
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

export default DashComments;