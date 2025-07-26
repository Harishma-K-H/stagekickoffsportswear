import Button from '@components/Common/Button';
import { notify } from '@components/Common/Toastify';
import { useApiJSON } from '@services/ApiService/Api.service';
import { Form, Input, Modal, Pagination, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { IoSearch } from 'react-icons/io5';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCustomers, updateCustomer } from './api';
import {
  faFilePen,
} from '@fortawesome/free-solid-svg-icons';
// Define Customer interface
interface Customer {
  id: number;
  business_name: string;
  mobile_number1: string;
  mobile_number2?: string;
  address1: string;
  address2: string;
  address3?: string;
  state_name?: string;
  pincode?: string;
  email?: string;
  gst_no?: string;
}

const Customers: React.FC = () => {
  const { get, put } = useApiJSON();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [paginationData, setPaginationData] = useState({
    count: 0,
    hasPreviousPage: false,
    hasNextPage: false,
    pageNumber: 1,
    pageSize: 20,
  });

  const handleSubmit = (values: { customerName: string }) => {
    if (values?.customerName !== '') {
      fetchCustomers(values.customerName);
    }
  };

  const handleClickClear = () => {
    fetchCustomers();
  };

  const fetchCustomers = useCallback(
    async (searchText: string = '') => {
      try {
        const { data } = await getCustomers(
          get,
          searchText,
          pageNumber,
          pageSize,
        );
        setCustomers(data.results);
        setPaginationData({
          count: data?.count,
          hasPreviousPage: data?.hasPreviousPage,
          hasNextPage: data?.hasNextPage,
          pageNumber: data?.pageNumber,
          pageSize: data?.pageSize,
        });
      } catch (error: any) {
        notify('Failed to fetch data', 'error');
      }
    },
    [get, pageNumber, pageSize],
  );

  const onShowSizeChange = useCallback((_current: number, size: number) => {
    setPageSize(size);
    setPageNumber(1);
  }, []);

  const tableDataSource = customers.map((customer, index) => ({
    key: customer.id,
    slNo: (pageNumber - 1) * pageSize + index + 1,
    businessName: customer.business_name.toUpperCase(),
    mobile: `${customer.mobile_number1}${customer.mobile_number2 ? `, ${customer.mobile_number2}` : ''}`,
    address: `${customer.address1} ${customer.address2}`,
    email: customer.email || '-',
    gstn: customer.gst_no || '-',
    pincode: customer.pincode || '-',
  }));

  const columns = [
    {
      title: 'Sl No.',
      dataIndex: 'slNo',
      key: 'slNo',
    },
    {
      title: 'Business Name',
      dataIndex: 'businessName',
      key: 'businessName',
      render: (_: any, record: any) => (
        <a
          href={`/branch/customers/${record.key}/details`}
          className="text-blue-600 hover:underline"
        >
           <strong>{record.businessName}</strong>
        </a>
      ),
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: '15%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'GSTN',
      dataIndex: 'gstn',
      key: 'gstn',
    },
    {
      title: 'Pincode',
      dataIndex: 'pincode',
      key: 'pincode',
    },
{
  title: 'Action',
  dataIndex: 'action',
  key: 'action',
  render: (_: any, record: any) => (
    <div className="flex gap-3 items-center">
      <button
        onClick={() => handleEditCustomer(record.key)}
        className="text-gray-400 cursor-not-allowed text-xl"
        title="Edit Disabled"
        disabled
      >
        <FontAwesomeIcon
          icon={faFilePen}
          className="text-gray-600 hover:text-gray-800 cursor-pointer"
        />
      </button>
    </div>
  ),
},
  ];

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  const handleEditCustomer = (customerId: number) => {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;
    setSelectedCustomer(customer);
    form.setFieldsValue({
      business_name: customer.business_name,
      mobile_number1: customer.mobile_number1,
      mobile_number2: customer.mobile_number2,
      address1: customer.address1,
      address2: customer.address2,
      email: customer.email,
      state_name: customer.state_name,
      gstn: customer.gst_no,
    });
    setEditModalOpen(true);
  };

  const handleUpdateCustomer = async (values: any) => {
    if (!selectedCustomer) return;
    try {
      await updateCustomer(put, selectedCustomer.id, values);
      notify('Customer updated successfully', 'success');
      fetchCustomers();
      setEditModalOpen(false);
    } catch (error) {
      notify('Failed to update customer', 'error');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <>
      <Helmet>
        <title>KICKOFF SPORTS WEAR - Customers </title>
      </Helmet>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b-2">
          <h3 className="text-2xl md:text-3xl font-bold text-[#191D23]">
            Customers
          </h3>
        </div>
        <div className="p-3 bg-white md:p-5 custom-table">
          <Form className="flex gap-2 pb-3" onFinish={handleSubmit}>
            <Form.Item
              className="!mb-0 w-full"
              name="customerName"
              rules={[{ required: false }]}
            >
              <Input
                placeholder="Search customer name"
                allowClear
                onClear={handleClickClear}
                className="w-full py-2 h-9 placeholder:text-gray-400"
              />
            </Form.Item>
            <Button
              type="submit"
              title=""
              icon={<IoSearch />}
              className="text-white bg-gray-500 rounded-md !py-2"
            />
          </Form>

          <Table
            bordered
            dataSource={tableDataSource}
            columns={columns}
            pagination={false}
            scroll={{ x: '700' }}
          />
          <Pagination
            current={pageNumber}
            total={paginationData.count}
            pageSize={pageSize}
            pageSizeOptions={['25', '50', '100', '150', '200']}
            onShowSizeChange={onShowSizeChange}
            onChange={handlePageChange}
            rootClassName="w-fit mx-auto lg:ml-auto lg:mr-0 mt-5 lg:mt-1"
          />
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        title={
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            Edit Customer
          </h2>
        }
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateCustomer}>
          <Form.Item
            name="business_name"
            label={<span style={{ fontWeight: 'bold' }}>Business Name</span>}
          >
            <Input
              style={{ width: '100%', maxWidth: '600px', height: '36px' }}
            />
          </Form.Item>
          <Form.Item
            name="address1"
            label={<span style={{ fontWeight: 'bold' }}>Address 1</span>}
          >
            <Input
              style={{ width: '100%', maxWidth: '600px', height: '36px' }}
            />
          </Form.Item>
          <Form.Item
            name="address2"
            label={<span style={{ fontWeight: 'bold' }}>Address 2</span>}
          >
            <Input
              style={{ width: '100%', maxWidth: '600px', height: '36px' }}
            />
          </Form.Item>
          <Form.Item
            name="address3"
            label={<span style={{ fontWeight: 'bold' }}>Address 3</span>}
          >
            <Input
              style={{ width: '100%', maxWidth: '600px', height: '36px' }}
            />
          </Form.Item>
          <Form.Item
            name="state_name"
            label={<span style={{ fontWeight: 'bold' }}>State</span>}
          >
            <Input
              style={{ width: '100%', maxWidth: '600px', height: '36px' }}
            />
          </Form.Item>
          <Form.Item
            name="pincode"
            label={<span style={{ fontWeight: 'bold' }}>Pincode</span>}
          >
            <Input
              style={{ width: '100%', maxWidth: '600px', height: '36px' }}
            />
          </Form.Item>
          <Form.Item
            name="mobile_number1"
            label={<span style={{ fontWeight: 'bold' }}>Mobile Number 1</span>}
          >
            <Input
              style={{ width: '100%', maxWidth: '600px', height: '36px' }}
            />
          </Form.Item>
          <Form.Item
            name="mobile_number2"
            label={<span style={{ fontWeight: 'bold' }}>Mobile Number 2</span>}
          >
            <Input
              style={{ width: '100%', maxWidth: '600px', height: '36px' }}
            />
          </Form.Item>
          <Form.Item
            name="email"
            label={<span style={{ fontWeight: 'bold' }}>Email</span>}
          >
            <Input
              style={{ width: '100%', maxWidth: '600px', height: '36px' }}
            />
          </Form.Item>

          <Form.Item
            name="gstn"
            label={<span style={{ fontWeight: 'bold' }}>GSTN</span>}
          >
            <Input
              style={{ width: '100%', maxWidth: '600px', height: '36px' }}
            />
          </Form.Item>

          <Button
            title="Update Customer"
            type="submit"
            className="text-white bg-green-600 mt-3"
          />
        </Form>
      </Modal>
    </>
  );
};

export default Customers;
