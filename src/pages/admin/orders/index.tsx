import './style.css';

import Button from '@components/Common/Button';
import Invoice from '@components/Common/Invoice';
import { notify } from '@components/Common/Toastify';
import PaymentHistory from '@components/Staff/PaymentHistory';
import { faCreditCard, faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import Paths from '@routes/paths';
import { useApiJSON } from '@services/ApiService/Api.service';
import { capitalizeFirstLetterOfEachWord } from '@utils/common/capitalizeFirstLetter';
import { generatePDF } from '@utils/staff/downloadPdf';
import { paidAmount } from '@utils/staff/paidAmount';
import { Modal, Pagination, Table,Select } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaPrint } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa6';
import { useSearchParams } from 'react-router';
import { useReactToPrint } from 'react-to-print';

import { fetchDeliveryOrders } from '../dashboard/api';
import { orderById, orders, payment } from './api';

const Orders: React.FC = () => {
  const { get, post } = useApiJSON();
  const [searchParams] = useSearchParams();
  const [dateType, setDateType] = useState<
    'today' | 'tomorrow' | null | undefined
  >(undefined);
  const [ordersList, setOrdersList] = useState<any>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
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
      title: 'Invoice ID',
      dataIndex: 'invoice_id', // Make sure this matches your key in dataSource
      key: 'invoice_id',
      render: (text: string) => <span className="font-bold">{text}</span>,
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
      align: 'right' as const, // ✅ FIXED: Add comma here
      render: (value: any) => parseFloat(value).toFixed(2),
    },
    {
      title: 'Invoice Status',
      dataIndex: 'order_invoice',
      key: 'order_invoice',
      render: (value: string) => {
        let bgColor = '#d32f2f'; // Red (default: Awaiting Invoice)

        if (value === 'PAID') {
          bgColor = '#2e7d32'; // Blue
        } else if (value === 'GENERATED') {
          bgColor = '#1976d2'; // Green
        }

        return (
          <span
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '12px',
              color: '#fff',
              backgroundColor: bgColor,
            }}
          >
            {value || 'Awaiting Invoice'}
          </span>
        );
      },
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
          <div className="flex items-center justify-center space-x-4 text-[20px]">
            <FontAwesomeIcon
              icon={faFileInvoice}
              onClick={() => showModal(ordersList[record?.key]?.id, 1)}
              title="View"
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
            />
            <FontAwesomeIcon
              icon={faCreditCard}
              onClick={() => showModal(ordersList[record?.key]?.id, 2)}
              className={`cursor-pointer ${
                currentBalance <= 0
                  ? 'text-gray-400 hover:text-gray-500'
                  : 'text-green-600 hover:text-green-800'
              }`}
              title={
                currentBalance <= 0
                  ? 'View Payment Details (Paid)'
                  : 'Add Payment'
              }
            />
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

  // const handlePageChange = useCallback((page: number) => {
  //   setPageNumber(page);
  // }, []);

  const tableDataSource = ordersList?.map((order: any, i: number) => ({
    key: i,
    slNo: (pageNumber - 1) * pageSize + i + 1,
    OrderId: order?.orderID,
    invoice_id: order?.invoice_id,
    customerName: capitalizeFirstLetterOfEachWord(
      order?.customer?.business_name,
    ),
    orderDate: dayjs(order?.order_date).format('DD-MM-YYYY - h:mm A'),
    deliveryDate: dayjs(order?.delivery_date).format('DD-MM-YYYY'),
    payment_details: order?.payment_details, // Pass payment_details to the record
    total_cost: order?.total_cost, // Pass total_cost to the record
    order_invoice: order?.order_invoice,
  }));
  console.log('🧾 Table Data:', tableDataSource);
  // const onShowSizeChange = useCallback((current: number, pageSize: number) => {
  //   setPageSize(pageSize);
  //   setPageNumber(current);
  // }, []);

  useEffect(() => {
    getOrderById();
  }, [getOrderById]);
  // 1️⃣ Sync date from URL
  // Sync from URL
  useEffect(() => {
    const urlDate = searchParams.get('date');
    if (urlDate === 'today' || urlDate === 'tomorrow') {
      setDateType(urlDate);
    } else {
      setDateType(null);
    }
  }, [searchParams]);

  // Fetch based on dateType
  useEffect(() => {
    if (dateType === undefined) return; //

    if (dateType === 'today' || dateType === 'tomorrow') {
      fetchOrdersByDate(dateType);
    } else {
      fetchPaginatedOrders(pageNumber, pageSize);
    }
  }, [dateType, pageNumber, pageSize]);

  // 3️⃣ Fetch orders for today/tomorrow
  const fetchOrdersByDate = async (date: 'today' | 'tomorrow') => {
    try {
      const response = await fetchDeliveryOrders(get, date);
      const data = response.data as { date: string; orders: any[] };

      setOrdersList(data.orders);
      setPaginationData({
        count: data.orders.length,
        hasPreviousPage: false,
        hasNextPage: false,
        pageNumber: 1,
        pageSize: data.orders.length,
      });
    } catch (error) {
      console.error('Error fetching orders by date', error);
    }
  };

  // 4️⃣ Fetch all orders paginated
  const fetchPaginatedOrders = async (page: number, size: number) => {
    try {
      const response = await orders(get, page, size);
      setOrdersList(response.data.results || []);
      setPaginationData({
        count: response.data.count,
        hasPreviousPage: response.data.previous !== null,
        hasNextPage: response.data.next !== null,
        pageNumber: page,
        pageSize: size,
      });
    } catch (error) {
      console.error('Error fetching paginated orders', error);
    }
  };
  console.log('📦 ordersList:', ordersList);

  return (
    <>
      <Helmet>
        <title>KICKOFF SPORTS WEAR - Orders </title>
      </Helmet>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b-2">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#191D23]">
              Orders
            </h3>
          </div>
         
        </div>
        <div className="p-3 bg-white md:p-5 custom-table">
           {/* <div className="flex justify-end mb-4">
          <Link
            to={Paths.Staff.orders.new}
            className="px-[25px] py-3 transition-all text-white bg-[#D92D20] hover:bg-[#B42318] rounded-md invisible xl:visible"
          >
            New
          </Link>
           </div> */}
          <Table
            bordered
            dataSource={tableDataSource}
            columns={columns}
            pagination={false}
            scroll={{ x: '700' }}
          />
           {/* Custom Pagination + PageSize */}
          <div className="mt-4 w-full flex items-center justify-end gap-2">
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

            <Pagination
              current={pageNumber}
              pageSize={pageSize}
              total={paginationData.count}
              onChange={(page) => setPageNumber(page)}
              showSizeChanger={false} // we hide default changer
            />
          </div>
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
              <div>
                <span className="font-semibold text-gray-950">
                  Customer Name:
                </span>{' '}
                {orderDetails?.customer?.name}
              </div>
              <div>
                <span className="font-semibold text-gray-950">
                  Business Name:
                </span>{' '}
                {orderDetails?.customer?.business_name}
              </div>
              <div>
                <span className="font-semibold text-gray-950">Address:</span>{' '}
                {orderDetails?.customer?.address1}{' '}
                {orderDetails?.customer?.address2}
              </div>
              <div>
                <span className="font-semibold text-gray-950">Mobile:</span>{' '}
                {orderDetails?.customer?.mobile_number1}
              </div>
            </div>
          </div>
          <PaymentHistory
            orderDetails={orderDetails}
            CreteNewPayment={CreteNewPayment}
            role={import.meta.env.VITE_ADMIN_ROLE}
          />
        </>
      )}
    </Modal>
  );
};

export default Orders;
