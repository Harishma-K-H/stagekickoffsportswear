import { paidAmount } from '@utils/staff/paidAmount';
import { Button, Form, Input, Select, Table } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

interface PaymentDetail {
  created_at: string;
  paid_amount: string;
  total_amount: string;
  payment_method: string;
  balance_amount: string;
}

const PaymentHistory: React.FC<any> = ({
  orderDetails,
  CreteNewPayment,
  role = import.meta.env.VITE_STAFF_ROLE,
}) => {
  const { id, total_cost, payment_details } = orderDetails;

  const [form] = Form.useForm();

  // Table data source for payment history
  const tableDataSource = payment_details?.map(
    (payment: PaymentDetail, i: number) => ({
      key: i,
      slNo: i + 1,
      date: dayjs(payment.created_at).format('DD-MM-YYYY'),
      paid: parseFloat(payment.paid_amount).toFixed(2),
      balance: parseFloat(payment.balance_amount).toFixed(2),
      paymentMethod: payment.payment_method,
    }),
  );

  // Calculate total paid amount and current balance
  const totalPaid = Math.round(paidAmount(payment_details));
  const balanceAmount =
    payment_details?.length > 0 &&
    payment_details[payment_details?.length - 1]?.balance_amount;
  const currentBalance = balanceAmount
    ? parseFloat(balanceAmount)
    : Math.round(parseFloat(total_cost) - totalPaid);

  const columns = [
    { title: 'Sl No.', dataIndex: 'slNo', key: 'slNo', width: '8%' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Paid', dataIndex: 'paid', key: 'paid' },
    { title: 'Balance', dataIndex: 'balance', key: 'balance' },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
  ];

  // Payment method options
  const paymentMethods = [
    { value: 'Cash', label: 'Cash' },
    { value: 'UPI', label: 'UPI (GPay/PhonePe/Paytm)' },
    { value: 'Debit/Credit_Card', label: 'Debit/Credit Card' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
  ];

  // Handle form submission
  const handleSubmit = (values: { paymentMethod: string; amount: string }) => {
    const paidAmount = parseFloat(values.amount);

    if (paidAmount > currentBalance) {
      form.setFields([
        {
          name: 'amount',
          errors: [
            `Amount cannot exceed the balance of ${currentBalance.toFixed(2)}`,
          ],
        },
      ]);
      return;
    }

    const payload = {
      order_id: id,
      total_amount: total_cost,
      balance_amount: Math.round(currentBalance - paidAmount),
      paid_amount: paidAmount,
      payment_method: values.paymentMethod,
    };

    CreteNewPayment(payload);
    form.resetFields();
  };

  return (
    <div
      id="invoice-print"
      className="p-1 bg-white rounded-lg dark:bg-gray-800 custom-table"
    >
      {/* Payment History Table */}
      {payment_details && payment_details.length > 0 && (
        <div className="mb-8">
          <h5 className="mb-4 text-xl font-medium dark:text-white">
            Payment Details
          </h5>
          <div className="overflow-x-auto">
            <Table
              bordered
              dataSource={tableDataSource}
              columns={columns}
              pagination={false}
              scroll={{ x: '700' }}
            />
          </div>
        </div>
      )}

      {/* New Payment Form */}
      {role == import.meta.env.VITE_STAFF_ROLE && currentBalance > 0 && (
        <div className="mb-8">
          <h5 className="mb-4 text-xl font-medium dark:text-white">
            Add New Payment
          </h5>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            <Form.Item
              name="paymentMethod"
              label="Payment Method"
              className="!mb-0"
              rules={[
                { required: true, message: 'Please select a payment method' },
              ]}
            >
              <Select
                placeholder="Select Payment Method"
                options={paymentMethods}
                className="w-full"
              />
            </Form.Item>
            <Form.Item
              name="amount"
              label="Amount"
              className="!mb-0"
              rules={[
                { required: true, message: 'Please enter an amount' },
                {
                  validator: (_, value) => {
                    const amount = parseFloat(value);
                    if (!value || amount <= 0) {
                      return Promise.reject(
                        new Error('Amount must be greater than 0'),
                      );
                    }
                    if (amount > currentBalance) {
                      return Promise.reject(
                        new Error(
                          `Amount cannot exceed balance of ${currentBalance.toFixed(2)}`,
                        ),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                type="number"
                placeholder="Enter amount"
                min={0}
                step="0.01"
                className="w-full py-2 h-9"
              />
            </Form.Item>
            <Form.Item label=" " colon={false}>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full text-white h-9 bg-primary"
              >
                Submit Payment
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}

      {/* Total Calculations */}
      <div className="flex justify-end">
        <div className="w-2/3">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">
                Paid Amount:
              </span>
              <span className="font-medium dark:text-white">
                {totalPaid?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">
                Balance Amount:
              </span>
              <span className="font-medium dark:text-white">
                {currentBalance.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-semibold dark:text-white">Total:</span>
              <span className="font-semibold dark:text-white">
                {Math.round(parseFloat(total_cost)).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
