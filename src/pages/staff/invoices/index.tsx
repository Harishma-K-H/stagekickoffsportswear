import './style.css';

import Button from '@components/Common/Button';
import Invoice from '@components/Common/Invoice';
import { notify } from '@components/Common/Toastify';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API_CONFIG } from '@services/ApiService/Api.config';
import { useApiJSON } from '@services/ApiService/Api.service';
import { capitalizeFirstLetterOfEachWord } from '@utils/common/capitalizeFirstLetter';
import { generatePDF } from '@utils/staff/downloadPdf';
import { DatePicker, Modal, Pagination, Table } from 'antd';
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
  console.log('✅ LIVE BASE URL:', API_CONFIG.baseURL);

  const contentRef = useRef<HTMLDivElement>(null);
  // const batchContentRef = useRef<HTMLDivElement>(null);

  const currentDate = dayjs();
  const currentYear = currentDate.year();
  // If current month is Jan/Feb/Mar (i.e., before April), financial year started last year
  const financialYearStart =
    currentDate.month() < 3
      ? dayjs(`${currentYear - 1}-04-01`)
      : dayjs(`${currentYear}-04-01`);
  const currentMonth = dayjs(); // today

  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs | null>(null);

  // const [isFiltered, setIsFiltered] = useState(false);
  const [invoicesList, setInvoicesList] = useState<any[]>([]);
  // const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [paginationData, setPaginationData] = useState({
    count: 0,
    hasPreviousPage: false,
    hasNextPage: false,
    pageNumber: 1,
    pageSize: 25,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoiceId, setInvoiceId] = useState<number | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<any>({});
  // const [batchInvoices, setBatchInvoices] = useState<any[]>([]);

  // const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Print single invoice
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: invoiceDetails?.invoice_id
      ? `Invoice_${invoiceDetails.invoice_id}_${dayjs().format('YYYYMMDD')}`
      : 'Order_Invoice', // Fallback if invoiceDetails is not yet set
  });

  // Print batch invoices
  // const batchPrintFn = useReactToPrint({
  //   content: () => batchContentRef.current,
  //   documentTitle: `Invoices_${dayjs().format('YYYYMMDD_HHmmss')}`,
  //   removeAfterPrint: true,
  // } as Parameters<typeof useReactToPrint>[0]);

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
              className={`cursor-pointer text-white text-lg p-2 rounded-md ${
                isGenerated ? 'bg-green-600' : 'bg-blue-800'
              }`}
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
    if (invoiceId === null || invoiceId === undefined) return;
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

  const handlePageChange = useCallback(
    (page: number) => {
      setPageNumber(page);
      // if (!isFiltered) {
      //   getInvoices();
      // }
    },
    [getInvoices],
  );

  const onShowSizeChange = useCallback(
    (_current: number, size: number) => {
      setPageSize(size);
      setPageNumber(1);
      // if (!isFiltered) {
      //   getInvoices();
      // }
    },
    [getInvoices],
  );

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
  // const rowSelection = {
  // selectedRowKeys,
  // onChange: async (selectedKeys: React.Key[]) => {
  //   setSelectedRowKeys(selectedKeys);

  //   // Fetch the selected invoice data (based on IDs)
  //   const selectedData =  invoicesList.filter((_, i: number) =>
  //     selectedKeys.includes(i)
  //   );

  //   setBatchInvoices(selectedData);
  // },
  // };
  // console.log('Selected Invoice IDs:', selectedRowKeys);

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

  useEffect(() => {
    getInvoices();
  }, [getInvoices]);

  useEffect(() => {
    getInvoiceById();
  }, [getInvoiceById]);

  // Prepare batch invoices content for printing (hidden)
  // const batchPrintContent = (
  //   <div ref={batchContentRef} style={{ display: 'none' }}>
  //     {invoicesList
  //       .filter((_, idx) => selectedRowKeys.includes(idx))
  //       .map((invoice, idx) => (
  //         <Invoice key={invoice.invoice_id ?? idx} data={invoice} type="INVOICE" paid />
  //       ))}
  //   </div>
  // );
  // console.log('Selected Invoice IDs:', selectedRowKeys);

  return (
    <>
      <Helmet>
        <title>KICKOFF SPORTS WEAR - Invoices</title>
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
              className="text-white bg-green-600 hover:bg-green-700 rounded-md !py-2 px-4 w-fit flex items-center"
            />
          </div>
          {/* {isFiltered && (
            <div className="flex justify-end mb-4">
              <Button
                type="button"
                handleClick={batchPrintFn}
                disabled={selectedRowKeys.length === 0}
                className="text-white bg-blue-600 hover:bg-blue-700 rounded !py-2 px-4 flex items-center"
                icon={<FaPrint className="mr-2" />}
                title="Print Selected"
              />
            </div>
          )} */}

          <Table
            bordered
            // rowSelection={isFiltered ? rowSelection : undefined}
            dataSource={tableDataSource}
            columns={columns}
            pagination={false}
            scroll={{ x: 700 }}
          />

          <Pagination
            current={pageNumber}
            total={paginationData.count}
            pageSize={pageSize}
            showSizeChanger
            pageSizeOptions={['25', '50', '100', '150', '200']}
            onShowSizeChange={onShowSizeChange}
            onChange={handlePageChange}
            rootClassName="w-fit mx-auto lg:ml-auto lg:mr-0 mt-5 lg:mt-1"
          />
        </div>
      </div>

      {/* Hidden batch print content */}
      {/* {batchPrintContent} */}

      <ModalDetails
        invoiceDetails={invoiceDetails}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setInvoiceId={setInvoiceId}
        contentRef={contentRef}
        reactToPrintFn={reactToPrintFn}
      />
      {/* 🔽 Batch invoices section, hidden off-screen
<div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
  <div ref={batchContentRef}>
    {batchInvoices.map((inv, idx) => (
      <div key={inv.id ?? idx} style={{ marginBottom: '30px', pageBreakAfter: 'always' }}>
        <Invoice
          type="INVOICE"
          data={inv}
          paid={true}
          printClicked={true}
          downloadClicked={false}
        />
      </div>
    ))}
  </div>
</div> */}
    </>
  );
};

