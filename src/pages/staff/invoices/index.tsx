import './style.css';

import Button from '@components/Common/Button';
import Invoice from '@components/Common/Invoice';
import { notify } from '@components/Common/Toastify';
import { useApiJSON } from '@services/ApiService/Api.service';
import { generatePDF } from '@utils/staff/downloadPdf';
import { Modal, Pagination, Table } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaPrint } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa6';
import { useReactToPrint } from 'react-to-print';
import { invoiceById, invoices } from './api';

const Invoices: React.FC = () => {
  const { get } = useApiJSON();
  const contentRef = useRef<HTMLDivElement>(null);

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
  const [invoiceId, setInvoiceId] = useState<number | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<any>({});
  // const [downloadClicked, setDownloadClicked] = useState(false);
  // Configure react-to-print with a custom document title
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: invoiceDetails?.invoice_id
      ? `Invoice_${invoiceDetails.invoice_id}_${dayjs().format('YYYYMMDD')}`
      : 'Order_Invoice', // Fallback if invoiceDetails is not yet set
  });

  const columns = [
    {
      title: 'Sl No.',
      dataIndex: 'slNo',
      key: 'slNo',
    },
    {
      title: 'Invoice number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
    },
    
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'name',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    },
    {
      title: 'Order ID',
      dataIndex: 'OrderId',
      key: 'OrderId',
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
      render: (_: any, record: any) => {
        return (
          <div className="flex gap-2">
            <Button
              handleClick={() => showModal(invoicesList[record?.key]?.id)}
              title="View"
              type="button"
              className="text-white bg-gray-500 rounded-md !py-2 w-full"
            />
          </div>
        );
      },
    },
  ];

  const getInvoices = useCallback(async () => {
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
      notify('Failed to fetch data', 'error');
    }
  }, [get, pageNumber, pageSize]);

  // Memoized function to fetch invoice by ID
  const getInvoiceById = useCallback(async () => {
    if (invoiceId === null || invoiceId === undefined) return; // Skip if invoice id is null
    try {
      const { data } = await invoiceById(get, encodeURIComponent(invoiceId));
      setInvoiceDetails(data);
    } catch (error: any) {
      notify('Failed to fetch invoice details', 'error');
    }
  }, [get, invoiceId]);

  // Memoized function to show modal
  const showModal = useCallback((invId: number) => {
    setInvoiceId(invId); // Set invoiceId to trigger getInvoiceById
    setIsModalOpen(true);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  const tableDataSource = invoicesList?.map((invoice: any, i: number) => ({
    key: i,
    slNo: i + 1,
    OrderId: invoice?.orderID,
    customerName: invoice?.customer?.business_name,
    invoiceNumber: invoice?.invoice_id,
    totalAmount:invoice?.order_amount,
    // orderDate: dayjs(invoice?.order_date).format('DD-MM-YYYY'),
    deliveryDate: invoice?.delivery_date,
  }));

  useEffect(() => {
    getInvoices();
  }, [getInvoices]);

  useEffect(() => {
    getInvoiceById();
  }, [getInvoiceById]);

  return (
    <>
      <Helmet>
        <title>KICKOFF SPORTS WEAR - Invoices </title>
      </Helmet>
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
      <ModalDetails
        invoiceDetails={invoiceDetails}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setInvoiceId={setInvoiceId}
        contentRef={contentRef}
        reactToPrintFn={reactToPrintFn}
        // setDownloadClicked={setDownloadClicked}
      />
    </>
  );
};

const ModalDetails: React.FC<any> = ({
  invoiceDetails,
  isModalOpen,
  setIsModalOpen,
  setInvoiceId,
  contentRef,
  reactToPrintFn,
}) =>
{
  const [downloadClicked, setDownloadClicked] = useState(false);
  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setInvoiceId(null); // Reset invoiceId when closing modal
  }, [setIsModalOpen, setInvoiceId]);

  // Office Print: printForOffice = true
  const handleOfficePrint = useCallback(() => {
    reactToPrintFn(); // Trigger print
  }, [reactToPrintFn]);

  // Add this new function for download
  // const handleDownload = useCallback(async () =>
  // {
  //   setDownloadClicked(true);
  //   const fileName = invoiceDetails?.invoice_id
  //     ? `Invoice_${invoiceDetails.invoice_id}_${dayjs().format('YYYYMMDD')}.pdf`
  //     : 'Order_Invoice.pdf';
  //     // invoiceDetails.downloadForOfficeInvoice=true
  //   await generatePDF({
  //     contentRef,
  //     fileName,
  //   });
  //   // setDownloadClicked(false);
  // }, [contentRef, invoiceDetails,setDownloadClicked]);
  
  const handleDownload = () => {
    setDownloadClicked(true);             // triggers the effect above
  };
  useEffect(() => {
    if (!downloadClicked) return;

    (async () => {
      const fileName = invoiceDetails?.invoice_id
        ? `Invoice_${invoiceDetails.invoice_id}_${dayjs().format('YYYYMMDD')}.pdf`
        : 'Order_Invoice.pdf';

      await generatePDF({ contentRef, fileName });
      setDownloadClicked(false);          // hide signature again
    })();
  }, [downloadClicked, contentRef, invoiceDetails]);

console.log("setDownloadClicked",setDownloadClicked)
  return (
    <Modal
      open={isModalOpen}
      width={1000}
      centered
      onCancel={handleCancel}
      footer={null}
    >
      <div ref={contentRef}>
        <Invoice type={'INVOICE'} data={invoiceDetails} paid={true} downloadClicked={downloadClicked} />
      </div>
      <div className="flex justify-end gap-3">
        <Button
          handleClick={handleOfficePrint}
          title="Print"
          type="button"
          icon={<FaPrint />}
          className={`text-white bg-secondary rounded-md !py-2 w-fit flex gap-2 items-center mt-2`}
        />
        <Button
          handleClick={handleDownload}
          title="Download"
          type="button"
          icon={<FaDownload />}
          className={`text-white bg-secondary rounded-md !py-2 w-fit flex gap-2 items-center mt-2`}
        />
      </div>
    </Modal>
  );
};

export default Invoices;
