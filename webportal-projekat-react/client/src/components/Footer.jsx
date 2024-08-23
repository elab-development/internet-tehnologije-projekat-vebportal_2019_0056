import React from 'react';
import { Link } from 'react-router-dom';
import { Footer as FooterFB } from 'flowbite-react';
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';

import Logo from '../assets/logo.png';

const Footer = () => {
  return (
    <FooterFB container className='border-t-2 border-purple-500 rounded-none'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          <div className='mt-5'>
            <Link
              to='/'
              className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold flex items-center gap-2 dark:text-white'
            >
              <img src={Logo} alt='wired-logo' className='w-8 sm:w-14' />
              <span>Wired</span>
            </Link>
          </div>
          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
            <div>
              <FooterFB.Title title='About' className='mt-4' />
              <FooterFB.LinkGroup col>
                <FooterFB.Link
                  href='https://www.wired.com/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Wired Original
                </FooterFB.Link>
                <FooterFB.Link
                  href='/about'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Wired Blog
                </FooterFB.Link>
              </FooterFB.LinkGroup>
            </div>
            <div>
              <FooterFB.Title title='Keep in Touch' className='mt-4' />
              <FooterFB.LinkGroup col>
                <FooterFB.Link
                  href='https://www.wired.com/newsletter'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Newsletter
                </FooterFB.Link>
                <FooterFB.Link
                  href='https://www.wired.com/tag/wired-consulting/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Consulting
                </FooterFB.Link>
              </FooterFB.LinkGroup>
            </div>
            <div>
              <FooterFB.Title title='Legal' className='mt-4' />
              <FooterFB.LinkGroup col>
                <FooterFB.Link href='#'>Privacy Policy</FooterFB.Link>
                <FooterFB.Link href='#'>Terms &amp; Conditions</FooterFB.Link>
              </FooterFB.LinkGroup>
            </div>
          </div>
        </div>
        <FooterFB.Divider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <FooterFB.Copyright
            href='#'
            by='ANS'
            year={new Date().getFullYear()}
          />
          <div className='flex gap-6 sm:mt-0 mt-4 sm:justify-center'>
            <FooterFB.Icon href='#' icon={FaFacebook} />
            <FooterFB.Icon href='#' icon={FaTwitter} />
            <FooterFB.Icon href='#' icon={FaPinterest} />
            <FooterFB.Icon href='#' icon={FaYoutube} />
            <FooterFB.Icon href='#' icon={FaInstagram} />
            <FooterFB.Icon href='#' icon={FaTiktok} />
          </div>
        </div>
      </div>
    </FooterFB>
  );
};

export default Footer;