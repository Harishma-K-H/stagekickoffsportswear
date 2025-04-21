import './style.css';

import { numberToWords } from '@utils/common/numberToWords';
import { paidAmount } from '@utils/staff/paidAmount';
import dayjs from 'dayjs';
import React from 'react';

const Invoice: React.FC<{
  type: 'ORDER' | 'INVOICE';
  data: any;
  printForOffice?: boolean;
  downloadForOffice?: boolean;
  printForOfficeInvoice?: boolean;
}> = ({
  type = 'ORDER',
  data,
  printForOffice = false,
  downloadForOffice = false,
  printForOfficeInvoice = false,
}) => {
  const {
    invoice_id,
    orderID,
    order_date,
    delivery_date,
    net_cost,
    gst,
    total_cost,
    customer,
    items,
    payment_details,
    created_by,
  } = data;

  const totalPaid = paidAmount(payment_details);
  const currentBalance = parseInt(total_cost) - totalPaid;

  return (
    <div
      id="invoice-print"
      className="p-1 bg-white rounded-lg dark:bg-gray-800 
          print:p-0 
          print:m-0 
          print:w-[210mm] 
          print:min-h-[297mm] 
          print:[&:not(:first-child)]:mt-[297mm]
          print:relative
          [@page{margin:15mm_15mm_15mm_15mm}]"
    >
      {/* Header */}
      <div className="grid items-center grid-cols-1 gap-4 pb-3 mb-4 border-b-2 md:grid-cols-3 print:grid-cols-3">
        <img src="/logo.png" alt="Company Logo" className="max-w-[200px]" />
        <h5 className="mb-2 text-xl font-extrabold text-center">
          {printForOfficeInvoice
            ? 'INVOICE'
            : type == 'INVOICE'
              ? `TAX INVOICE`
              : `ORDER`}
        </h5>
        <div className="text-right">
          <h5 className="text-lg font-extrabold leading-5 ">
            KICKOFF SPORTS WEAR
            <br />
            <span className="text-sm font-semibold uppercase">
              {created_by?.branch}
            </span>
          </h5>
          <p className="text-xs">
            {created_by?.address} <br />
            {created_by?.district}, {created_by?.state}, {created_by?.pincode}{' '}
            <br />
            GSTN: {created_by?.GSTN} <br />
            Phone: {created_by?.phn_no} <br />
            Email: {created_by?.email}
          </p>
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-5 gap-8 mb-6">
        <div className="col-span-3 space-y-1">
          <h2 className="text-lg font-semibold dark:text-white">Bill To:</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {customer?.business_name} <br />
            {customer?.name} <br />
            {customer?.address1}, {customer?.address2} <br />
            {customer?.mobile_number1}
            <br />
            {customer?.gst_no && `GSTNO: ${customer?.gst_no}`}
          </p>
        </div>
        <div className="col-span-2 space-y-1 text-right">
          <TableView
            rowData={[
              {
                heading: `${type} ID`,
                value: `${type == 'INVOICE' ? `#${invoice_id}` : orderID}`,
                visibility: true,
                rowClassName: 'px-3',
                valueColumnClassName: '!text-left',
              },
              {
                heading: `${type} Date`,
                value: `${dayjs(order_date).format('DD-MM-YYYY')}`,
                visibility: true,
                rowClassName: 'px-3',
                valueColumnClassName: '!text-left',
              },
              {
                heading: 'Delivery Date',
                value: `${delivery_date}`,
                visibility: true,
                rowClassName: 'px-3',
                valueColumnClassName: '!text-left',
              },
            ]}
          />
          {/* <table className="w-full mb-2 border-[1px]">
              <tbody>
                <tr className="border-b">
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-300">
                    {type} ID:
                  </td>
                  <td className="px-3 py-2 font-medium text-left border-l dark:text-white">
                    {type == 'INVOICE' ? `#${invoice_id}` : orderID}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-300">
                    {type} Date:
                  </td>
                  <td className="px-3 py-2 font-medium text-left border-l dark:text-white">
                    {dayjs(order_date).format('DD-MM-YYYY')}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-300">
                    Delivery Date:
                  </td>
                  <td className="px-3 py-2 font-medium text-left border-l dark:text-white">
                    {delivery_date}
                  </td>
                </tr>
              </tbody>
            </table> */}
        </div>
      </div>

      {/* Order Items Table */}
      <div className="mb-8">
        <div className="">
          <table className="w-full border-[1px] border-gray-300">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-4 py-2 text-[13px] text-left dark:text-white">
                  #
                </th>
                <th className="px-4 py-2 text-[13px] text-left dark:text-white">
                  Model
                </th>
                <th className="px-4 py-2 text-[13px] text-left dark:text-white">
                  Material
                </th>
                <th className="px-4 py-2 text-[13px] text-left dark:text-white">
                  Print Type
                </th>
                <th className="px-4 py-2 text-[13px] text-left dark:text-white">
                  Sleeve Case
                </th>
                <th className="px-4 py-2 text-[13px] text-left dark:text-white">
                  Size
                </th>
                <th
                  className={`px-4 py-2 text-[13px] text-left dark:text-white ${printForOffice && 'print:hidden'} ${downloadForOffice && 'hidden'}`}
                >
                  Unit Cost
                </th>
                <th className="px-4 py-2 text-[13px] text-left dark:text-white">
                  Qty
                </th>
                <th
                  className={`px-4 py-2 text-[13px] text-left dark:text-white ${printForOffice && 'print:hidden'} ${downloadForOffice && 'hidden'}`}
                >
                  Item Cost
                </th>
              </tr>
            </thead>
            <tbody>
              {items?.map((item: any, index: number) => (
                <tr
                  key={index}
                  className="uppercase border-b dark:border-gray-700 text-[12.5px]"
                >
                  <td className="px-4 py-2 dark:text-white">{index + 1}</td>
                  <td className="px-4 py-2 dark:text-white">{item.model}</td>
                  <td className="px-4 py-2 dark:text-white">{item.material}</td>
                  <td className="px-4 py-2 dark:text-white">
                    {item.print_type}
                  </td>
                  <td className="px-4 py-2 dark:text-white">
                    {item.sleeve_case}
                  </td>
                  <td className="px-4 py-2 dark:text-white">{item.size}</td>
                  <td
                    className={`px-4 py-2 dark:text-white ${printForOffice && 'print:hidden'} ${downloadForOffice && 'hidden'}`}
                  >
                    {item.unit_cost}
                  </td>
                  <td className="px-4 py-2 dark:text-white">{item.qty}</td>
                  <td
                    className={`px-4 py-2 dark:text-white ${printForOffice && 'print:hidden'} ${downloadForOffice && 'hidden'}`}
                  >
                    {item.total_item_cost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total Calculations */}
      <div
        className={`grid grid-cols-5 justify-between gap-5 ${printForOffice && 'print:hidden'} ${downloadForOffice && 'hidden'}`}
      >
        <div className="col-span-3">
          Total In Words <br />
          <strong className="text-lg">
            {numberToWords(parseInt(total_cost))}
          </strong>
          <h3 className="mt-4 text-sm font-semibold text-gray-600 whitespace-pre-wrap dark:text-gray-300">
            {created_by?.account_details}
          </h3>
        </div>
        <div className="w-full col-span-2">
          <div className="space-y-2">
            <TableView
              rowData={[
                { heading: 'Subtotal', value: net_cost, visibility: true },
                {
                  heading: 'CGST2.5 (2.5%)',
                  value: (parseInt(gst) / 2).toFixed(2),
                  visibility: true,
                },
                {
                  heading: 'SGST2.5 (2.5%)',
                  value: (parseInt(gst) / 2).toFixed(2),
                  visibility: true,
                },
                {
                  heading: 'Paid Amount',
                  value: totalPaid?.toFixed(2),
                  visibility: type === 'ORDER',
                },
                {
                  heading: 'Balance Amount',
                  value: currentBalance?.toFixed(2),
                  visibility: type === 'ORDER',
                },
                {
                  heading: 'Total',
                  value: parseInt(total_cost).toFixed(2),
                  visibility: true,
                  rowClassName: '!text-black !text-[15px] !font-semibold',
                },
                printForOfficeInvoice && {
                  heading: 'Balance Due',
                  value: currentBalance?.toFixed(2),
                  visibility: true,
                  rowClassName: '!text-red-500 !text-[15px] !font-semibold',
                },
              ]}
            />
            {/* <table className="w-full mb-2 border-[1px]">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 pl-2 text-gray-600 dark:text-gray-300">
                      Subtotal:
                    </td>
                    <td className="py-2 pr-2 font-medium text-right border-l dark:text-white">
                      {parseInt(net_cost)?.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pl-2 text-gray-600 dark:text-gray-300">
                      CGST2.5 (2.5%):
                    </td>
                    <td className="py-2 pr-2 font-medium text-right border-l dark:text-white">
                      {(parseInt(gst) / 2).toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pl-2 text-gray-600 dark:text-gray-300">
                      SGST2.5 (2.5%):
                    </td>
                    <td className="py-2 pr-2 font-medium text-right border-l dark:text-white">
                      {(parseInt(gst) / 2)?.toFixed(2)}
                    </td>
                  </tr>
                  <tr className={`border-b ${type === 'INVOICE' && 'hidden'}`}>
                    <td className="py-2 pl-2 text-gray-600 dark:text-gray-300">
                      Paid Amount:
                    </td>
                    <td className="py-2 pr-2 font-medium text-right border-l dark:text-white">
                      {totalPaid?.toFixed(2)}
                    </td>
                  </tr>
                  <tr className={`border-b ${type === 'INVOICE' && 'hidden'}`}>
                    <td className="py-2 pl-2 text-gray-600 dark:text-gray-300">
                      Balance Amount:
                    </td>
                    <td className="py-2 pr-2 font-medium text-right border-l dark:text-white">
                      {currentBalance?.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pl-2 font-semibold text-gray-600 dark:text-gray-300">
                      Total:
                    </td>
                    <td className="py-2 pr-2 font-semibold text-right border-l dark:text-white">
                      {parseInt(total_cost).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const TableView: React.FC<any> = ({ rowData }) => {
  return (
    <table className="w-full mb-2 border-[1px]">
      <tbody>
        {rowData?.map((item: any, index: number) => (
          <tr
            className={`border-b ${!item?.visibility ? 'hidden' : ''}`}
            key={index}
          >
            <td
              className={`py-2 pl-2 dark:text-gray-300 text-gray-600 text-[14px] ${item?.rowClassName} `}
            >
              {item.heading}:
            </td>
            <td
              className={`py-2 pr-2 font-medium text-right border-l dark:text-white text-gray-600 text-[14px] ${item?.rowClassName} ${item?.valueColumnClassName}`}
            >
              {item.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default Invoice;
