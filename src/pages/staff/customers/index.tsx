import Button from '@components/Common/Button';
import { notify } from '@components/Common/Toastify';
import { faFilePen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApiJSON } from '@services/ApiService/Api.service';
import { Form, Input, Modal, Pagination, Table, Select } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { IoSearch } from 'react-icons/io5';
import { fetchStates } from "../orders/new/api";
import { getCustomers, updateCustomer,createCustomer } from './api';
// import { fetchBranches } from '@pages/admin/items/api';
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
  state?: string;
  pincode?: string;
  email?: string;
  gst_no?: string;
}

const Customers: React.FC = () => {
  const { get, put,post } = useApiJSON();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // const [branches, setBranches] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [form] = Form.useForm();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
    const [states, setStates] = useState<{ id: number; name: string }[]>([]);
  const [pageSize, setPageSize] = useState<number>(25);
  const [paginationData, setPaginationData] = useState({
    count: 0,
    hasPreviousPage: false,
    hasNextPage: false,
    pageNumber: 1,
    pageSize: 20,
  });
 const handleAddCustomerClick = () => {
  form.resetFields(); // Clear old form values
  setSelectedCustomer(null); // Make sure no customer is selected
  setAddModalOpen(true); // Open the modal
};

// useEffect(() => {
//   const loadBranches = async () => {
//     const res = await fetchBranches(get);
//     setBranches(res.data);
//   };
//   loadBranches();
// }, []);
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
  useEffect(() => {
    const getStates = async () => {
      try {
        const { data } = await fetchStates(get);
        setStates(data); // Assuming `data` is an array of state names or objects
      } catch (error) {
        notify('Failed to fetch states', 'error');
      }
    };

    getStates();
  }, [get]);
  const tableDataSource = customers.map((customer, index) => ({
    key: customer.id,
    slNo: (pageNumber - 1) * pageSize + index + 1,
    businessName: customer.business_name.toUpperCase(),
    mobile: `${customer.mobile_number1}${customer.mobile_number2 ? `, ${customer.mobile_number2}` : ''}`,
    address: [customer.address1, customer.address2, customer.address3]
    .filter(Boolean)
    .join(' '),
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
        <div className="flex items-center justify-center">
          <button
            onClick={() => handleEditCustomer(record.key)}
            className="text-black-500 hover:text-blue-800 text-xl cursor-pointer"
            title="Edit"
          >
            <FontAwesomeIcon icon={faFilePen} className="text-inherit" />
          </button>
        </div>
      ),
    },
  ];

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
      address3: customer.address3,
      email: customer.email,
      state: {
      label: customer.state_name || '', // e.g., "KARNATAKA"
      value: customer.state,            // e.g., 20
    },
  
      pincode: customer.pincode,
      gstn: customer.gst_no,
    });
    setEditModalOpen(true);
  };

  const handleUpdateCustomer = async (values: any) => {
  if (!selectedCustomer) return;

  const payload = {
    ...values,
    name: values.business_name, 
    state: values.state?.value, // ✅ Extract just the state ID
    branch_id: values.branch,
  };

  try {
    await updateCustomer(put, selectedCustomer.id, payload);
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
           <Form
                      className="flex items-center pb-3"
                      onFinish={handleSubmit}
                    >
                      <div className="flex items-center gap-2 ml-auto">
                        <Form.Item
                          className="!mb-0 flex-1"
                          name="customerName"
                          rules={[{ required: false }]}
                        >
                          <Input
                            placeholder="Search customer name"
                            allowClear
                            onClear={handleClickClear}
                            className="w-64 h-11 px-3 placeholder:text-gray-400"
                          />
                        </Form.Item>
                    
                        <Button
                          type="submit"
                          title=""
                          icon={<IoSearch className="text-xl" />}
                          className="text-white bg-gray-500 rounded-md !py-3"
              />
 <Button
  type="button"
  title="New"
  className="px-[15px] py-3 transition-all text-white bg-[#D92D20] hover:bg-[#B42318] rounded-md invisible xl:visible"
  handleClick={handleAddCustomerClick}
/>


                      </div>
                    </Form>
          {/* Table */}
          <Table
            bordered
            dataSource={tableDataSource}
            columns={columns}
            pagination={false}
            scroll={{ x: '700' }}
          />

          {/* Custom Pagination + PageSize */}
          <div className="mt-4 w-full flex items-center justify-end gap-2">
            
            <Pagination
              current={pageNumber}
              pageSize={pageSize}
              total={paginationData.count}
              onChange={(page) => setPageNumber(page)}
              showSizeChanger={false} // we hide default changer
            />
            <span className="text-sm text-gray-600">Rows:</span>
            <Select
              size="small"
              style={{ width: 120 }}
              value={pageSize === paginationData.count ? 'All' : String(pageSize)}
              onChange={(val) => {
                if (val === 'All') {
                  setPageSize(paginationData.count); // show all
                  setPageNumber(1);
                } else {
                  setPageSize(Number(val));
                  setPageNumber(1);
                }
              }}
              options={[
                { value: '25', label: '25 / page' },
                { value: '50', label: '50 / page' },
                { value: '100', label: '100 / page' },
                { value: '150', label: '150 / page' },
                { value: '200', label: '200 / page' },
                { value: 'All', label: 'All' },
              ]}
            />

          </div>
        </div>
      </div>
      <Modal
  title={
    <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
      Add New Customer
    </h2>
  }
  open={addModalOpen}
  onCancel={() => setAddModalOpen(false)}
  footer={null}
  width={700}
>
  <Form
    form={form}
    layout="vertical"
    onFinish={async (values) => {
      try {
        const payload = {
          ...values,
          name: values.business_name,
          state: values.state?.value,

        };
        // You'll need a createCustomer API function
        await createCustomer(post, payload);
        notify('Customer added successfully', 'success');
        fetchCustomers();
        setAddModalOpen(false);
        form.resetFields();
      } catch (err) {
        notify('Failed to add customer', 'error');
      }
    }}
  >
 {/* <Form.Item
  name="branch_id"
  label="Branch"
  rules={[{ required: true, message: "Please select a branch" }]}
>
  <Select placeholder="Select a Branch" className="w-full">
    {branches.map((branch: any) => (
      <Select.Option key={branch.id} value={branch.id}>
        {branch.name}
      </Select.Option>
    ))}
  </Select>
</Form.Item> */}


    <Form.Item name="business_name" label="Business Name" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="address1" label="Address 1" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="address2" label="Address 2">
      <Input />
    </Form.Item>
    <Form.Item name="address3" label="Address 3">
      <Input />
    </Form.Item>
    <Form.Item name="state" label="State" rules={[{ required: true }]}>
      <Select
        placeholder="Select a State"
        showSearch
        labelInValue
        optionFilterProp="children"
        className="w-full"
      >
        {states.map((state) => (
          <Select.Option key={state.id} value={state.id}>
            {state.name}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
    <Form.Item name="pincode" label="Pincode">
      <Input />
    </Form.Item>
   <Form.Item
  name="mobile_number1"
  label="Mobile Number 1"
  rules={[
    {
      pattern: /^\d{10}$/,
      message: 'Mobile number must be exactly 10 digits',
      required:true
      
    },
  ]}
>
  <Input maxLength={10} />
</Form.Item>

   <Form.Item
  name="mobile_number2"
  label="Mobile Number 2"
  rules={[
    {
      pattern: /^\d{10}$/,
      message: 'Mobile number must be exactly 10 digits',
    },
  ]}
>
  <Input maxLength={10} />
</Form.Item>

    <Form.Item
  name="email"
  label="Email"
  rules={[
    {
      type: 'email',
      message: 'Please enter a valid email address',
    },
  ]}
>
  <Input />
</Form.Item>

    <Form.Item name="gstn" label="GSTN">
      <Input />
    </Form.Item>
    <Button
      title="Create Customer"
      type="submit"
      className="text-white bg-blue-600 mt-3"
    />
  </Form>
</Modal>


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
          <Form.Item name="business_name" label="Business Name">
            <Input />
          </Form.Item>
          <Form.Item name="address1" label="Address 1">
            <Input />
          </Form.Item>
          <Form.Item name="address2" label="Address 2">
            <Input />
          </Form.Item>
          <Form.Item name="address3" label="Address 3">
            <Input />
          </Form.Item>
     <Form.Item name="state" label="State">
  <Select
    placeholder="Select a State"
    showSearch
    labelInValue
    className="w-full"
    optionFilterProp="children"
  >
    {states.map((state) => (
      <Select.Option key={state.id} value={state.id}>
        {state.name}
      </Select.Option>
    ))}
  </Select>
</Form.Item>
          <Form.Item name="pincode" label="Pincode">
            <Input />
          </Form.Item>
          <Form.Item name="mobile_number1" label="Mobile Number 1">
            <Input />
          </Form.Item>
          <Form.Item name="mobile_number2" label="Mobile Number 2">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="gstn" label="GSTN">
            <Input />
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
