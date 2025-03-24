import './style.css';

import Button from '@components/Common/Button';
import Invoice from '@components/Common/Invoice';
import { notify } from '@components/Common/Toastify';
import Paths from '@routes/paths';
import { useApiJSON } from '@services/ApiService/Api.service';
import { Modal, Pagination, Table } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { useReactToPrint } from 'react-to-print';

import { orders } from './api';

const Orders: React.FC = () => {
  const { get } = useApiJSON();
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const [ordersList, setOrdersList] = useState<any>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [paginationData, setPaginationData] = useState({
    count: 0,
    hasPreviousPage: false,
    hasNextPage: false,
    pageNumber: 1,
    pageSize: 20,
  });

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
      key: 'name',
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
    },
    {
      title: 'Delivery Date',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 170,
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_orderId, setOrderId] = useState('');

  const showModal = (orderId: string) => {
    setOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getOrders = async () => {
    try {
      const { data } = await orders(get, pageNumber, pageSize);
      setOrdersList(data.results);
      setPaginationData({
        count: data?.count,
        hasPreviousPage: data?.hasPreviousPage,
        hasNextPage: data?.hasNextPage,
        pageNumber: data?.pageNumber,
        pageSize: data?.pageSize,
      });
    } catch (error: any) {
      notify(`Failed to fetch data`, 'error');
    }
  };

  useEffect(() => {
    getOrders();
  }, [pageNumber, pageSize]);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const tableDataSource = ordersList.map((order: any, i: number) => ({
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

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b-2">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#191D23]">
              Order List
            </h3>
          </div>
          <Link
            to={Paths.Staff.orders.new}
            className="px-[25px] py-3 transition-all text-white bg-[#CC3232] rounded-md invisible xl:visible"
          >
            New
          </Link>
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
      <Modal
        open={isModalOpen}
        width={1000}
        onCancel={handleCancel}
        footer={null}
      >
        <button onClick={() => reactToPrintFn()}>Print</button>
        <div ref={contentRef}>
          {' '}
          <Invoice />
        </div>
      </Modal>
    </>
  );
};

export default Orders;
