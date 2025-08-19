import Invoice from '@components/Common/Invoice';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useApiJSON } from '@services/ApiService/Api.service';
import { message, Modal, Pagination, Select, Table } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';

import { getBranchList, invoiceById, InvoiceReportsGet } from './api';

interface InvoiceItem {
  item_id: number;
  name: string;
  model: string;
  item_cost: number;
  size: string;
  HSN: string;
  discount: number;
  total_item_cost: string;
  qty: number;
  sleeve_case: boolean;
  material: string;
  print_type: string;
  unit_cost: string | null;
}

interface Invoice {
  id: number;
  invoice_id: string;
  total_cost: string;
  created_at: string;
  customer_name?: string;
  items: InvoiceItem[];
  total_paid_amount: string; // ✅ add this
  balance_amount: number; // ✅ add this
}

const InvoiceReportsPage: React.FC = () => {
  const { get } = useApiJSON();

  const [data, setData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoiceDetails, setInvoiceDetails] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoiceId, setInvoiceId] = useState<number | null>(null);

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [paginationData, setPaginationData] = useState({
    count: 0,
    hasPreviousPage: false,
    hasNextPage: false,
    pageNumber: 1,
    pageSize: 25,
  });
  const [, setTotalCount] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);

  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number | undefined>();
  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await InvoiceReportsGet(
        get,
        pageNumber,
        pageSize,
        selectedBranch,
      );
      if (response.ok) {
        setData(response.data.results || []);
        setPaginationData({
          count: response.data.count,
          hasPreviousPage: response.data.hasPreviousPage,
          hasNextPage: response.data.hasNextPage,
          pageNumber: response.data.pageNumber,
          pageSize: response.data.pageSize,
        });
        setTotalCount(response.data.count);
      } else {
        message.error('Failed to fetch invoice reports');
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch invoice reports');
    } finally {
      setLoading(false);
    }
  };
  // const onShowSizeChange = useCallback((_current: number, size: number) => {
  //   setPageSize(size);
  //   setPageNumber(1);
  // }, []);
  // const handlePageChange = useCallback((page: number) => {
  //   setPageNumber(page);
  // }, []);
  useEffect(() => {
    const fetchBranches = async () => {
      const res = await getBranchList(get);
      if (res.ok) {
        setBranches(res.data);

        // If only one branch and user is admin, select it
        if (res.data.length === 1) {
          setSelectedBranch(res.data[0].id);
        }

        // Optional: if current user has a preferred branch, pre-select it
        // setSelectedBranch(user?.branch?.id);
      } else {
        message.error('Failed to load branches');
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    loadReports();
  }, [pageNumber, pageSize, selectedBranch]);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoiceId) return;
      const res = await invoiceById(get, invoiceId);
      if (res.ok) {
        setInvoiceDetails(res.data);
        setIsModalOpen(true);
      } else {
        message.error('Failed to load invoice');
      }
    };
    fetchInvoice();
  }, [invoiceId, get]);

  // const reactToPrintFn = () => {
  //   if (contentRef.current) {
  //     const printWindow = window.open('', '_blank');
  //     if (printWindow) {
  //       printWindow.document.write(contentRef.current.innerHTML);
  //       printWindow.document.close();
  //       printWindow.print();
  //     }
  //   }
  // };

  const columns = [
    {
      title: 'Sl No.',
      dataIndex: 'slNo',
      key: 'slNo',
      render: (_: any, __: any, index: number) =>
        (pageNumber - 1) * pageSize + index + 1,
    },
    {
      title: 'Invoice ID',
      dataIndex: 'invoice_id',
      key: 'invoice_id',
      render: (_: any, record: Invoice) => <strong>{record.invoice_id}</strong>,
    },
    { title: 'Customer', dataIndex: 'customer_name', key: 'customer_name' },
    {
      title: 'Total Cost',
      dataIndex: 'total_cost',
      key: 'total_cost',
      render: (value: any) => Number(value).toFixed(2),
    },
    {
      title: 'Paid Amount',
      dataIndex: 'total_paid_amount',
      key: 'total_paid_amount',
      render: (value: any) => Number(value).toFixed(2),
    },
    {
      title: 'Balance Amount',
      dataIndex: 'balance_amount',
      key: 'balance_amount',
      render: (value: any) => Number(value).toFixed(2),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <FontAwesomeIcon
          icon={faFileInvoice}
          className={`cursor-pointer text-blue-800 text-2xl`}
          title="View Invoice"
          onClick={() => setInvoiceId(record.id)}
        />
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>KICKOFF SPORTS WEAR - Invoice Reports</title>
      </Helmet>

      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b-2">
          <h3 className="text-2xl md:text-3xl font-bold text-[#191D23]">
            Pending Invoices
          </h3>
        </div>

        {/* Content Section */}
        <div className="p-3 bg-white md:p-5 custom-table">
          {/* Select Filter */}
          <div className="mb-6 flex items-center gap-2">
            <Select
              allowClear
              showSearch
              placeholder="Select Branch"
              className="w-[600px] h-9 rounded-full border border-gray-300 shadow-sm placeholder:text-gray-400"
              value={selectedBranch}
              onChange={(val) => {
                setSelectedBranch(val);
                setPageNumber(1); // reset pagination
              }}
              options={branches.map((b) => ({
                label: b.name,
                value: b.id,
              }))}
            />
          </div>

          {/* Invoice Table */}
          <Table
            bordered
            dataSource={data}
            rowKey="id"
            loading={loading}
            columns={columns}
            pagination={false}
          />
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
                    {paginationData.count > 0 && (
                      <Pagination
                        current={pageNumber}
                        pageSize={pageSize}
                        total={paginationData.count}
                        onChange={(page) => setPageNumber(page)}
                        showSizeChanger={false} // we hide default changer
              />
              )}
                    </div>

          {/* Pagination */}
          {/* {paginationData.count > 0 && (
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
          )} */}

          {/* Invoice Modal */}
          <ModalDetails
            invoiceDetails={invoiceDetails}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            setInvoiceId={setInvoiceId}
            contentRef={contentRef}
          />
        </div>
      </div>
    </>
  );
};
type ModalDetailsProps = {
  invoiceDetails: Invoice | null;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setInvoiceId: React.Dispatch<React.SetStateAction<number | null>>;
  contentRef: React.RefObject<HTMLDivElement>;
  // reactToPrintFn: () => void;
};

