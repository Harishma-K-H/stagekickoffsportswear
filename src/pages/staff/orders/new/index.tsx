import Breadcrumb from '@components/Common/Breadcrumb';
import Button from '@components/Common/Button';
import React, { useState } from 'react';
import { Radio, Form, Input, Select, message, Popconfirm, Table, TableProps } from 'antd';
import { GstVerification } from './api';
import { useApiJSON } from '@services/ApiService/Api.service';
import { FaPlus } from "react-icons/fa";


import './style.css'

type ColumnTypes = Exclude<TableProps['columns'], undefined>;


const NewOrders: React.FC = () => {

  const { get } = useApiJSON();

  const [value, setValue] = useState<number>(1);

  const onChange = (e: any) => {
    setValue(e.target.value);
  };

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // GST Verification API Call
  const handleGSTVerification = async () => {
    const gstn = form.getFieldValue('gstn');

    if (!gstn) {
      form.setFieldsValue({ businessName: null });
      return
    };

    setLoading(true);

    try {
      const { data } = await GstVerification(get, { gstn });

      if (data?.flag) {
        form.setFieldsValue({ businessName: data?.data?.tradeName });
        message.success('Business name auto-filled successfully!');
      } else {
        form.setFieldsValue({ businessName: null });
        message.error('Invalid GST Number or details not found.');
      }
    } catch (error) {
      message.error('Failed to verify GST Number. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [dataSource, setDataSource] = useState([
    {
      key: '0',
    }
  ]);

  const [count, setCount] = useState(2);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'Model',
      dataIndex: 'model',
      render: (_, record) => (
        <Form.Item
          className="!mb-0 h-full"
          // label="Model"
          name={['data', record.key, 'model']}
          rules={[{ required: true, message: 'Please select a model' }]}
        >
          <Select
            size="middle"
            placeholder="Select Modal"
            className="h-full"
            options={[
              { value: 'user1', label: 'User 1' },
              { value: 'user2', label: 'User 2' },
            ]}
          />
        </Form.Item>
      )
    },
    {
      title: 'Material',
      dataIndex: 'material',
      render: (_, record) => (
        <Form.Item
          className="!mb-0 h-full"
          // label="Material"
          name={['data', record.key, 'material']}
          rules={[{ required: true, message: 'Please select a material' }]}
        >
          <Select
            size="middle"
            placeholder="Select Material"
            className="h-full"
            options={[
              { value: 'user1', label: 'User 1' },
              { value: 'user2', label: 'User 2' },
            ]}
          />
        </Form.Item>
      )
    },
    {
      title: 'Print Type',
      dataIndex: 'printType',
      render: (_, record) => (
        <Form.Item
          className="!mb-0 h-full"
          // label="Print Type"
          name={['data', record.key, 'printType']}
          rules={[{ required: true, message: 'Please select a print type' }]}
        >
          <Select
            size="middle"
            placeholder="Select Print Type"
            className="h-full"
            options={[
              { value: 'user1', label: 'User 1' },
              { value: 'user2', label: 'User 2' },
            ]}
          />
        </Form.Item>
      )
    },
    {
      title: 'Sleeve',
      dataIndex: 'sleeve',
      render: (_, record) => (
        <Form.Item
          className="!mb-0 h-full"
          // label="Sleeve"
          name={['data', record.key, 'sleeve']}
          rules={[{ required: true, message: 'Please select a sleeve' }]}
        >
          <Select
            size="middle"
            placeholder="Select Sleeve"
            className="h-full"
            options={[
              { value: 'user1', label: 'User 1' },
              { value: 'user2', label: 'User 2' },
            ]}
          />
        </Form.Item>
      )
    },
    {
      title: 'Size',
      dataIndex: 'size',
      render: (_, record) => (
        <Form.Item
          className="!mb-0 h-full"
          // label="Size"
          name={['data', record.key, 'size']}
          rules={[{ required: true, message: 'Please select a size' }]}
        >
          <Select
            size="middle"
            placeholder="Select size"
            className="h-full"
            options={[
              { value: 'user1', label: 'User 1' },
              { value: 'user2', label: 'User 2' },
            ]}
          />
        </Form.Item>
      )
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      render: (_, record) => (
        <Form.Item
          className="!mb-0"
          // label="Quantity"
          name={['data', record.key, 'quantity']}
          rules={[{ required: true, message: 'Please enter Quantity' }]}
        >
          <Input
            placeholder="Enter Quantity"
            className="w-full h-9"
            onBlur={handleGSTVerification} // Trigger API onBlur
          />
        </Form.Item>
      )
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      width: '6%',
      align: 'center',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <span className="text-red-600 cursor-pointer">Delete</span>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData = {
      key: String(count),
      model: '',
      material: '',
      printType: '',
      sleeve: '',
      size: '',
      quantity: '',
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };


  return (
    <Form form={form}
      layout="vertical" className="flex flex-col gap-4 custom-form">
      <div className="flex items-center justify-between pb-2 border-b-2">
        <div className="flex">
          <Breadcrumb rootClass="rounded" />
          <h3 className="text-2xl md:text-3xl font-bold text-[#191D23]">
            Create new order
          </h3>
        </div>
      </div>
      <div className="p-3 bg-white rounded-md md:p-5">
        <h5 className="mb-4 text-xl font-medium">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 custom-application-form">
            <Form.Item
              className="!mb-0"
              label="Customer Name"
              name="customerName"
              rules={[{ required: true, message: 'Please enter the Customer Name' }]}
            >
              <Input placeholder="Enter customer name" className="w-full py-2 h-9 placeholder:text-gray-400" />
            </Form.Item>

            <Form.Item
              className="!mb-0"
              label="Business Name"
              name="businessName"
              rules={[{ required: true, message: 'Please enter the Business Name' }]}
            >
              <Input placeholder="Enter business name" className="w-full h-9" disabled />
            </Form.Item>
            
            <Form.Item
              className="!mb-0"
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter your Email' },
                { type: 'email', message: 'Invalid email format' },
              ]}
            >
              <Input placeholder="Enter email" className="w-full py-2 h-9 placeholder:text-gray-400" />
            </Form.Item>

            <Form.Item
              className="!mb-0"
              label="Address 1"
              name="address1"
              rules={[{ required: true, message: 'Please enter Address 1' }]}
            >
              <Input placeholder="Enter address 1" className="w-full py-2 h-9 placeholder:text-gray-400" />
            </Form.Item>

            <Form.Item
              className="!mb-0"
              label="Address 2"
              name="address2"
            >
              <Input placeholder="Enter address 2" className="w-full py-2 h-9 placeholder:text-gray-400" />
            </Form.Item>

            <Form.Item
              className="!mb-0"
              label="Mobile 1"
              name="phone1"
              rules={[{ required: true, message: 'Please enter Mobile' }]}
            >
              <Input placeholder="Enter mobile" className="w-full py-2 h-9 placeholder:text-gray-400" />
            </Form.Item>

            <Form.Item
              className="!mb-0"
              label="Mobile 2"
              name="phone2"
            >
              <Input placeholder="Enter mobile 2" className="w-full py-2 h-9 placeholder:text-gray-400" />
            </Form.Item>

            <Form.Item
              className="!mb-0"
              label="GSTN"
              name="gstn"
              rules={[{ required: true, message: 'Please enter your GST Number' }]}
            >
              <Input
                placeholder="Enter GST Number"
                className="w-full h-9"
                onBlur={handleGSTVerification} // Trigger API onBlur
              />
            </Form.Item>
          </div>
        )}

        {value === 2 && (
          <div>
            <Form.Item
              className="!mb-0"
              name="existingUser"
              rules={[{ required: true, message: 'Please select a user' }]}
            >
              <Select
                size="middle"
                showSearch
                placeholder="Search for a user"
                className="h-full"
                options={[
                  { value: 'user1', label: 'User 1' },
                  { value: 'user2', label: 'User 2' },
                ]}
              />
            </Form.Item>
          </div>
        )}
      </div>
      <div className="relative p-3 bg-white rounded-md md:p-5">
        <h5 className="mb-4 text-xl font-medium">
          Item Details :
        </h5>
        <Table
          scroll={{ y: 55 * 10 }}
          rowClassName={() => 'editable-row'}
          pagination={false}
          // rowHoverable={false}
          bordered
          dataSource={dataSource}
          columns={defaultColumns as ColumnTypes}
        />
        <div className="absolute bottom-0 -right-7 w-fit">
          <Button title="" icon={<FaPlus className="w-5 h-5" />} handleClick={handleAdd} type="button" className="bg-secondary rounded-md w-full !px-4 text-white font-medium hover:!text-white/90 mx-auto hover:!bg-primary/95" />
        </div>
      </div>
      <div className="w-full">
        <Button title="Submit" type="submit" loading={loading} className="bg-primary rounded-md w-full text-white h-12 font-medium hover:!text-white/90 mx-auto hover:!bg-primary/95" />
      </div>
    </Form>
  );
};

export default NewOrders;
