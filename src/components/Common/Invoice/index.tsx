import './style.css';

interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

interface Item {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceData {
  invoiceNumber: string;
  dateGenerated: string;
  orderNumber: string;
  orderDate: string;
  trackingNumber: string;
  orderStatus: string;
  shipping: Address;
  billing: Address;
  items: Item[];
  subtotal: number;
  shippingCharge: number;
  tax: number;
  discount: number;
  total: number;
}

const Invoice = () => {
  const mockData: InvoiceData = {
    invoiceNumber: 'INV-2024-001',
    dateGenerated: '2024-01-20',
    orderNumber: 'ORD-2024-001',
    orderDate: '2024-01-19',
    trackingNumber: 'TRK123456789',
    orderStatus: 'Delivered',
    shipping: {
      fullName: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '+1 (555) 123-4567',
    },
    billing: {
      fullName: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phone: '+1 (555) 123-4567',
    },
    items: [
      {
        name: 'Premium Wireless Headphones',
        quantity: 2,
        unitPrice: 199.99,
        total: 399.98,
      },
      {
        name: 'Smart Watch Pro',
        quantity: 1,
        unitPrice: 299.99,
        total: 299.99,
      },
      {
        name: 'Premium Wireless Headphones',
        quantity: 2,
        unitPrice: 199.99,
        total: 399.98,
      },
      {
        name: 'Smart Watch Pro',
        quantity: 1,
        unitPrice: 299.99,
        total: 299.99,
      },
      {
        name: 'Premium Wireless Headphones',
        quantity: 2,
        unitPrice: 199.99,
        total: 399.98,
      },
      {
        name: 'Smart Watch Pro',
        quantity: 1,
        unitPrice: 299.99,
        total: 299.99,
      },
      {
        name: 'Premium Wireless Headphones',
        quantity: 2,
        unitPrice: 199.99,
        total: 399.98,
      },
      {
        name: 'Smart Watch Pro',
        quantity: 1,
        unitPrice: 299.99,
        total: 299.99,
      },
      {
        name: 'Premium Wireless Headphones',
        quantity: 2,
        unitPrice: 199.99,
        total: 399.98,
      },
      {
        name: 'Smart Watch Pro',
        quantity: 1,
        unitPrice: 299.99,
        total: 299.99,
      },
    ],
    subtotal: 699.97,
    shippingCharge: 15.0,
    tax: 56.0,
    discount: 50.0,
    total: 720.97,
  };

  return (
    <div
      id="invoice-print"
      className="p-8 bg-white rounded-lg dark:bg-gray-800"
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
          <h5 className="mb-2 text-xl font-extrabold">TAX INVOICE</h5>
          <p className="text-sm font-semibold">INVOICE :6402</p>
        </div>
        {/* <h1 className="text-2xl font-bold dark:text-white">Invoice</h1>
                    <p className="text-gray-600 dark:text-gray-300">#{mockData.invoiceNumber}</p>
                    <p className="text-gray-600 dark:text-gray-300">Date: {mockData.dateGenerated}</p> */}
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold dark:text-white">
            Order Information
          </h2>
          <div className="p-4 rounded bg-gray-50 dark:bg-gray-700">
            <p className="text-gray-600 dark:text-gray-300">
              Order Number: {mockData.orderNumber}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Order Date: {mockData.orderDate}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Tracking Number: {mockData.trackingNumber}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Status: {mockData.orderStatus}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold dark:text-white">
            Order Information
          </h2>
          <div className="p-4 rounded bg-gray-50 dark:bg-gray-700">
            <p className="text-gray-600 dark:text-gray-300">
              Order Number: {mockData.orderNumber}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Order Date: {mockData.orderDate}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Tracking Number: {mockData.trackingNumber}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Status: {mockData.orderStatus}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items Table */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold dark:text-white">
          Order Items
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-4 py-2 text-left dark:text-white">#</th>
                <th className="px-4 py-2 text-left dark:text-white">Item</th>
                <th className="px-4 py-2 text-right dark:text-white">
                  Quantity
                </th>
                <th className="px-4 py-2 text-right dark:text-white">
                  Unit Price
                </th>
                <th className="px-4 py-2 text-right dark:text-white">Total</th>
              </tr>
            </thead>
            <tbody>
              {mockData.items.map((item, index) => (
                <tr key={index} className="border-b dark:border-gray-700">
                  <td className="px-4 py-2 dark:text-white">{index + 1}</td>
                  <td className="px-4 py-2 dark:text-white">{item.name}</td>
                  <td className="px-4 py-2 text-right dark:text-white">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-2 text-right dark:text-white">
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right dark:text-white">
                    ${item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total Calculations */}
      <div className="flex justify-end">
        <div className="w-2/3">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">
                Subtotal:
              </span>
              <span className="font-medium dark:text-white">
                ${mockData.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">
                CGST2.5 (2.5%):
              </span>
              <span className="font-medium dark:text-white">
                ${mockData.shippingCharge.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">
                SGST2.5 (2.5%):
              </span>
              <span className="font-medium dark:text-white">
                ${mockData.tax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">
                Discount:
              </span>
              <span className="font-medium text-green-500">
                -${mockData.discount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-semibold dark:text-white">Total:</span>
              <span className="font-semibold dark:text-white">
                ${mockData.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
