import Button from '@components/Common/Button';
import { notify } from '@components/Common/Toastify';
import { useApiJSON } from '@services/ApiService/Api.service';
import { capitalizeFirstLetterOfEachWord } from '@utils/common/capitalizeFirstLetter';
import { Form, Input, Pagination, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { IoSearch } from 'react-icons/io5';

import { getCustomers } from './api';

const Customers: React.FC = () => {
  const { get } = useApiJSON();

  const [customers, setCustomers] = useState<any>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [paginationData, setPaginationData] = useState({
    count: 0,
    hasPreviousPage: false,
    hasNextPage: false,
    pageNumber: 1,
    pageSize: 20,
  });

  const handleSubmit = (values: any) => {
    if (values?.customerName != '') {
      fetchCustomers(values?.customerName);
    }
  };

  const handleClickClear = () => {
    fetchCustomers();
  };

  const columns = [
    {
      title: 'Sl No.',
      dataIndex: 'slNo',
      key: 'slNo',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      // ...getColumnSearchProps('name'),
      width: '15%',
    },
    {
      title: 'Business Name',
      dataIndex: 'businessName',
      key: 'businessName',
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
  ];

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

  const tableDataSource = customers?.map((customer: any, i: number) => ({
    key: customer.id,
    slNo: i + 1,
    name: capitalizeFirstLetterOfEachWord(customer.name),
    businessName: customer?.business_name.toUpperCase(),
    mobile: `${customer?.mobile_number1}${customer?.mobile_number2 ? `, ${customer?.mobile_number2}` : ''}`,
    address: `${customer?.address1} ${customer?.address2}`,
    email: customer?.email ? customer?.email : '-',
    gstn: customer?.gstn ? customer?.gstn : '-',
  }));

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  // Initial data fetching on component mount
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
            Customers List
          </h3>
        </div>
        <div className="p-3 bg-white md:p-5 custom-table">
          <Form className="flex gap-2 pb-3" onFinish={handleSubmit}>
            <Form.Item
              className="!mb-0 w-full"
              name="customerName"
              rules={[
                { required: false, message: 'Please enter the Customer Name' },
              ]}
            >
              <Input
                placeholder={`Search customer Name`}
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
            current={paginationData.pageNumber}
            total={paginationData.count}
            pageSize={paginationData.pageSize}
            onChange={handlePageChange}
            rootClassName="w-fit mx-auto lg:ml-auto lg:mr-0 mt-5 lg:mt-1"
          />
        </div>
      </div>
    </>
  );
};

export default Customers;
