import bcrypt from 'bcryptjs';

const users = [
  {
    username: 'admin999',
    email: 'admin@mail.com',
    password: bcrypt.hashSync('password', 10),
    profilePicture:
      'https://pics.craiyon.com/2023-12-04/RkicXp6zSCCjyyXKyqg7Uw.webp',
    isAdmin: true,
    isEditor: false,
  },
  {
    username: 'lola123',
    email: 'll20190153@student.fon.bg.ac.rs',
    password: bcrypt.hashSync('password', 10),
    profilePicture:
      'https://pics.craiyon.com/2023-12-04/RkicXp6zSCCjyyXKyqg7Uw.webp',
    isAdmin: false,
    isEditor: true,
  },
  {
    username: 'nadja123',
    email: 'nadja@mail.com',
    password: bcrypt.hashSync('password', 10),
    profilePicture:
      'https://pics.craiyon.com/2023-12-04/RkicXp6zSCCjyyXKyqg7Uw.webp',
    isAdmin: false,
    isEditor: false,
  },
];

export default users;