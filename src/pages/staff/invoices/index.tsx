import './style.css';

import Button from '@components/Common/Button';
import { notify } from '@components/Common/Toastify';
import { useApiJSON } from '@services/ApiService/Api.service';
import { Modal, Pagination, Table } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';

import { invoices } from './api';

const Invoices: React.FC = () => {
  const { get } = useApiJSON();

  const [invoicesList, setInvoicesList] = useState<any>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [paginationData, setPaginationData] = useState({
    count: 0,
    hasPreviousPage: false,
    hasNextPage: false,
    pageNumber: 1,
    pageSize: 20,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderId, setOrderId] = useState('');

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

  const showModal = (orderId: string) => {
    setOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  const getInvoicesList = useCallback(async () => {
    try {
      const { data } = await invoices(get, pageNumber, pageSize);
      setInvoicesList(data.results);
      setPaginationData({
        count: data?.count,
        hasPreviousPage: data?.hasPreviousPage,
        hasNextPage: data?.hasNextPage,
        pageNumber: data?.pageNumber,
        pageSize: data?.pageSize,
      });
    } catch (error: any) {
      notify('Failed to fetch models', 'error');
    }
  }, [get]);

  const tableDataSource = invoicesList.map((order: any, i: number) => ({
    key: i,
    slNo: i + 1,
    OrderId: order?.orderID,
    customerName: order?.customer?.name,
    orderDate: dayjs(order?.order_date).format('DD, MM, YYYY'),
    deliveryDate: dayjs(order?.delivery_date).format('DD, MM, YYYY'),
    action: (
      <div className="flex gap-2">
        <Button
          handleClick={() => showModal(order?.orderID)}
          title="View"
          type="button"
          className="text-white bg-gray-500 rounded-md !py-2"
        />
        <Button
          handleClick={() => showModal(order?.orderID)}
          title="Pay"
          type="button"
          className="text-white bg-green-700 rounded-md !py-2"
        />
      </div>
    ),
  }));

  useEffect(() => {
    getInvoicesList();
  }, [getInvoicesList]);

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
      <Modal title="Modal" open={isModalOpen} onCancel={handleCancel} footer>
        <p>{orderId}</p>
      </Modal>
    </>
  );
};

export default Invoices;