type ModalDetailsProps = {
  invoiceDetails: any;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setInvoiceId: React.Dispatch<React.SetStateAction<number | null>>;
  contentRef: React.RefObject<HTMLDivElement>;
  reactToPrintFn: () => void;
};

const ModalDetails: React.FC<ModalDetailsProps> = ({
  invoiceDetails,
  isModalOpen,
  setIsModalOpen,
  setInvoiceId,
  contentRef,
  reactToPrintFn,
}) => {
  const [downloadClicked, setDownloadClicked] = useState(false);
  const [printClicked, setPrintClicked] = useState(false);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setInvoiceId(null);
  }, [setIsModalOpen, setInvoiceId]);

  const handleOfficePrint = useCallback(() => {
    setPrintClicked(true);
    setTimeout(() => {
      reactToPrintFn();
      setPrintClicked(false);
    }, 100);
  }, [reactToPrintFn]);

  const handleDownload = () => {
    setDownloadClicked(true);
  };

  useEffect(() => {
    if (!downloadClicked) return;

    (async () => {
      const fileName = invoiceDetails?.invoice_id
        ? `Invoice_${invoiceDetails.invoice_id}_${dayjs().format('YYYYMMDD')}.pdf`
        : 'Order_Invoice.pdf';

      await generatePDF({ contentRef, fileName });
      setDownloadClicked(false);
    })();
  }, [downloadClicked, contentRef, invoiceDetails]);

  return (
    <Modal
      open={isModalOpen}
      width={1000}
      centered
      onCancel={handleCancel}
      footer={null}
    >
      <div ref={contentRef}>
        <Invoice
          type="INVOICE"
          data={invoiceDetails}
          paid
          downloadClicked={downloadClicked}
          printClicked={printClicked}
        />
      </div>
      <div className="flex justify-end gap-3 mt-2">
        <Button
          handleClick={handleOfficePrint}
          title="Print"
          type="button"
          icon={<FaPrint />}
          className="text-white bg-secondary rounded-md !py-2 w-fit flex gap-2 items-center"
        />
        <Button
          handleClick={handleDownload}
          title="Download"
          type="button"
          icon={<FaDownload />}
          className="text-white bg-secondary rounded-md !py-2 w-fit flex gap-2 items-center"
        />
      </div>
    </Modal>
  );
};

export default Invoices;
