import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header>
      <nav className='px-5 py-3'>
        <ul className='flex'>
          <li>
            <Link className='text-blue-500 hover:text-blue-800' to="/orders">Orders</Link>
            <span className='me-3 ms-2'>{" | "}</span>
          </li>
          <li>
            <Link className='text-blue-500 hover:text-blue-800' to="/new-order">New Order</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
