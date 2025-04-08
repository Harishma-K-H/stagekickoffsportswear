import { resetUser } from '@redux/reducers/auth/reducer';
import Paths from '@routes/paths';
import React, { useEffect, useRef, useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router';

const DropdownUser: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Create a ref for the dropdown container

  // Function to handle logout
  const logout = () => {
    dispatch(resetUser());
    navigate(Paths.signIn);
    window.location.reload();
  };

  // Effect to handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false); // Close dropdown if click is outside
      }
    };

    // Add event listener when dropdown is open
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener on unmount or when dropdown closes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]); // Dependency array ensures effect runs when dropdownOpen changes

  return (
    <div className="relative" ref={dropdownRef}>
      {' '}
      {/* Attach ref to the container */}
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2"
        to="#"
      >
        <span className="h-12 w-12 rounded-[16px] overflow-hidden border-[1px]">
          <img src="/user.jpg" alt="User" className="w-[90px]" />
        </span>
        {/* Uncomment if you want to include username and role */}
        {/* <div className="flex gap-6">
          <span className="hidden text-left lg:block">
            <span className="block text-sm font-medium text-black capitalize">
              {userName}
            </span>
            <span className="block text-xs text-text-secondary">{userRole}</span>
          </span>
          <MdOutlineKeyboardArrowDown
            className={`hidden fill-current w-6 h-6 sm:block ${dropdownOpen && 'rotate-180'}`}
          />
        </div> */}
      </Link>
      {dropdownOpen && (
        <div
          className={`absolute right-0 top-10 mt-4 flex w-48 flex-col rounded-md border border-stroke bg-white shadow-default ${dropdownOpen ? 'block' : 'hidden'}`}
        >
          <button
            onClick={logout}
            className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-red-500 duration-300 ease-in-out hover:text-white hover:bg-red-500 lg:text-base"
          >
            <BiLogOut />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownUser;
