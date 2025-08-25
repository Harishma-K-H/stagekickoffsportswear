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
import { DatePicker, Modal, Pagination, Table,Select} from 'antd';
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

  // const handlePageChange = useCallback(
  //   (page: number) => {
  //     setPageNumber(page);
  //     // if (!isFiltered) {
  //     //   getInvoices();
  //     // }
  //   },
  //   [getInvoices],
  // );

  // const onShowSizeChange = useCallback(
  //   (_current: number, size: number) => {
  //     setPageSize(size);
  //     setPageNumber(1);
  //     // if (!isFiltered) {
  //     //   getInvoices();
  //     // }
  //   },
  //   [getInvoices],
  // );

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
              className="w-[200px] px-[15px] py-3 rounded-md"
              format="YYYY-MM"
              locale={locale}
            />
            
          {/* <Link
            to={Paths.Staff.orders.new}
            className="px-[25px] py-3 transition-all text-white bg-[#D92D20] hover:bg-[#B42318] rounded-md invisible xl:visible"
          >
            New
          </Link> */}
            <Button
              title="Go"
              type="button"
              handleClick={handleGoClick}
              className="px-[15px] py-3 text-white bg-green-600 hover:bg-green-700 rounded-md invisible xl:visible"
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
          {/* Custom Pagination + PageSize */}
                              <div className="mt-4 w-full flex items-center justify-end gap-2">
                                
                                <Pagination
                                  current={pageNumber}
                                  pageSize={pageSize}
                                  total={paginationData.count}
                                  onChange={(page) => setPageNumber(page)}
                                  showSizeChanger={false} // we hide default changer
            />
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
                    
                              </div>

          {/* <Pagination
            current={pageNumber}
            total={paginationData.count}
            pageSize={pageSize}
            showSizeChanger
            pageSizeOptions={['25', '50', '100', '150', '200']}
            onShowSizeChange={onShowSizeChange}
            onChange={handlePageChange}
            rootClassName="w-fit mx-auto lg:ml-auto lg:mr-0 mt-5 lg:mt-1"
          /> */}
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
  title={null}
  closable={false}
      // className="[&_.ant-modal-body]:p-0 [&_.ant-modal-content]:p-0"
  className="[&_.ant-modal-body]:p-0 [&_.ant-modal-content]:p-0 dark-mode-modal"
>
  {/* Custom Header */}
  <div className="w-full flex justify-end items-center bg-gray-200 px-3 py-2">
  <div className="flex gap-2">
    <div
      className="flex items-center gap-2 bg-gray-900 text-white rounded-md py-2 px-3 shadow cursor-pointer"
      onClick={handleOfficePrint}
    >
      <FaPrint />
      <span>Invoice Print</span>
    </div>
    <div
      className="flex items-center gap-2 bg-gray-900 text-white rounded-md py-2 px-3 shadow cursor-pointer"
      onClick={handleDownload}
    >
      <FaDownload />
      <span>Download</span>
    </div>
  </div>
</div>
  {/* Invoice Body */}
  <div ref={contentRef} className="mt-3 pb-6 px-4">
    <Invoice
      type="INVOICE"
      data={invoiceDetails}
      paid
      downloadClicked={downloadClicked}
      printClicked={printClicked}
    />
  </div>
</Modal>
);

};

export default Invoices;
