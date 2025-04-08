import './style.css';

import Button from '@components/Common/Button';
import { notify } from '@components/Common/Toastify';
import { setToken, setUserName, setUserRole } from '@redux/reducers/auth/reducer';
import Paths from '@routes/paths';
import { useApiJSON } from '@services/ApiService/Api.service';
import { Checkbox, Form, Input } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router';

import { login } from './api';

const SignIn: React.FC = () => {
  const { post } = useApiJSON();

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const [apiLoader, setApiLoader] = useState(false);

  const handleSubmit = async (values: {
    login_identifier: string;
    password: string;
  }) => {
    setApiLoader(true);
    try {
      const { data } = await login(post, values);
      const { access, name, role, refresh } = data;
      dispatch(setToken({ access, refresh }));
      dispatch(setUserName({ name }));
      dispatch(setUserRole(role.toUpperCase()));

      if (role.toUpperCase() === import.meta.env.VITE_STAFF_ROLE) {
        navigate(Paths.Staff.dashboard);
      } else if (role.toUpperCase() === import.meta.env.VITE_ADMIN_ROLE) {
        navigate(Paths.Admin.dashboard);
      }
      setApiLoader(false);
    } catch (error: any) {
      setApiLoader(false);
      notify(`Email or Password is incorrect`, 'error');
    }
  };

  return (
    <div className="grid items-center min-h-screen grid-cols-1">
      <div className="w-full px-3 mx-auto md:px-0 md:w-auto">
        <img
          src="/logo.png"
          alt="logo"
          className="w-40 mx-auto mb-2 md:w-60 md:mb-3"
        />
        <h3 className="mb-3 font-bold text-center 2xsm:text-2xl md:text-5xl xl:text-5xl">
          Sign in to your account
        </h3>
        <h6 className="font-normal text-center text-sub-heading">
          Lorem ipsum dolor, sit amet
        </h6>
        <Form
          onFinish={handleSubmit}
          className="flex flex-col gap-4 bg-white px-4 py-6 drop-shadow-md md:w-11/12 mx-auto mt-4 md:min-w-[500px]"
        >
          <Form.Item
            name="login_identifier"
            rules={[
              {
                required: true,
                message: 'Please enter your email!',
                type: 'email',
              },
            ]}
            className="mb-0"
          >
            <Input
              type="login_identifier"
              placeholder="Enter your email"
              className="w-full py-3 placeholder:text-gray-800"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
            className="mb-0"
          >
            <Input.Password
              placeholder="Enter Password"
              className="w-full py-3 placeholder-gray-800"
            />
          </Form.Item>
          <div className="flex justify-between">
            <Checkbox className="text-sm font-normal text-center custom-checkbox text-sub-heading">
              Remember me
            </Checkbox>
            <Link
              to="#"
              className="text-sm font-normal text-center text-sub-heading"
            >
              Forgot password
            </Link>
          </div>
          <Button
            loading={apiLoader}
            title="Sign In"
            tooltip="Sign In"
            className="h-12 font-semibold text-white border-2 rounded-md bg-primary border-primary hover:text-primary hover:bg-white"
            type="submit"
          />
        </Form>
      </div>
    </div>
  );
};

export default SignIn;
