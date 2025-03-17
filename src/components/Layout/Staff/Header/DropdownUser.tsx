import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import Paths from '@routes/paths';

import { selectUserData } from '@redux/reducers/auth/selector';
import { resetUser } from '@redux/reducers/auth/reducer';

import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { BiLogOut } from 'react-icons/bi';

const DropdownUser: React.FC = () => {
    const dispatch = useDispatch<any>()
    const navigate = useNavigate()

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const userData = useSelector(selectUserData);

    const logout = () => {
        dispatch(resetUser());
        navigate(Paths.signIn);
        window.location.reload();
    }

    return (
        <div className="relative">
            <Link onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2" to="#">
                <span className="h-12 w-12 rounded-[16px] overflow-hidden border-[1px]">
                    <img src="/assets/user.jpg" alt="User" className="w-[90px]" />
                </span>
                <div className="flex gap-6">
                    <span className="hidden text-left lg:block">
                        <span className="block text-sm font-medium text-black capitalize">
                            {userData?.name}
                        </span>
                        <span className="block text-xs text-text-secondary">Student</span>
                    </span>
                    <MdOutlineKeyboardArrowDown className={`hidden fill-current w-6 h-6 sm:block ${dropdownOpen && 'rotate-180'}`} />
                </div>
            </Link>
            {
                dropdownOpen && <div onFocus={() => setDropdownOpen(true)} onBlur={() => setDropdownOpen(false)} className={`absolute right-0 top-10 mt-4 flex w-48 flex-col rounded-md border border-stroke bg-white shadow-default ${dropdownOpen === true ? 'block' : 'hidden'}`}>

                    <button className="flex items-center gap-3 px-6 py-2 text-sm font-medium text-black capitalize duration-300 ease-in-out lg:hidden lg:text-base">
                        {userData?.name}
                    </button>
                    <hr />
                    <button onClick={logout} className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-red-500 duration-300 ease-in-out hover:text-white hover:bg-red-500 lg:text-base">
                        <BiLogOut />
                        Log Out
                    </button>
                </div>
            }
        </div>
    );
};

export default DropdownUser;
