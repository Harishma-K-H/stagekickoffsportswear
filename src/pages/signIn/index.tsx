import './style.css';

import Button from '@components/Common/Button';
import { notify } from '@components/Common/Toastify';
import { setToken, setUserIdAndRole } from '@redux/reducers/auth/reducer';
import { useApiJSON } from '@services/ApiService/Api.service';
import { Checkbox, Form, Input } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router';

import { login } from './api';
import path from 'path';
import Paths from '@routes/paths';

const SignIn: React.FC = () => {
  const { post } = useApiJSON();

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string; password: string }) => {
    navigate(Paths.Staff.dashboard)
    // try {
    //   const { data } = await login(post, values);
    //   const { accessToken, id, role } = data;
    //   dispatch(setToken(accessToken));
    //   dispatch(setUserIdAndRole({ id, role }));
    //   navigate('/home');
    // } catch (error: any) {
    //   notify(
    //     `${error?.response?.data?.message ? error?.response?.data?.message : error?.response?.data?.errors[0]?.message}`,
    //     'error',
    //   );
    // }
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
            name="email"
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
              type="email"
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
            <Link to="#" className="text-sm font-normal text-center text-sub-heading">
              Forgot password
            </Link>
          </div>
          <Button
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
