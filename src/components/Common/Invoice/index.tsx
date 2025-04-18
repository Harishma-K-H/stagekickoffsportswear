import './style.css';

import { paidAmount } from '@utils/staff/paidAmount';
import dayjs from 'dayjs';
import React from 'react';

import { numberToWords } from '../../../utils/common/numberToWords';

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
      className="p-1 bg-white rounded-lg dark:bg-gray-800 print:p-8"
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
            KICKOFF SPORTS WEAR. <br />
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
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="space-y-1">
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
        <div className="space-y-1 text-right">
          <p className="font-bold text-gray-900 dark:text-gray-300">
            {type} ID:{' '}
            <span className="font-normal text-gray-600">
              {type == 'INVOICE' ? `#${invoice_id}` : orderID}
            </span>{' '}
            <br />
            {type} Date:{' '}
            <span className="font-normal text-gray-600">
              {dayjs(order_date).format('DD-MM-YYYY')}
            </span>
            <br />
            Delivery Date:{' '}
            <span className="font-normal text-gray-600">{delivery_date}</span>
          </p>
        </div>
      </div>

      {/* Order Items Table */}
      <div className="mb-8">
        <div className="">
          <table className="w-full border-[1px] border-gray-300">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-4 py-2 text-sm text-left dark:text-white">
                  #
                </th>
                <th className="px-4 py-2 text-sm text-left dark:text-white">
                  Model
                </th>
                <th className="px-4 py-2 text-sm text-left dark:text-white">
                  Material
                </th>
                <th className="px-4 py-2 text-sm text-left dark:text-white">
                  Print Type
                </th>
                <th className="px-4 py-2 text-sm text-left dark:text-white">
                  Sleeve Case
                </th>
                <th className="px-4 py-2 text-sm text-left dark:text-white">
                  Size
                </th>
                <th
                  className={`px-4 py-2 text-sm text-left dark:text-white ${printForOffice && 'print:hidden'} ${downloadForOffice && 'hidden'}`}
                >
                  Unit Cost
                </th>
                <th className="px-4 py-2 text-sm text-left dark:text-white">
                  Qty
                </th>
                <th
                  className={`px-4 py-2 text-sm text-left dark:text-white ${printForOffice && 'print:hidden'} ${downloadForOffice && 'hidden'}`}
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
        className={`flex justify-between gap-5 ${printForOffice && 'print:hidden'} ${downloadForOffice && 'hidden'}`}
      >
        <div>
          Total In Words <br />
          <strong className="text-lg">
            {numberToWords(parseFloat(total_cost))}
          </strong>
        </div>
        <div className="w-2/5">
          <div className="space-y-2">
            <table className="w-full mb-2 border-[1px]">
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
                  <td className="py-2 pr-2 font-medium text-right dark:text-white">
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
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
