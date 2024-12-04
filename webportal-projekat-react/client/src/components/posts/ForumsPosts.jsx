import React, { useEffect, useState } from 'react';

import { getForums } from '../../utils/forumsApi';
import { Spinner } from 'flowbite-react';

const ForumsPosts = () => {
  const [forums, setForums] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchForums = async () => {
      setLoading(true);
      const fetchedForums = await getForums();
      setForums(fetchedForums);
      setLoading(false);
    };

    fetchForums();
  }, []);

  return (
    <div className='flex flex-col gap-6'>
      <h2 className='text-2xl font-semibold text-center'>Popular Topics</h2>
      <div className='flex flex-wrap justify-center gap-4 mb-10'>
        {loading ? (
          <Spinner size='lg' />
        ) : forums?.length === 0 ? (
          <p>Maxed out the API!</p>
        ) : (
          <>
            {forums?.slice(0, 9).map((forumPost) => (
              <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                <div className='flex justify-between'>
                  <div>
                    <h3 className='text-gray-500 text-md uppercase'>
                      {forumPost.source}
                    </h3>
                    <a
                      href={forumPost.url}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <p className='text-xl'>{forumPost.title}</p>
                    </a>
                  </div>
                </div>
                <div className='flex gap-2 text-sm'>
                  <span className='text-green-500 flex items-center'>
                    #{forumPost.rank}
                  </span>
                  <div className='text-gray-500'>Ranked</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ForumsPosts;