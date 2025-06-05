import './style.css';

import { numberToWords } from '@utils/common/numberToWords';
import { paidAmount } from '@utils/staff/paidAmount';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { FaPhoneAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const Invoice: React.FC<{
  type: 'ORDER' | 'INVOICE';
  data: any;
  printForOffice?: boolean;
  downloadForOffice?: boolean;
  printForOfficeInvoice?: boolean;
  paid?: boolean;
}> = ({
  type = 'ORDER',
  data,
  printForOffice = false,
  downloadForOffice = false,
  printForOfficeInvoice = false,
  paid = false,
}) => {
  const {
    invoice_id,
    orderID,
    order_date,
    delivery_date,
    net_cost,
    items_total_cost,
    gst,
    total_cost,
    customer,
    shipped_customer,
    items,
    payment_details,
    created_by,
    remarks,
    discount,
  } = data;

  const totalPaid = paidAmount(payment_details);
  const currentBalance = parseInt(total_cost) - totalPaid;
  const taxRows =
    customer?.state_name === 'KERALA'
      ? [
          {
            heading: 'CGST (2.5%)',
            value: (parseFloat(gst) / 2).toFixed(2),
            visibility: true,
            rowClassName: '!border-b-0',
            labelColumnClassName: '!text-right pr-4 w-[60%]',
            valueColumnClassName: '!pr-4',
          },
          {
            heading: 'SGST (2.5%)',
            value: (parseFloat(gst) / 2).toFixed(2),
            visibility: true,
            rowClassName: '!border-b-0',
            labelColumnClassName: '!text-right pr-4 w-[60%]',
            valueColumnClassName: '!pr-4',
          },
        ]
      : [
          {
            heading: 'IGST (5%)',
            value: Number(parseFloat(gst).toFixed(2)),
            visibility: true,
            rowClassName: '!border-b-0',
            labelColumnClassName: '!text-right pr-4 w-[60%]',
            valueColumnClassName: '!pr-4',
          },
        ];
  useEffect(() => {
    console.log('Customer ID:', customer?.id);
    console.log('Shipped Customer ID:', shipped_customer?.custom_id);
  }, [customer?.id, shipped_customer?.custom_id]);
  // const extraRows = [
  //   type === 'ORDER' && {
  //     heading: 'Paid Amount',
  //     value: totalPaid?.toFixed(2),
  //     visibility: true,
  //     rowClassName: '!border-b-0',
  //     labelColumnClassName: '!text-right pr-4 w-[60%]',
  //     valueColumnClassName: '!pr-4',
  //   },
  //   discount > 0 && {
  //     heading: 'Discount',
  //     value: parseInt(discount)?.toFixed(2),
  //     visibility: true,
  //     rowClassName: '!border-b-0',
  //     labelColumnClassName: '!text-right pr-4 w-[60%]',
  //     valueColumnClassName: '!pr-4',
  //   },
  //   currentBalance > 0 && type === 'ORDER' && {
  //     heading: 'Balance Due',
  //     value: currentBalance?.toFixed(2),
  //     visibility: true,
  //     rowClassName: '!text-red-500 !text-[15px] !font-semibold',
  //     labelColumnClassName: '!text-right pr-4 w-[60%]',
  //     valueColumnClassName: '!pr-4',
  //   },
  //   currentBalance > 0 && printForOfficeInvoice && {
  //     heading: 'Balance Due',
  //     value: currentBalance?.toFixed(2),
  //     visibility: true,
  //     rowClassName: '!text-red-500 !text-[15px] !font-semibold',
  //     labelColumnClassName: '!text-right pr-4 w-[60%]',
  //     valueColumnClassName: '!pr-4',
  //   },
  // ].filter(Boolean);
  console.log('Logo URL:', created_by?.logo);
  console.log('dhgdhgdhgdh', import.meta.env.VITE_MEDIA_BASE_PATH);
  console.log('Logo Path:', created_by?.logo);
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
      <div className="flex justify-between items-center gap-4">
  {created_by?.logo ? (
    <img
      src={`${import.meta.env.VITE_MEDIA_BASE_PATH}${created_by.logo}`}
      className="max-w-[200px]"
      alt="Logo"
    />
  ) : null}

  <div className="text-right mb-[10px]">
    <h5 className="text-lg font-extrabold leading-5">
      KICKOFF SPORTS WEAR
      <br />
      <span className="text-sm font-semibold uppercase">
        {created_by?.branch}
      </span>
    </h5>

    <div className="text-xs">
      {created_by?.address} <br />
      {created_by?.district}, {created_by?.state}, {created_by?.pincode}
      <br />
      {created_by?.GSTN && `GSTN: ${created_by?.GSTN}`}
      <div className="flex justify-end gap-3 mt-1">
        {created_by?.phn_no && (
          <span className="flex items-center gap-1">
            <FaPhoneAlt className="w-3.5 h-3.5" />
            {created_by?.phn_no}
          </span>
        )}
        {created_by?.email && (
          <span className="flex items-center gap-1">
            <MdEmail className="w-4 h-4" />
            {created_by?.email}
          </span>
        )}
      </div>
    </div>
  </div>
</div>
      <h5 className="relative z-20 mb-2 text-xl font-extrabold text-center text-black bg-white">
        <span className="px-5 text-lg bg-white">
          {printForOfficeInvoice
            ? 'INVOICE'
            : type == 'INVOICE'
              ? `TAX INVOICE`
              : `ORDER FORM`}
        </span>
        <span className="absolute left-0 w-full h-[2px] bg-black/70 top-3.5 -z-10"></span>
      </h5>

      {/* Order Details */}
      {/* Order Details */}
<div className="flex justify-between items-start mb-7 gap-4">
  {/* Billed To */}
  <div className="w-1/3 space-y-1">
    <h2 className="text-base font-semibold dark:text-white">Billed To</h2>
    <p className="text-sm text-gray-600 dark:text-gray-300">
    {customer?.business_name && customer.business_name !== "undefined" && customer.business_name !== "" && (
  <>
    {customer.business_name}
    <br />
  </>
)}
{/* {customer?.name && (
  <p>{customer.name}<br /></p>
)} */}

{customer?.address1 && (
  <>
    {customer.address1} <br />
  </>
)}

{customer?.address2 && (
  <>
    {customer.address2} <br />
  </>
)}

{customer?.mobile_number1 && (
  <>
    {customer.mobile_number1} <br />
  </>
)}

{customer?.gst_no && (
  <>
    {customer.gst_no} <br />
  </>
)}

{customer?.state_name && (
  <>
    {customer.state_name}
  </>
)}
    </p>
  </div>

  {/* TableView (Centered) */}
  <div className="w-1/3 flex justify-center">
    <TableView
      rowData={[
        {
          heading: `${type}`,
          value: `${type === 'INVOICE' ? invoice_id : orderID}`,
          visibility: true,
          rowClassName: 'px-3',
          valueColumnClassName: '!text-left',
          labelColumnClassName: '!text-left bg-black/70 text-white',
        },
        {
          heading: `${type} DATE`,
          value: `${dayjs(order_date).format('DD-MM-YYYY')}`,
          visibility: true,
          rowClassName: 'px-3',
          valueColumnClassName: '!text-left',
          labelColumnClassName: '!text-left bg-black/70 text-white',
        },
        {
          heading: 'DELIVERY DATE',
          value: `${dayjs(delivery_date).format('DD-MM-YYYY')}`,
          visibility: true,
          rowClassName: 'px-3',
          valueColumnClassName: '!text-left',
          labelColumnClassName: '!text-left bg-black/70 text-white',
        },
      ]}
    />
  </div>

  {/* Shipped To */}
  {/* <div className="w-1/3 space-y-1 text-right">
    <h2 className="text-base font-semibold dark:text-white">Shipped To</h2>
    <p className="text-sm text-gray-600 dark:text-gray-300">
    {shipped_customer?.business_name && shipped_customer.business_name !== "undefined" && shipped_customer.business_name !== "" && (
      <>
        {shipped_customer.business_name}
        <br />
      </>
    )}
      {shipped_customer?.name} <br />
      {shipped_customer?.address1}
      {shipped_customer?.address2 && `, ${shipped_customer.address2}`} <br />
      {shipped_customer?.mobile_number1} <br />
      {shipped_customer?.gst_no && (
                  <>
                   {shipped_customer.gst_no}
                    <br />
                  </>
            )}
       {(shipped_customer?.custom_id === customer?.id
    ? customer?.state_name
    : shipped_customer?.state_name) || ''}
    </p>
  </div> */}
</div>

      {/* Order Items Table */}
      <div className="mb-8">
        <table className="w-full border-[1px] border-black/70">
          <thead>
            <tr className="text-white bg-black/70 dark:bg-gray-700">
              <th className="px-3 py-2 text-[13px] text-left dark:text-white border-r border-black/70">
                #
              </th>
              <th className="px-3 py-2 text-[13px] text-left dark:text-white border-r border-black/70">
                Model
              </th>
              <th className="px-3 py-2 text-[13px] text-left dark:text-white border-r border-black/70">
                Material
              </th>
              <th className="px-3 py-2 text-[13px] text-left dark:text-white border-r border-black/70">
                Print Type
              </th>
              <th className="px-3 py-2 text-[13px] text-left dark:text-white border-r border-black/70">
                Sleeve Case
              </th>
              <th className="px-3 py-2 text-[13px] text-left dark:text-white border-r border-black/70">
                Size
              </th>
              <th
                className={`px-3 py-2 text-[13px] text-left dark:text-white border-r border-black/70 ${printForOffice && 'print:hidden'} ${downloadForOffice && 'hidden'}`}
              >
                Unit Cost
              </th>
              <th className="px-3 py-2 text-[13px] text-left dark:text-white border-r border-black/70">
                Qty
              </th>
              <th
                className={`px-3 py-2 text-[13px] text-right dark:text-white border-r border-black/70 ${printForOffice && 'print:hidden'} ${downloadForOffice && 'hidden'}`}
              >
                Item Cost
              </th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item: any, index: number) => (
              <tr
                key={index}
                className="uppercase dark:border-gray-700 text-[12.5px]"
              >
                <td className="px-4 py-2 border dark:text-white border-black/70">
                  {index + 1}
                </td>
                <td className="px-4 py-2 border dark:text-white border-black/70">
                  {item.model}
                </td>
                <td className="px-4 py-2 border dark:text-white border-black/70">
                  {item.material}
                </td>
                <td className="px-4 py-2 border dark:text-white border-black/70">
                  {item.print_type}
                </td>
                <td className="px-4 py-2 border dark:text-white border-black/70">
                  {item.sleeve_case}
                </td>
                <td className="px-4 py-2 border dark:text-white border-black/70">
                  {item.size}
                </td>
                <td
                  className={`px-4 py-2 dark:text-white border border-black/70 ${printForOffice && 'print:hidden'} ${downloadForOffice && 'hidden'}`}
                >
                  {item.item_cost
                  }
                </td>
                <td className="px-4 py-2 border dark:text-white border-black/70">
                  {item.qty}
                </td>
                <td
                  className={`px-4 py-2 dark:text-white border border-black/70 text-right ${printForOffice && 'print:hidden'} ${downloadForOffice && 'hidden'}`}
                >
                  {parseInt(item.total_item_cost)?.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Calculations */}
      <div
        className={`grid grid-cols-5 justify-between gap-5 ${printForOffice && 'print:hidden'} ${downloadForOffice && 'hidden'}`}
      >
        <div className="relative col-span-3 pb-20">
          Total In Words <br />
          <strong className="text-base">
            {numberToWords(parseInt(total_cost))}
          </strong>
          {paid && (
            <img
              src="/paid.png"
              alt="Company Logo"
              className="max-w-[110px] absolute right-5 top-22"
            />
          )}
        </div>
        <div className="w-full col-span-2">
          <div className="space-y-2">
            <TableView
              rowData={[
              
                {
                  heading: 'Raw Subtotal',
                  value: parseFloat(items_total_cost).toFixed(2),
                  visibility: true,
                  rowClassName: '!border-b-0',
                  labelColumnClassName: '!text-right pr-4 w-[60%]',
                  valueColumnClassName: '!pr-4',
                },
                discount > 0 && {
                  heading: 'Discount',
                  value: parseFloat(discount)?.toFixed(2),
                  // visibility: true,
                  visibility: ['INVOICE', 'ORDER'].includes(type),
                  rowClassName: '!border-b-0',
                  labelColumnClassName: '!text-right pr-4 w-[60%]',
                  valueColumnClassName: '!pr-4',
                },
             
                {
                  heading: 'Sub Total',
                  value: parseFloat(net_cost).toFixed(2),
                  visibility: true,
                  rowClassName: '!border-b-0',
                  labelColumnClassName: '!text-right pr-4 w-[60%]',
                  valueColumnClassName: '!pr-4',
                },
               
                ...taxRows,

                {
                  heading: 'Paid Amount',
                  value: totalPaid?.toFixed(2),
                  visibility: type === 'ORDER',
                  rowClassName: '!border-b-0',
                  labelColumnClassName: '!text-right pr-4 w-[60%]',
                  valueColumnClassName: '!pr-4',
                },

                {
                  heading: 'Total',
                  value: parseInt(total_cost).toFixed(2),
                  visibility: true,
                  rowClassName: '!text-black !text-[15px] !font-semibold',
                  labelColumnClassName: '!text-right pr-4 w-[60%]',
                  valueColumnClassName: '!pr-4',
                },
                // ✅ Conditionally show Refund Amount
                // totalPaid > total_cost && {
                //   heading: 'Refund Amount',
                //   value: (totalPaid - parseFloat(total_cost)).toFixed(2),
                //   visibility: true,
                //   rowClassName: '!text-green-600 !text-[15px] !font-semibold',
                //   labelColumnClassName: '!text-right pr-4 w-[60%]',
                //   valueColumnClassName: '!pr-4',
                // },
                currentBalance > 0 && {
                  heading: 'Balance Due',
                  value: currentBalance?.toFixed(2),
                  visibility: type === 'ORDER',
                  rowClassName: '!text-red-500 !text-[15px] !font-semibold',
                  labelColumnClassName: '!text-right pr-4 w-[60%]',
                  valueColumnClassName: '!pr-4',
                },
                currentBalance > 0 &&
                  printForOfficeInvoice && {
                    heading: 'Balance Due',
                    value: currentBalance?.toFixed(2),
                    visibility: true,
                    rowClassName: '!text-red-500 !text-[15px] !font-semibold',
                    labelColumnClassName: '!text-right pr-4 w-[60%]',
                    valueColumnClassName: '!pr-4',
                  },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 mb-7">
        {/* Row 1 - Bill To (left) */}
        <div className="space-y-1">
          {/* {customer?.id !== shipped_customer?.custom_id && ( */}
            {/* <>
              <h2 className="text-base font-semibold dark:text-white">
                Shipped Address
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {shipped_customer?.business_name &&
                  `${shipped_customer.business_name}`}
                <br />
                {shipped_customer?.name} <br />
                {shipped_customer?.address1}
                {shipped_customer?.address2 &&
                  `, ${shipped_customer.address2}`}{' '}
                <br />
                {shipped_customer?.mobile_number1} <br />
                {shipped_customer?.gst_no &&
                  `GSTN: ${ shipped_customer?.gst_no }`}
                {shipped_customer?.state_name &&
                `${shipped_customer.state_name}`}
              </p>
            </> */}
          {/* )} */}
        </div>
      </div>
    
      {/* Remarks Section */}
      { (type === "ORDER" && !printForOfficeInvoice && remarks && remarks.trim() !== '') && (
  <div className="col-span-3 mt-8 mb-6 rounded-md bg-white bg-opacity-20 backdrop-blur-sm text-gray-900 dark:text-gray-100">
    <h3 className="font-semibold mb-1">Remarks</h3>
    <p className="text-sm whitespace-pre-line leading-relaxed">{remarks}</p>
    
  </div>
      )}
{(type === "INVOICE" || printForOfficeInvoice) && (
  <div className="grid grid-cols-2 gap-3 mt-5">
    {/* Left side: Bank Details */}
    <div>
      <h4 className="font-semibold mb-1">Bank Account Details,</h4>
      <h3 className="text-[15px] font-semibold text-gray-600 whitespace-pre-wrap dark:text-gray-300">
        {created_by?.account_details}
      </h3>
    </div>

    {/* Right side: QR Code and Signature */}
    {created_by?.qr_code && (
      <div className="flex flex-col items-end justify-between h-full">
        <img
          src={`https://kickoffsportswear.app${created_by?.qr_code}`}
          alt="QR Code"
          className="h-32 w-32 object-contain"
        />
       
      </div>
          )}
         
     
        </div>
        
      )}
   
   {type === "INVOICE" && (
  <div className="print:block hidden mt-20 text-right">
    <h5 className="text-base font-bold text-gray-700">Authorized Signature</h5>
  </div>
)}
    </div>
   
  );
};

const TableView: React.FC<any> = ({ rowData }) => {
  return (
    <table className="w-full mb-2 border-[1px] border-gray-400">
      <tbody>
        {rowData?.map((item: any, index: number) => (
          <tr
            className={`border-b border-gray-400 ${!item?.visibility ? 'hidden' : ''}`}
            key={index}
          >
            <td
              className={`py-1.5 pl-2 dark:text-gray-300 text-gray-600 text-[14px] ${item?.rowClassName} ${item?.labelColumnClassName}`}
            >
              {item.heading}
            </td>
            <td
              className={`py-1.5 pr-2 font-medium text-right border-l border-gray-400 dark:text-white text-gray-600 text-[14px] ${item?.rowClassName} ${item?.valueColumnClassName}`}
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
