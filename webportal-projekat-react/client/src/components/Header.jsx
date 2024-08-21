import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Navbar, TextInput } from 'flowbite-react';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon } from 'react-icons/fa';

import Logo from '../assets/logo.png';

const Header = () => {
  const path = useLocation().pathname;

  return (
    <Navbar className='border-b-2'>
      <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold flex items-center gap-2 dark:text-white'
      >
        <img src={Logo} alt='wired-logo' className='w-8 sm:w-14' />
        <span>Wired</span>
      </Link>

      <form>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline '
        />
      </form>
      <Button
        className='w-12 h-10 flex items-center lg:hidden'
        color='gray'
        pill
      >
        <AiOutlineSearch />
      </Button>

      <div className='flex gap-2 md:order-2'>
        <Button className='w-12 h-10 hidden sm:inline' color='gray' pill>
          <FaMoon />
        </Button>
        <Link to='/sign-in'>
          <Button gradientDuoTone='purpleToBlue'>Sign In</Button>
        </Link>
        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as='div'>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as='div'>
          <Link to='/about'>About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/projects'} as='div'>
          <Link to='/projects'>Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;