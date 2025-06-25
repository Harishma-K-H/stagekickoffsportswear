import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, Collapse, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { useApiJSON } from '@services/ApiService/Api.service';
import { getCustomerDetails } from './api';
import { notify } from '@components/Common/Toastify';
import Button from '@components/Common/Button';

const { Panel } = Collapse;

interface Item {
  id: number;
  model: string;
  code: string;
  material: string;
  size: string;
  qty: number;
  total_item_cost: string;
  print_type?: string;
  sleeve_case?: string;
  unit_cost?: string;
}

interface InvoiceItem {
  id: number;
  model: string;
  material: string;
  size: string;
  qty: number;
  discount: string | null;
  total_item_cost: string;
  sleeve_case: string;
  print_type: string;
  unit_cost: string;
}

interface Payment {
  total_amount: string;
  paid_amount: string;
  payment_method: string;
  created_at: string;
}

interface Order {
  id: number;
  orderID: string;
  order_date: string;
  delivery_date: string;
  total_cost: string;
  net_cost?: string;
  gst?: string;
  status?: string;
  items: Item[];
  payment_details: Payment[];
}

interface Invoice {
  id: number;
  invoice_id: string;
  order_id?: string;
  total_cost: string;
  gst: string;
  net_cost: string;
  created_at: string;
  invoice_items: InvoiceItem[];
}

interface CustomerDetailsResponse {
  customer_id: number;
  business_name: string;
  orders: Order[];
  invoices: Invoice[];
}

export default function CustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { get } = useApiJSON();

  const [data, setData] = useState<CustomerDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await getCustomerDetails(get, parseInt(id), '', 1, 10);
        if (res.ok) setData(res.data);
        else throw new Error('API error');
      } catch (err) {
        console.error(err);
        notify('Could not load customer details', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [get, id]);

  if (loading) return <Spin className="block mx-auto mt-10" />;
  if (!data) return null;

  const orderCols: ColumnsType<Order> = [
    { title: 'Order ID', dataIndex: 'orderID', key: 'orderID' },
    {
      title: 'Order Date',
      dataIndex: 'order_date',
      key: 'order_date',
      render: (v) => dayjs(v).format('DD-MMM-YYYY'),
    },
    {
      title: 'Delivery Date',
      dataIndex: 'delivery_date',
      key: 'delivery_date',
      render: (v) => dayjs(v).format('DD-MMM-YYYY'),
    },
    { title: 'Net Cost', dataIndex: 'net_cost', key: 'net_cost' },
    { title: 'GST', dataIndex: 'gst', key: 'gst' },
    { title: 'Total', dataIndex: 'total_cost', key: 'total_cost' },
  ];

  const itemCols: ColumnsType<Item> = [
    { title: 'Model', dataIndex: 'model', key: 'model' },
    { title: 'Material', dataIndex: 'material', key: 'material' },
    { title: 'Print Type', dataIndex: 'print_type', key: 'print_type' },
    { title: 'Sleeve', dataIndex: 'sleeve_case', key: 'sleeve_case' },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    { title: 'Unit Cost', dataIndex: 'unit_cost', key: 'unit_cost' },
    { title: 'Qty', dataIndex: 'qty', key: 'qty' },
    { title: 'Sub-total', dataIndex: 'total_item_cost', key: 'total_item_cost' },
  ];

  const payCols: ColumnsType<Payment> = [
    { title: 'Mode', dataIndex: 'payment_method', key: 'payment_method' },
    { title: 'Paid', dataIndex: 'paid_amount', key: 'paid_amount' },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v) => dayjs(v).format('DD-MMM-YYYY HH:mm'),
    },
  ];

  const invoiceCols: ColumnsType<Invoice> = [
    { title: 'Invoice ID', dataIndex: 'invoice_id', key: 'invoice_id' },
    { title: 'Order ID', dataIndex: 'order_id', key: 'order_id' },
    {
      title: 'Created Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v) => dayjs(v).format('DD-MMM-YYYY'),
    },
    { title: 'Net Cost', dataIndex: 'net_cost', key: 'net_cost' },
    { title: 'GST', dataIndex: 'gst', key: 'gst' },
    { title: 'Total', dataIndex: 'total_cost', key: 'total_cost' },
  ];

  const invoiceItemCols: ColumnsType<InvoiceItem> = [
    { title: 'Model', dataIndex: 'model', key: 'model' },
    { title: 'Material', dataIndex: 'material', key: 'material' },
    { title: 'Print Type', dataIndex: 'print_type', key: 'print_type' },
    { title: 'Sleeve', dataIndex: 'sleeve_case', key: 'sleeve_case' },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    { title: 'Unit Cost', dataIndex: 'unit_cost', key: 'unit_cost' },
    { title: 'Qty', dataIndex: 'qty', key: 'qty' },
    { title: 'Sub-total', dataIndex: 'total_item_cost', key: 'total_item_cost' },
  ];

  return (
    <>
      <Card
        title={`Customer – ${data.business_name}`}
        className="shadow-lg"
        styles={{ body: { padding: 24 } }}
      >
        <Collapse defaultActiveKey={['orders', 'invoices']} ghost>
          <Panel header={`Orders (${data.orders.length})`} key="orders">
            <Table
              rowKey={(order) => `order-${order.id}`}
              columns={orderCols}
              dataSource={data.orders}
              pagination={false}
              expandable={{
                expandedRowRender: (order) => (
                  <>
                    <strong>Items</strong>
                    <Table
                      rowKey={(item) => `order-${order.id}-item-${item.id}`}
                      columns={itemCols}
                      dataSource={order.items}
                      pagination={false}
                      size="small"
                      className="mb-4"
                    />
                    <strong>Payments</strong>
                    <Table
                      rowKey={(p) => `order-${order.id}-pay-${p.created_at}`}
                      columns={payCols}
                      dataSource={order.payment_details}
                      pagination={false}
                      size="small"
                    />
                  </>
                ),
              }}
              scroll={{ x: true }}
            />
          </Panel>

          <Panel header={`Invoices (${data.invoices.length})`} key="invoices">
            <Table
              rowKey={(invoice) => `invoice-${invoice.id}`}
              columns={invoiceCols}
              dataSource={data.invoices}
              pagination={false}
              expandable={{
                expandedRowRender: (invoice) => (
                  <>
                    <strong>Items</strong>
                    <Table
                      rowKey={(item) =>
                        `invoice-${invoice.id}-item-${item.id}`
                      }
                      columns={invoiceItemCols}
                      dataSource={invoice.invoice_items}
                      pagination={false}
                      size="small"
                    />
                  </>
                ),
              }}
              scroll={{ x: true }}
            />
          </Panel>
        </Collapse>
      </Card>

      <div className="flex justify-right mt-6">
        <Button
          title="Back"
          type="button"
          loading={false}
          handleClick={() => navigate('/admin/customers')}
          className="bg-gray-400 rounded-md w-40 text-white h-12 font-medium hover:bg-blue-400"
        />
      </div>
    </>
  );
}
