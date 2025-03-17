import Breadcrumb from '@components/Common/Breadcrumb';
import React, { useState } from 'react';
import { Radio, Form, Input, Select } from 'antd';


const NewOrders: React.FC = () => {

  const [value, setValue] = useState<number>(1);

  const onChange = (e: any) => {
    setValue(e.target.value);
  };


  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b-2">
        <div className="flex">
          <Breadcrumb rootClass="rounded" />
          <h3 className="text-2xl md:text-3xl font-bold text-[#191D23]">
            Create new order
          </h3>
        </div>
      </div>
      <div className="p-3 bg-white rounded-md md:p-5">
        <h5 className="mb-2 font-medium">
          Customer Details : 
          <Radio.Group
          className="ml-5"
            onChange={onChange}
            value={value}
            options={[
              { value: 1, label: <h6>New User</h6> },
              { value: 2, label: <h6>Existing User</h6> },
            ]}
          />
        </h5>
        {/* Conditional Rendering */}
        {value === 1 && (
          <Form layout="vertical">
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please enter your email' }]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
          </Form>
        )}

        {value === 2 && (
          <Form.Item
            label="Select Existing User"
            name="existingUser"
            rules={[{ required: true, message: 'Please select a user' }]}
          >
            <Select
              showSearch
              placeholder="Search for a user"
              options={[
                { value: 'user1', label: 'User 1' },
                { value: 'user2', label: 'User 2' },
              ]}
            />
          </Form.Item>
        )}
      </div>
    </div>
  );
};

export default NewOrders;
