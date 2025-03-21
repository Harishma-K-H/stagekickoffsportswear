import './style.css';

import Button from '@components/Common/Button';
import { Modal, Table } from 'antd';
import React, { useState } from 'react';

const Invoices: React.FC = () => {
  const dataSource = [
    {
      key: '1',
      slNo: '1',
      OrderId: '123',
      customerName: 'Jane',
      invoiceNumber: '22-02-2025abc',
      action: (
        <div className="flex gap-2">
          <Button
            handleClick={() => showModal('123')}
            title="View"
            type="button"
            className="text-white bg-gray-500 rounded-md !py-2"
          />
          <Button
            handleClick={() => showModal('123')}
            title="Print"
            type="button"
            className="text-white bg-green-700 rounded-md !py-2"
          />
        </div>
      ),
    },
    {
      key: '2',
      slNo: '2',
      OrderId: '124',
      customerName: 'Cooper',
      invoiceNumber: '25-2-2025abc',
      action: (
        <div className="flex gap-2">
          <Button
            handleClick={() => showModal('124')}
            title="View"
            type="button"
            className="text-white bg-gray-500 rounded-md !py-2"
          />
          <Button
            handleClick={() => showModal('124')}
            title="Print"
            type="button"
            className="text-white bg-green-700 rounded-md !py-2"
          />
        </div>
      ),
    },
    {
      key: '3',
      slNo: '3',
      OrderId: '125',
      customerName: 'Cooper',
      invoiceNumber: '25-2-2025abc',
      action: (
        <div className="flex gap-2">
          <Button
            handleClick={() => showModal('125')}
            title="View"
            type="button"
            className="text-white bg-gray-500 rounded-md !py-2"
          />
          <Button
            handleClick={() => showModal('125')}
            title="Print"
            type="button"
            className="text-white bg-green-700 rounded-md !py-2"
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
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Invoice number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 170,
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderId, setOrderId] = useState('');

  const showModal = (orderId: string) => {
    setOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b-2">
          <h3 className="text-2xl md:text-3xl font-bold text-[#191D23]">
            Invoice List
          </h3>
        </div>
        <div className="p-3 bg-white md:p-5 custom-table">
          <Table
            bordered
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            scroll={{ x: '700' }}
          />
        </div>
      </div>
      <Modal title="Modal" open={isModalOpen} onCancel={handleCancel} footer>
        <p>{orderId}</p>
      </Modal>
    </>
  );
};

export default Invoices;
