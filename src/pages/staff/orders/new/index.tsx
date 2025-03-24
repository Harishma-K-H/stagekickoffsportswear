import './style.css';

import Breadcrumb from '@components/Common/Breadcrumb';
import Button from '@components/Common/Button';
import { notify } from '@components/Common/Toastify';
import { useApiJSON } from '@services/ApiService/Api.service';
import {
  Form,
  Input,
  message,
  Popconfirm,
  Radio,
  Select,
  Table,
  TableProps,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';

import {
  fetchItemCost,
  fetchMaterial,
  fetchModels,
  fetchPrintTypes,
  GstVerification,
} from './api';

type ColumnTypes = Exclude<TableProps['columns'], undefined>;

const NewOrders: React.FC = () => {
  const { get, post } = useApiJSON();

  const [form] = Form.useForm();
  const [itemForm] = Form.useForm();

  const [value, setValue] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(1);

  const [models, setModels] = useState<any[]>([]);
  const [materialOptions, setMaterialOptions] = useState<Record<string, any[]>>(
    {},
  ); // Keyed by row key
  const [printType, setPrintType] = useState<any[]>([]);
  const [sleeve] = useState<any[]>([
    { value: 'full', label: 'Full Sleeve' },
    { value: 'sleeveless', label: 'Sleeveless' },
    { value: 'half', label: 'Half Sleeve' },
  ]);
  const [size] = useState<any[]>([
    { value: '24', label: '24' },
    { value: '26', label: '26' },
    { value: '28', label: '28' },
    { value: '30', label: '30' },
  ]);
  const [baseCosts, setBaseCosts] = useState<Record<string, number>>({});
  const [dataSource, setDataSource] = useState<any[]>([{ key: '0' }]);

  const onChange = (e: any) => {
    setValue(e.target.value);
  };

  // Handle GST verification
  const handleGSTVerification = async () => {
    const gstn = form.getFieldValue('gstn');
    if (!gstn) {
      form.setFieldsValue({ businessName: null });
      return;
    }
    setLoading(true);
    try {
      const { data } = await GstVerification(gstn);
      if (data?.taxpayerInfo) {
        form.setFieldsValue({ businessName: data?.taxpayerInfo?.tradeNam });
        message.success('Business name auto-filled successfully!');
      } else {
        form.setFieldsValue({ businessName: null });
        message.error('Invalid GST Number or details not found.');
      }
    } catch (error) {
      message.error('Failed to verify GST Number. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch models
  const getModels = useCallback(async () => {
    try {
      const { data } = await fetchModels(get);
      setModels(data);
    } catch (error: any) {
      notify('Failed to fetch models', 'error');
    }
  }, [get]);

  // Fetch materials based on modelId for a specific row
  const getMaterials = useCallback(
    async (modelId: string | number, rowKey: string) => {
      if (!modelId || materialOptions[rowKey]) return; // Avoid fetching if already cached
      try {
        const { data } = await fetchMaterial(get, modelId);
        setMaterialOptions((prev) => ({ ...prev, [rowKey]: data }));
      } catch (error: any) {
        notify('Failed to fetch materials', 'error');
      }
    },
    [get, materialOptions],
  );

  // Fetch print types
  const getPrintTypes = useCallback(async () => {
    try {
      const { data } = await fetchPrintTypes(get);
      setPrintType(data);
    } catch (error: any) {
      notify('Failed to fetch print types', 'error');
    }
  }, [get]);

  // Fetch base item cost
  const getItemCost = useCallback(
    async (
      rowKey: string,
      payload: {
        model: string;
        material: number;
        print_type: number;
        sleevecase: string;
      },
    ) => {
      try {
        const { data } = await fetchItemCost(post, payload); // Assuming response: { data: { cost: number } }
        setBaseCosts((prev) => ({ ...prev, [rowKey]: data.cost || 0 }));
      } catch (error: any) {
        notify('Failed to fetch item cost', 'error');
        setBaseCosts((prev) => ({ ...prev, [rowKey]: 0 }));
      }
    },
    [get],
  );

  // Handle adding a new row
  const handleAdd = () => {
    const newData = { key: String(count) };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  // Handle deleting a row
  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    setBaseCosts((prev) => {
      const newCosts = { ...prev };
      delete newCosts[key as string];
      return newCosts;
    });
  };

  // Calculate total cost based on base cost, quantity, and discount (per product)
  const calculateTotalCost = (
    rowKey: string,
    quantity: string,
    discount: string,
  ): number => {
    const baseCost = baseCosts[rowKey] || 0;
    const qty = parseFloat(quantity) || 0;
    const discPerProduct = parseFloat(discount) || 0; // Discount per product
    const totalCostBeforeDiscount = baseCost * qty;
    const totalDiscount = discPerProduct * qty; // Total discount = discount per product * quantity
    const totalCost = totalCostBeforeDiscount - totalDiscount;
    return totalCost > 0 ? totalCost : 0; // Ensure cost doesn’t go negative
  };

  // Handle form field changes to fetch cost and update total
  const handleFieldChange = (_changedFields: any, allFields: any) => {
    const rowData = allFields.data || {};
    Object.keys(rowData).forEach((rowKey) => {
      const row = rowData[rowKey];
      if (row?.model && row?.material && row?.print_type && row?.sleevecase) {
        const modelName = models.find((m) => m.id === row.model)?.name; // Map modelId to model name
        if (modelName) {
          const payload = {
            model: modelName,
            material: row.material,
            print_type: row.print_type,
            sleevecase: row.sleevecase,
          };
          getItemCost(rowKey, payload);
        }
      }
    });
  };

  // Columns definition
  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: 'MODEL',
      dataIndex: 'model',
      render: (_, record) => (
        <Form.Item
          name={['data', record.key, 'model']}
          rules={[{ required: true, message: 'Please select a model' }]}
        >
          <Select
            size="middle"
            placeholder="Select Model"
            onChange={(value) => getMaterials(value, record.key)} // Fetch materials on change
            options={models.map((model: any) => ({
              value: model.id,
              label: model.name,
            }))}
          />
        </Form.Item>
      ),
    },
    {
      title: 'MATERIAL',
      dataIndex: 'material',
      render: (_, record) => (
        <Form.Item
          name={['data', record.key, 'material']}
          rules={[{ required: true, message: 'Please select a material' }]}
        >
          <Select
            size="middle"
            placeholder="Select Material"
            options={
              materialOptions[record.key]?.map((material: any) => ({
                value: material.id,
                label: material.name,
              })) || []
            } // Use material options specific to this row
          />
        </Form.Item>
      ),
    },
    {
      title: 'PRINT TYPE',
      dataIndex: 'printType',
      render: (_, record) => (
        <Form.Item
          name={['data', record.key, 'print_type']}
          rules={[{ required: true, message: 'Please select a print type' }]}
        >
          <Select
            size="middle"
            placeholder="Select Print Type"
            options={
              printType?.map((type: any) => ({
                value: type.id,
                label: type.name,
              })) || []
            }
          />
        </Form.Item>
      ),
    },
    // Other columns (Sleeve, Size, Quantity, Discount, Cost, Action) remain unchanged
    {
      title: 'SLEEVE',
      dataIndex: 'sleeve',
      render: (_, record) => (
        <Form.Item
          name={['data', record.key, 'sleevecase']}
          rules={[{ required: true, message: 'Please select a sleeve' }]}
        >
          <Select size="middle" placeholder="Select Sleeve" options={sleeve} />
        </Form.Item>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'size',
      render: (_, record) => (
        <Form.Item
          name={['data', record.key, 'size']}
          rules={[{ required: true, message: 'Please select a size' }]}
        >
          <Select size="middle" placeholder="Select size" options={size} />
        </Form.Item>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      align: 'center',
      width: '6%',
      render: (_, record) => {
        return baseCosts[record.key]; // Display with 2 decimal places
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      render: (_, record) => (
        <Form.Item
          name={['data', record.key, 'quantity']}
          rules={[{ required: true, message: 'Please enter Quantity' }]}
        >
          <Input placeholder="Enter Quantity" className="w-full h-9" />
        </Form.Item>
      ),
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      render: (_, record) => (
        <Form.Item
          name={['data', record.key, 'discount']}
          rules={[{ required: false, message: 'Please enter Discount' }]} // Optional field
        >
          <Input placeholder="Enter Discount" className="w-full h-9" />
        </Form.Item>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      align: 'right',
      width: '6%',
      render: (_, record) => {
        const quantity = itemForm.getFieldValue([
          'data',
          record.key,
          'quantity',
        ]);
        const discount = itemForm.getFieldValue([
          'data',
          record.key,
          'discount',
        ]);
        const totalCost = calculateTotalCost(record.key, quantity, discount);
        return (
          <>
            {/* <h5 className="text-xs">{quantity * baseCosts[record.key]}<span className="w-full text-right text-green-500">-{(quantity * discount)}</span></h5> */}
            <span className="text-base font-semibold">{totalCost}</span> <br />
          </>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'Action',
      width: '6%',
      align: 'center',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <span className="text-red-600 cursor-pointer">Delete</span>
          </Popconfirm>
        ) : null,
    },
  ];

  // Initial data fetching on component mount
  useEffect(() => {
    getModels();
    getPrintTypes();
  }, [getModels, getPrintTypes]);

  return (
    <Form
      form={form}
      layout="vertical"
      className="flex flex-col gap-4 custom-form"
    >
      <div className="flex items-center justify-between pb-2 border-b-2">
        <div className="flex">
          <Breadcrumb rootClass="rounded" />
          <h3 className="text-2xl md:text-3xl font-bold text-[#191D23]">
            Create new order
          </h3>
        </div>
      </div>
      <div className="p-3 bg-white rounded-md md:p-5">
        <h5 className="mb-4 text-xl font-medium">
          Customer Details :
          <Radio.Group
            className="ml-5"
            onChange={onChange}
            value={value}
            options={[
              { value: 1, label: <h6>New User</h6> },
              { value: 2, label: <h6>Existing User</h6> },
            ]}
          />
        </h5>

        {/* Conditional Rendering */}
        {value === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 custom-application-form">
            <Form.Item
              className="!mb-0"
              label="Customer Name"
              name="customerName"
              rules={[
                { required: true, message: 'Please enter the Customer Name' },
              ]}
            >
              <Input
                placeholder="Enter customer name"
                className="w-full py-2 h-9 placeholder:text-gray-400"
              />
            </Form.Item>

            <Form.Item
              className="!mb-0"
              label="Business Name"
              name="businessName"
              rules={[
                { required: true, message: 'Please enter the Business Name' },
              ]}
            >
              <Input
                placeholder="Enter business name"
                className="w-full h-9"
                disabled
              />
            </Form.Item>

            <Form.Item
              className="!mb-0"
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter your Email' },
                { type: 'email', message: 'Invalid email format' },
              ]}
            >
              <Input
                placeholder="Enter email"
                className="w-full py-2 h-9 placeholder:text-gray-400"
              />
            </Form.Item>

            <Form.Item
              className="!mb-0"
              label="Address 1"
              name="address1"
              rules={[{ required: true, message: 'Please enter Address 1' }]}
            >
              <Input
                placeholder="Enter address 1"
                className="w-full py-2 h-9 placeholder:text-gray-400"
              />
            </Form.Item>

            <Form.Item className="!mb-0" label="Address 2" name="address2">
              <Input
                placeholder="Enter address 2"
                className="w-full py-2 h-9 placeholder:text-gray-400"
              />
            </Form.Item>

            <Form.Item
              className="!mb-0"
              label="Mobile 1"
              name="phone1"
              rules={[{ required: true, message: 'Please enter Mobile' }]}
            >
              <Input
                placeholder="Enter mobile"
                className="w-full py-2 h-9 placeholder:text-gray-400"
              />
            </Form.Item>

            <Form.Item className="!mb-0" label="Mobile 2" name="phone2">
              <Input
                placeholder="Enter mobile 2"
                className="w-full py-2 h-9 placeholder:text-gray-400"
              />
            </Form.Item>

            <Form.Item
              className="!mb-0"
              label="GSTN"
              name="gstn"
              rules={[
                { required: true, message: 'Please enter your GST Number' },
              ]}
            >
              <Input
                placeholder="Enter GST Number"
                className="w-full h-9"
                onBlur={handleGSTVerification} // Trigger API onBlur
              />
            </Form.Item>
          </div>
        )}

        {value === 2 && (
          <div>
            <Form.Item
              className="!mb-0"
              name="existingUser"
              rules={[{ required: true, message: 'Please select a user' }]}
            >
              <Select
                size="middle"
                showSearch
                placeholder="Search for a user"
                className="h-full"
                options={[
                  { value: 'user1', label: 'User 1' },
                  { value: 'user2', label: 'User 2' },
                ]}
              />
            </Form.Item>
          </div>
        )}
      </div>
      {/* Item Details Table */}
      <Form
        form={itemForm}
        onValuesChange={handleFieldChange}
        className="relative p-3 bg-white rounded-md md:p-5"
      >
        <h5 className="mb-4 text-xl font-medium">Item Details :</h5>
        <Table
          pagination={false}
          bordered
          dataSource={dataSource}
          columns={defaultColumns as ColumnTypes}
        />
        <div className="absolute bottom-0 -right-7 w-fit">
          <Button
            title=""
            icon={<FaPlus className="w-5 h-5" />}
            handleClick={handleAdd}
            type="button"
            className="bg-secondary rounded-md w-full !px-4 text-white font-medium hover:!text-white/90 mx-auto hover:!bg-primary/95"
          />
        </div>
      </Form>
      <div className="w-full">
        <Button
          title="Submit"
          type="submit"
          loading={loading}
          className="bg-primary rounded-md w-full text-white h-12 font-medium hover:!text-white/90 mx-auto hover:!bg-primary/95"
        />
      </div>
    </Form>
  );
};

export default NewOrders;
