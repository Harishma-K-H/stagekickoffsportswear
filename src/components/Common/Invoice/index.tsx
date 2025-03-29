import './style.css';

import { paidAmount } from '@utils/staff/paidAmount';
import dayjs from 'dayjs';
import React from 'react';

const Invoice: React.FC<{
  type: 'ORDER' | 'INVOICE';
  data: any;
  printForOffice?: boolean;
}> = ({ type = 'ORDER', data, printForOffice = false }) => {
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
  } = data;

  const totalPaid = paidAmount(payment_details);
  const currentBalance = parseInt(total_cost) - totalPaid;

  return (
    <div
      id="invoice-print"
      className="p-1 bg-white rounded-lg dark:bg-gray-800 print:p-8"
    >
      {/* Header */}
      <div className="grid items-center grid-cols-3 gap-4 pb-3 mb-4 border-b-2">
        <img
          src="/logo.png"
          alt="Company Logo"
          className="max-w-[200px] mb-4"
        />
        <div>
          <h5 className="text-lg font-extrabold leading-5 ">
            KICKOFF SPORTS WEAR. <br />
            SMART TRADE CITY <br />
            KOTTAKKAL
          </h5>
          <p className="text-xs">
            MALAPPURAM Kerala 676503, India <br />
            GSTIN: 32BKYPS7094H1ZA
          </p>
        </div>
        <div className="text-right">
          <h5 className="mb-2 text-xl font-extrabold">
            {type == 'INVOICE' ? `TAX INVOICE` : `ORDER`}
          </h5>
          {/* <p className="text-sm font-semibold">{`${type} ID : ${id}`}</p> */}
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold dark:text-white">Bill To:</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {customer?.business_name} <br />
            {customer?.name} <br />
            {customer?.address1} <br />
            {customer?.mobile_number1} <br />
            {customer?.email} <br />
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
            <br />
            GSTNO:{' '}
            <span className="font-normal text-gray-600">
              {customer?.gst_no}
            </span>
          </p>
        </div>
      </div>

      {/* Order Items Table */}
      <div className="mb-8">
        <div className="">
          <table className="w-full">
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
                <th className="px-4 py-2 text-sm text-left dark:text-white">
                  Unit Cost
                </th>
                <th className="px-4 py-2 text-sm text-left dark:text-white">
                  Qty
                </th>
                <th className="px-4 py-2 text-sm text-left dark:text-white">
                  Item Cost
                </th>
              </tr>
            </thead>
            <tbody>
              {items?.map((item: any, index: number) => (
                <tr
                  key={index}
                  className="uppercase border-b dark:border-gray-700"
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
                  <td className="px-4 py-2 dark:text-white">
                    {item.unit_cost}
                  </td>
                  <td className="px-4 py-2 dark:text-white">{item.qty}</td>
                  <td className="px-4 py-2 dark:text-white">
                    {item.total_item_cost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total Calculations */}
      <div className={`flex justify-end ${printForOffice && 'print:hidden'}`}>
        <div className="w-2/5">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">
                Subtotal:
              </span>
              <span className="font-medium dark:text-white">
                {parseInt(net_cost)?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">
                CGST2.5 (2.5%):
              </span>
              <span className="font-medium dark:text-white">
                {(parseInt(gst) / 2).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">
                SGST2.5 (2.5%):
              </span>
              <span className="font-medium dark:text-white">
                {(parseInt(gst) / 2)?.toFixed(2)}
              </span>
            </div>
            <div
              className={`flex justify-between ${type === 'INVOICE' && 'hidden'}`}
            >
              <span className="text-gray-600 dark:text-gray-300">
                Paid Amount:
              </span>
              <span className="font-medium dark:text-white">
                {totalPaid?.toFixed(2)}
              </span>
            </div>
            <div
              className={`flex justify-between ${type === 'INVOICE' && 'hidden'}`}
            >
              <span className="text-gray-600 dark:text-gray-300">
                Balance Amount:
              </span>
              <span className="font-medium dark:text-white">
                {currentBalance?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-semibold dark:text-white">Total:</span>
              <span className="font-semibold dark:text-white">
                {parseInt(total_cost).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
