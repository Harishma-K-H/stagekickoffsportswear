import './style.css';

import Button from '@components/Common/Button';
import Invoice from '@components/Common/Invoice';
import { notify } from '@components/Common/Toastify';
import PaymentHistory from '@components/Staff/PaymentHistory';
import Paths from '@routes/paths';
import { useApiJSON } from '@services/ApiService/Api.service';
import { capitalizeFirstLetterOfEachWord } from '@utils/common/capitalizeFirstLetter';
import { generatePDF } from '@utils/staff/downloadPdf';
import { paidAmount } from '@utils/staff/paidAmount';
import { Modal, Pagination, Table } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaPrint } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa6';
import { Link } from 'react-router';
import { useReactToPrint } from 'react-to-print';

import { orderById, orders, payment } from './api';

const Orders: React.FC = () => {
  const { get, post } = useApiJSON();

  const [ordersList, setOrdersList] = useState<any>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [paginationData, setPaginationData] = useState({
    count: 0,
    hasPreviousPage: false,
    hasNextPage: false,
    pageNumber: pageNumber,
    pageSize: pageSize,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalId, setModalId] = useState<number>(1);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>({});

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
      title: 'Customer',
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
      title: 'Total Cost',
      dataIndex: 'total_cost',
      key: 'total_cost',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 170,
      render: (_: any, record: any) => {
        const totalPaid = paidAmount(record.payment_details);
        const balanceAmount =
          record.payment_details?.length > 0 &&
          record.payment_details[record.payment_details?.length - 1]
            ?.balance_amount;
        const currentBalance = balanceAmount
          ? parseFloat(balanceAmount)
          : Math.round(parseFloat(record.total_cost || '0') - totalPaid);

        return (
          <div className="flex gap-2">
            <Button
              handleClick={() => showModal(ordersList[record?.key]?.id, 1)}
              title="View"
              type="button"
              className="text-white bg-gray-500 rounded-md !py-2"
            />
            <Button
              handleClick={() => showModal(ordersList[record?.key]?.id, 2)}
              title={currentBalance <= 0 ? 'Paid' : 'Pay'}
              type="button"
              className={`text-white ${currentBalance <= 0 ? 'bg-gray-500' : 'bg-green-700'}  rounded-md !py-2`}
            />
            <Link to={Paths.Staff.orders.edit(ordersList[record?.key]?.id)}>
              <Button
                title="Edit"
                type="button"
                className={`text-white bg-gray-500 rounded-md !py-2`}
              />
            </Link>
          </div>
        );
      },
    },
  ];

  const getOrders = useCallback(async () => {
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
      notify('Failed to fetch data', 'error');
    }
  }, [get, pageNumber, pageSize]);

  // Memoized function to fetch order by ID
  const getOrderById = useCallback(async () => {
    if (orderId === null) return; // Skip if orderId is null

    try {
      const { data } = await orderById(get, orderId);
      setOrderDetails(data);
    } catch (error: any) {
      notify('Failed to fetch order details', 'error');
    }
  }, [get, orderId]);

  // Memoized function to create new payment
  const CreteNewPayment = useCallback(
    async (payload: any) => {
      try {
        await payment(post, payload);
        notify('Payment Success', 'success');
        await getOrderById(); // Refresh order details after payment
        await getOrders(); // Refresh order list after payment
      } catch (error: any) {
        notify('Failed payment submission', 'error');
      }
    },
    [post, getOrderById, getOrders],
  );

  // Memoized function to show modal
  const showModal = useCallback((orId: number, modalId: number) => {
    setModalId(modalId);
    setOrderId(orId); // Set orderId to trigger getOrderById
    setIsModalOpen(true);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  const tableDataSource = ordersList?.map((order: any, i: number) => ({
    key: i,
    slNo: i + 1,
    OrderId: order?.orderID,
    customerName: capitalizeFirstLetterOfEachWord(order?.customer?.business_name),
    orderDate: dayjs(order?.order_date).format('DD-MM-YYYY - h:mm A'),
    deliveryDate: dayjs(order?.delivery_date).format('DD-MM-YYYY'),
    payment_details: order?.payment_details, // Pass payment_details to the record
    total_cost: order?.total_cost, // Pass total_cost to the record
  }));

  const onShowSizeChange = useCallback((current: number, pageSize: number) => {
    setPageSize(pageSize);
    setPageNumber(current);
  }, []);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  useEffect(() => {
    getOrderById();
  }, [getOrderById]);

  return (
    <>
      <Helmet>
        <title>KICKOFF SPORTS WEAR - Orders </title>
      </Helmet>
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
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            onChange={handlePageChange}
            rootClassName="w-fit mx-auto lg:ml-auto lg:mr-0 mt-5 lg:mt-1"
          />
        </div>
      </div>
      <ModalDetails
        orderDetails={orderDetails}
        CreteNewPayment={CreteNewPayment}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalId={modalId}
        setOrderId={setOrderId}
      />
    </>
  );
};

const ModalDetails: React.FC<any> = ({
  orderDetails,
  CreteNewPayment,
  isModalOpen,
  setIsModalOpen,
  modalId,
  setOrderId,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [printForOffice, setPrintForOffice] = useState<boolean>(false);
  const [printForOfficeInvoice, setPrintForOfficeInvoice] =
    useState<boolean>(false);
  const [downloadForOffice, setDownloadForOffice] = useState<boolean>(false);

  const handleDownload = useCallback(
    async (filesName?: string) => {
      const fileName = filesName
        ? filesName
        : orderDetails?.invoice_id
          ? `Order_${orderDetails?.orderID}_${dayjs().format('YYYYMMDD')}.pdf`
          : 'Order.pdf';

      await generatePDF({
        contentRef,
        fileName,
      });
    },
    [contentRef, orderDetails],
  );

  // Configure react-to-print with a custom document title
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: orderDetails?.orderID
      ? `Order_${orderDetails?.orderID}_${dayjs().format('YYYYMMDD')}`
      : 'Order_Invoice', // Fallback if orderDetails is not yet set
  });

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setOrderId(null); // Reset orderId when closing modal
  }, []);

  const handleOfficePrint = useCallback(() => {
    setPrintForOffice(true);
    setTimeout(() => {
      reactToPrintFn();
      setPrintForOffice(false);
    }, 100);
  }, []);

  const handleOfficeDownload = useCallback(() => {
    setDownloadForOffice(true);
    setTimeout(() => {
      handleDownload(
        `Order_${orderDetails?.orderID}_${dayjs().format('YYYYMMDD')}.pdf`,
      );
      setDownloadForOffice(false);
    }, 100);
  }, []);

  const handleOfficeInvoicePrint = useCallback(() => {
    setPrintForOfficeInvoice(true);
    setTimeout(() => {
      reactToPrintFn();
      setPrintForOfficeInvoice(false);
    }, 100);
  }, []);

  const handleOfficeInvoiceDownload = useCallback(() => {
    setPrintForOfficeInvoice(true);
    setTimeout(() => {
      handleDownload(
        `Invoice_${orderDetails?.invoice_id}_${dayjs().format('YYYYMMDD')}.pdf`,
      );
      setPrintForOfficeInvoice(false);
    }, 100);
  }, [orderDetails]);

  return (
    <Modal
      open={isModalOpen}
      width={1000}
      centered
      onCancel={handleCancel}
      footer={null}
    >
      {modalId === 1 && orderDetails && (
        <>
          <div ref={contentRef}>
            {' '}
            <Invoice
              type={printForOfficeInvoice ? 'INVOICE' : 'ORDER'}
              data={orderDetails}
              printForOffice={printForOffice}
              downloadForOffice={downloadForOffice}
              printForOfficeInvoice={printForOfficeInvoice}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              handleClick={reactToPrintFn}
              title="Customer Print"
              type="button"
              icon={<FaPrint />}
              className={`text-white bg-secondary rounded-md !py-2 w-fit flex gap-2 items-center mt-2`}
            />
            <Button
              handleClick={() =>
                handleDownload(
                  `Order_${orderDetails?.orderID}_${dayjs().format('YYYYMMDD')}.pdf`,
                )
              }
              title=""
              type="button"
              icon={<FaDownload />}
              className={`text-white bg-secondary rounded-md !py-2 w-fit flex gap-2 items-center mt-2`}
            />
            <Button
              handleClick={handleOfficePrint}
              title="Office Print"
              type="button"
              icon={<FaPrint />}
              className={`text-white bg-secondary rounded-md !py-2 w-fit flex gap-2 items-center mt-2`}
            />
            <Button
              handleClick={handleOfficeDownload}
              title=""
              type="button"
              icon={<FaDownload />}
              className={`text-white bg-secondary rounded-md !py-2 w-fit flex gap-2 items-center mt-2`}
            />

            <Button
              handleClick={handleOfficeInvoicePrint}
              title="Invoice Print"
              type="button"
              icon={<FaPrint />}
              className={`text-white bg-secondary rounded-md !py-2 w-fit flex gap-2 items-center mt-2`}
            />
            <Button
              handleClick={handleOfficeInvoiceDownload}
              title=""
              type="button"
              icon={<FaDownload />}
              className={`text-white bg-secondary rounded-md !py-2 w-fit flex gap-2 items-center mt-2`}
            />
          </div>
        </>
      )}

      {modalId === 2 && orderDetails && (
        <>
          <h3 className="mb-3 text-xl font-semibold">Customer Details</h3>
          <div className="p-4 mb-3 bg-gray-100 rounded-md">
            <div className="grid grid-cols-1 gap-x-3 gap-y-1 md:grid-cols-2">
              {/* <div>
                <span className="font-semibold text-gray-950">
                  Customer Name:
                </span>{' '}
                {orderDetails?.customer?.name}
              </div> */}
              <div>
                <span className="font-semibold text-gray-950">
                  Business Name:
                </span>{' '}
                {orderDetails?.customer?.business_name}
              </div>
              
              <div>
                <span className="font-semibold text-gray-950">Mobile:</span>{' '}
                {orderDetails?.customer?.mobile_number1}
              </div>
              <div>
              <span className="font-semibold text-gray-950">Address:</span>{' '}
              {[orderDetails?.customer?.address1, orderDetails?.customer?.address2, orderDetails?.customer?.address3]
                .filter(Boolean) // filters out undefined, null, or empty string
                .join(', ')}
            </div>
            </div>
          </div>
          <PaymentHistory
            orderDetails={orderDetails}
            CreteNewPayment={CreteNewPayment}
          />
        </>
      )}
    </Modal>
  );
};

export default Orders;