const ModalDetails: React.FC<ModalDetailsProps> = ({
  invoiceDetails,
  isModalOpen,
  setIsModalOpen,
  setInvoiceId,
  contentRef,
  // reactToPrintFn,
}) => {
  const [downloadClicked, setDownloadClicked] = useState(false);
  // const [printClicked, setPrintClicked] = useState(false);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
    setInvoiceId(null);
  }, [setIsModalOpen, setInvoiceId]);

  // const handlePrint = useCallback(() => {
  //   setPrintClicked(true);
  //   setTimeout(() => {
  //     reactToPrintFn();
  //     setPrintClicked(false);
  //   }, 100);
  // }, [reactToPrintFn]);

  // const handleDownload = () => setDownloadClicked(true);

  useEffect(() => {
    if (!downloadClicked || !invoiceDetails) return;

    (async () => {
      setDownloadClicked(false);
    })();
  }, [downloadClicked, contentRef, invoiceDetails]);

  if (!invoiceDetails) return null;

  return (
    <Modal
      open={isModalOpen}
      width={1000}
      centered
      onCancel={handleCancel}
      footer={null}
    >
      {/* Hidden printable content */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div ref={contentRef}>
          <Invoice
            type="INVOICE"
            data={invoiceDetails}
            paid
            downloadClicked={downloadClicked}
          />
        </div>
      </div>

      {/* Visible preview */}
      <Invoice
        type="INVOICE"
        data={invoiceDetails}
        paid
        downloadClicked={downloadClicked}
      />

      <div className="flex justify-end gap-3 mt-4">
        {/* <Button
          handleClick={handlePrint}
          title="Print"
          icon={<FaPrint />}
          className="bg-secondary text-white"
        />
        <Button
          handleClick={handleDownload}
          title="Download"
          icon={<FaDownload />}
          className="bg-secondary text-white"
        /> */}
      </div>
    </Modal>
  );
};

export default InvoiceReportsPage;
