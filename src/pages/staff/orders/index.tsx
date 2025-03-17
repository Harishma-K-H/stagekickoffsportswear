import Breadcrumb from '@components/Common/Breadcrumb';
import Button from '@components/Common/Button';
import CustomTabs from '@components/Common/Tabs';

import Paths from '@routes/paths';

import { Table } from 'antd';
import React from 'react';
import { useNavigate, useParams, Link } from 'react-router';

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { requestId } = useParams();

  const handleClick = (subscriberId: string) => {
    // navigate(Paths.company.requests.status.details(requestId, subscriberId));
  };

  const dataSource = [
    {
      key: '1',
      slNo: '1',
      OrderId: '5146846548465',
      name: 'Jane Cooper',
      location: 'Thiruvananthapuram',
      requestDate: '2/19/21',
      action: (
        <div className="flex gap-2">
          <Button
            handleClick={() => handleClick('5146846548465')}
            title="View"
            type="button"
            className="text-white bg-gray-500 rounded-md"
          />
          <Button
            handleClick={() => handleClick('5146846548465')}
            title="Pay"
            type="button"
            className="text-white bg-green-700 rounded-md"
          />
        </div>
      ),
    },
    {
      key: '2',
      slNo: '2',
      OrderId: '5146846548466',
      name: 'Wade Warren',
      location: 'Kannur',
      requestDate: '5/7/16',
      action: (
        <div className="flex gap-2">
          <Button
            handleClick={() => handleClick('5146846548465')}
            title="View"
            type="button"
            className="text-white bg-gray-500 rounded-md"
          />
          <Button
            handleClick={() => handleClick('5146846548465')}
            title="Pay"
            type="button"
            className="text-white bg-green-700 rounded-md"
          />
        </div>
      ),
    },
    {
      key: '3',
      slNo: '3',
      OrderId: '5146846548467',
      name: 'Esther Howard',
      location: 'Kozhikode',
      requestDate: '9/18/16',
      action: (
        <div className="flex gap-2">
          <Button
            handleClick={() => handleClick('5146846548465')}
            title="View"
            type="button"
            className="text-white bg-gray-500 rounded-md"
          />
          <Button
            handleClick={() => handleClick('5146846548465')}
            title="Pay"
            type="button"
            className="text-white bg-green-700 rounded-md"
          />
        </div>
      ),
    },
  ];

  const columns = [
    {
      title: 'Sl No.',
      dataIndex: 'slNo',
      key: 'slNo',
    },
    {
      title: 'Order ID',
      dataIndex: 'OrderId',
      key: 'OrderId',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'DATE',
      dataIndex: 'requestDate',
      key: 'requestDate',
    },
    {
      title: '#',
      dataIndex: 'action',
      key: 'action',
      width: 170,
    },
  ];

  const tabItems = [
    {
      key: 'all',
      label: <h5 className="px-6 text-[#191D23]">All</h5>,
      children: <div> <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: '700' }}
      /></div>,
    },
    {
      key: 'new',
      label: <h5 className="px-6 text-[#191D23]">New</h5>,
      children: (
        <div>
          <Table
            dataSource={dataSource}
            columns={columns}
            scroll={{ x: '700' }}
          />
        </div>
      ),
    },
    {
      key: 'completed',
      label: <h5 className="px-6 text-[#191D23]">Completed</h5>,
      children: <div>
        <Table
          dataSource={[]}
          columns={columns}
          scroll={{ x: '700' }}
        />
      </div>,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b-2">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-[#191D23]">
            Order List
          </h3>
        </div>
        <Link to={Paths.Staff.orders.new}
          className="px-[25px] py-3 transition-all text-white bg-[#CC3232] rounded-md invisible xl:visible"
        >New</Link>
      </div>
      <CustomTabs rootClass="bg-white p-3 md:p-5" items={tabItems} />
    </div>
  );
};

export default Orders;
