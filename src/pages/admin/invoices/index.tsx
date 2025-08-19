import './style.css';

import Button from '@components/Common/Button';
import Invoice from '@components/Common/Invoice';
import { notify } from '@components/Common/Toastify';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApiJSON } from '@services/ApiService/Api.service';
import { capitalizeFirstLetterOfEachWord } from '@utils/common/capitalizeFirstLetter';
import { generatePDF } from '@utils/staff/downloadPdf';
import { DatePicker, Modal, Pagination, Table,Select } from 'antd';
import locale from 'antd/es/date-picker/locale/en_US';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaPrint } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa6';
import { useReactToPrint } from 'react-to-print';

import { invoiceById, invoices, monthWiseInvoices } from './api';

const Invoices: React.FC = () => {
  const { get } = useApiJSON();
  const contentRef = useRef<HTMLDivElement>(null);

  const [invoicesList, setInvoicesList] = useState<any[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
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

  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs | null>(null);
  const currentDate = dayjs();
  const currentYear = currentDate.year();
  // If current month is Jan/Feb/Mar (i.e., before April), financial year started last year
  const financialYearStart =
    currentDate.month() < 3
      ? dayjs(`${currentYear - 1}-04-01`)
      : dayjs(`${currentYear}-04-01`);
  const currentMonth = dayjs();
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: invoiceDetails?.invoice_id
      ? `Invoice_${invoiceDetails.invoice_id}_${dayjs().format('YYYYMMDD')}`
      : 'Order_Invoice',
  });

  const columns = [
    {
      title: 'Sl No.',
      dataIndex: 'slNo',
      key: 'slNo',
    },
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Invoice Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
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
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 170,
      render: (_: any, record: any) => {
        const isGenerated = record.invoice_generated;
        return (
          <div className="flex justify-center">
            <FontAwesomeIcon
              icon={faFileInvoice}
              onClick={() => showModal(invoicesList[record?.key]?.id)}
              className={`cursor-pointer ${isGenerated ? 'text-green-600' : 'text-blue-800'} text-2xl`}
              title="View Invoice"
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

  const getInvoiceById = useCallback(async () => {
    if (invoiceId === null) return;
    try {
      const { data } = await invoiceById(get, encodeURIComponent(invoiceId));
      setInvoiceDetails(data);
    } catch (error: any) {
      notify('Failed to fetch invoice details', 'error');
    }
  }, [get, invoiceId]);

  const showModal = useCallback((invId: number) => {
    setInvoiceId(invId);
    setIsModalOpen(true);
  }, []);

  // const onShowSizeChange = useCallback((_current: number, size: number) => {
  //   setPageSize(size);
  //   setPageNumber(1);
  // }, []);

  // const handlePageChange = useCallback((page: number) => {
  //   setPageNumber(page);
  // }, []);
  const handleGoClick = async () => {
    if (!selectedMonth) {
      notify('❗ Please select a month before proceeding.', 'error');
      return;
    }

    const month = selectedMonth.month() + 1; // 0-indexed, so +1
    const year = selectedMonth.year();

    try {
      const { data } = await monthWiseInvoices(get, month, year);
      setInvoicesList(data.results);
      setPaginationData({
        count: data?.count ?? data?.length ?? 0,
        hasPreviousPage: false,
        hasNextPage: false,
        pageNumber: 1,
        pageSize: 20,
      });
      // setIsFiltered(true);
      setPageNumber(1);
    } catch (error) {
      notify('❌ Failed to fetch invoices', 'error');
      console.error('Error:', error);
    }
  };
  const tableDataSource = invoicesList?.map((invoice: any, i: number) => ({
    key: i,
    slNo: (pageNumber - 1) * pageSize + i + 1,
    OrderId: invoice?.orderID,
    invoice_generated: invoice?.invoice_generated,
    customerName: capitalizeFirstLetterOfEachWord(
      invoice?.customer?.business_name,
    ).toUpperCase(),
    invoiceNumber: invoice?.invoice_id,
    totalAmount: invoice?.order_amount,
    orderDate: dayjs(invoice?.order_date).format('DD-MM-YYYY'),
    invoiceDate: dayjs(invoice?.created_at).format('DD-MM-YYYY'),
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
            Invoices
          </h3>
        </div>
        <div className="p-3 bg-white md:p-5 custom-table">
          <div className="flex justify-end items-center gap-2 mb-4">
            <DatePicker
              picker="month"
              allowClear={false}
              value={selectedMonth}
              onChange={(date) => setSelectedMonth(date ?? dayjs())}
              disabledDate={(current) => {
                const now = dayjs();
                return (
                  current < financialYearStart.startOf('month') ||
                  current > currentMonth.endOf('month') ||
                  current.isSame(now, 'month') // ❌ disable current month
                );
              }}
              className="w-[200px]"
              format="YYYY-MM"
              locale={locale}
            />
            <Button
              title="Go"
              type="button"
              handleClick={handleGoClick}
              className="text-white bg-green-600 hover:bg-green-700 rounded-md !py-1 px-4 w-fit flex items-center"
            />
          </div>
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
        invoiceDetails={invoiceDetails}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setInvoiceId={setInvoiceId}
        contentRef={contentRef}
        reactToPrintFn={reactToPrintFn}
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
}) => {
  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setInvoiceId(null);
  }, [setIsModalOpen, setInvoiceId]);

  const handleOfficePrint = useCallback(() => {
    reactToPrintFn();
  }, [reactToPrintFn]);

  const handleDownload = useCallback(async () => {
    const fileName = invoiceDetails?.invoice_id
      ? `Invoice_${invoiceDetails.invoice_id}_${dayjs().format('YYYYMMDD')}.pdf`
      : 'Order_Invoice.pdf';

    await generatePDF({
      contentRef,
      fileName,
    });
  }, [contentRef, invoiceDetails]);

  return (
    <Modal
      open={isModalOpen}
      width={1000}
      centered
      onCancel={handleCancel}
      footer={null}
    >
      <div ref={contentRef}>
        <Invoice type="INVOICE" data={invoiceDetails} paid />
      </div>
      <div className="flex justify-end gap-3">
        <Button
          handleClick={handleOfficePrint}
          title="Print"
          type="button"
          icon={<FaPrint />}
          className="text-white bg-secondary rounded-md !py-2 w-fit flex gap-2 items-center mt-2"
        />
        <Button
          handleClick={handleDownload}
          title="Download"
          type="button"
          icon={<FaDownload />}
          className="text-white bg-secondary rounded-md !py-2 w-fit flex gap-2 items-center mt-2"
        />
      </div>
    </Modal>
  );
};

export default Invoices;
