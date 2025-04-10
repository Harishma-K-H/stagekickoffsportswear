import './style.css';

import Breadcrumb from '@components/Common/Breadcrumb';
import Button from '@components/Common/Button';
import { notify } from '@components/Common/Toastify';
import Paths from '@routes/paths';
import { useApiFormData, useApiJSON } from '@services/ApiService/Api.service';
import { debounce } from '@utils/common/debounce';
import {
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Radio,
  Select,
  Table,
  TableProps,
} from 'antd';
import dayjs from 'dayjs'; // Ensure dayjs is imported
import React, { useCallback, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate } from 'react-router';

import {
  fetchItemCost,
  fetchMaterial,
  fetchModels,
  fetchPrintTypes,
  generateOrderId,
  getCustomers,
  GstVerification,
  newOrder,
} from './api';

type ColumnTypes = Exclude<TableProps['columns'], undefined>;

const NewOrders: React.FC = () => {
  const { get } = useApiJSON();
  const { post: FormDataPost } = useApiFormData(); // Use FormData-specific post
  const navigate = useNavigate();

  const [itemForm] = Form.useForm();
  const [customerForm] = Form.useForm();
  const [remarksForm] = Form.useForm();

  const [userType, setUserType] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(1);

  const [models, setModels] = useState<any[]>([]);
  const [materialOptions, setMaterialOptions] = useState<Record<string, any[]>>(
    {},
  );
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
  const [totalCosts, setTotalCosts] = useState<Record<string, number>>({});
  const [modelName, setModelName] = useState<any>({});
  const [dataSource, setDataSource] = useState<any[]>([{ key: '0' }]);

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
    async (modelId: string | number, rowKey: string, modelName: string) => {
      if (!modelId) return;
      try {
        setModelName((prev: any) => ({ ...prev, [rowKey]: modelName }));
        const { data } = await fetchMaterial(get, modelId);
        setMaterialOptions((prev) => ({ ...prev, [rowKey]: data }));
      } catch (error: any) {
        setMaterialOptions((prev) => ({ ...prev, [rowKey]: [] }));
        notify(error?.response?.data?.error, 'error');
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
        modelId: number;
        materialId: number;
        printId: number;
        sleeveCase: string;
      },
    ) => {
      try {
        const { data } = await fetchItemCost(get, payload);
        setBaseCosts((prev) => ({ ...prev, [rowKey]: data.cost || 0 }));
        if (areAllFieldsFilled()) {
          const quantity = itemForm.getFieldValue(['data', rowKey, 'quantity']);
          const discount = itemForm.getFieldValue(['data', rowKey, 'discount']);

          setTotalCosts((prev) => ({
            ...prev,
            [rowKey]:
              calculateTotalCost(rowKey, quantity, discount, data.cost) || 0,
          }));
        }
      } catch (error: any) {
        notify('Failed to fetch item cost', 'error');
        setBaseCosts((prev) => ({ ...prev, [rowKey]: 0 }));
      }
    },
    [get],
  );

  // Handle adding a new row
  const handleAdd = async () => {
    try {
      // Validate the current form fields
      await itemForm.validateFields();

      // Get the current form values
      const itemValues = itemForm.getFieldsValue();
      const currentData = itemValues.data || {};

      // Update existing rows: set discount to 0 if undefined
      Object.keys(currentData).forEach((rowKey) => {
        if (!currentData[rowKey].discount) {
          // If discount is undefined or empty, set it to '0'
          itemForm.setFieldsValue({
            data: {
              [rowKey]: {
                ...currentData[rowKey],
                discount: '0', // Set as string to match Input component
              },
            },
          });
          // Recalculate total cost for this row
          handleRowTotalCost(rowKey);
        }
      });

      // Add the new row
      const newData = { key: String(count) };
      setDataSource([...dataSource, newData]);
      setCount(count + 1);
    } catch (error) {
      // Validation failed, do not add a new row
      console.error('Validation failed:', error);
    }
  };

  // Handle deleting a row
  const handleDelete = (key: React.Key) => {
    console.log({ dataSource });
    if (dataSource.length <= 1) {
      notify('Required minimum 1 order', 'warning');
      return;
    }
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    setBaseCosts((prev) => {
      const newCosts = { ...prev };
      delete newCosts[key as string];
      return newCosts;
    });
    setTotalCosts((prev) => {
      const newTotalCost = { ...prev };
      delete newTotalCost[key as string];
      return newTotalCost;
    });
    setModelName((prev: any) => {
      const newModelName = { ...prev };
      delete newModelName[key as string];
      return newModelName;
    });
  };

  // Calculate total cost based on base cost, quantity, and discount (per product)
  const calculateTotalCost = (
    rowKey: string,
    quantity: string,
    discount: string,
    baseCostValue?: number,
  ): number => {
    const baseCost = baseCostValue ? baseCostValue : baseCosts[rowKey] || 0; // Fallback to 0 if undefined
    const qty = parseFloat(quantity) || 0;
    const discPerProduct = parseFloat(discount) || 0;
    const totalCostBeforeDiscount = baseCost * qty;
    const totalDiscount = discPerProduct * qty;
    const totalCost = totalCostBeforeDiscount - totalDiscount;
    return totalCost > 0 ? totalCost : 0;
  };

  // Handle form field changes to fetch cost and update total
  const handleFieldChange = (changedFields: any, allFields: any) => {
    const rowData = allFields.data || {};
    Object.keys(rowData).forEach(async (rowKey) => {
      const row = rowData[rowKey];
      const changedField = Object.keys(changedFields.data?.[rowKey] || {})[0]; // Get the changed field name
      if (
        ['model', 'material', 'print_type', 'sleevecase', 'size'].includes(
          changedField,
        ) && // Only refetch for these fields
        row?.model &&
        row?.material &&
        row?.print_type &&
        // row?.sleevecase &&
        row?.size
      ) {
        const payload = {
          modelId: row.model,
          materialId: row.material,
          printId: row.print_type,
          sleeveCase: row.sleevecase,
        };
        await getItemCost(rowKey, payload);
      } else if (
        ['quantity', 'discount'].includes(changedField) || // Recalculate totals for these fields
        areAllFieldsFilled()
      ) {
        handleRowTotalCost(rowKey);
      }
      // Clear baseCosts for this row when model changes to avoid outdated cost
      if (changedField === 'model') {
        setBaseCosts((prev) => {
          const newCosts = { ...prev };
          delete newCosts[rowKey]; // Remove old cost
          return newCosts;
        });
      }
    });
  };

  const handleRowTotalCost = async (rowKey: string) => {
    const quantity = itemForm.getFieldValue(['data', rowKey, 'quantity']);
    const discount = itemForm.getFieldValue(['data', rowKey, 'discount']);
    const totalCost = calculateTotalCost(rowKey, quantity, discount);
    setTotalCosts((prev) => ({ ...prev, [rowKey]: totalCost || 0 }));
  };

  // Handle full submission
  const handleSubmit = async () => {
    const customerValues = await customerForm.validateFields();
    const itemValues = await itemForm.validateFields();
    const remarksValues = await remarksForm.validateFields();

    if (!customerValues || !itemValues || !remarksValues) {
      return;
    }

    setLoading(true);
    try {
      const items = Object.keys(itemValues.data || {})?.map((key) => {
        const row = itemValues.data[key];
        const item: any = {
          name: modelName[key],
          model: row.model,
          material: row.material,
          print_type_id: row.print_type,
          size: parseInt(row.size, 10),
          qty: parseInt(row.quantity, 10),
          discount: parseFloat(row.discount) || 0,
          total_item_cost: totalCosts[key],
        };

        if (modelName[key] !== 'SHORTS' && modelName[key] !== 'LOWER') {
          item.sleeve_case = row.sleevecase;
        }

        return item;
      });

      const { grandTotal } = calculateTotals();
      const { data } = await generateOrderId(get); // generate orderId

      const formData = new FormData();

      if (userType === 1) {
        formData.append('is_exist', 'false');
        formData.append('name', customerValues.customerName);
        formData.append('address1', customerValues.address1);
        formData.append('address2', customerValues.address2 || '');
        formData.append('mobile_number1', customerValues.mobile_number1);
        formData.append('mobile_number2', customerValues.mobile_number2 || '');
        formData.append('email', customerValues.email || '');
        formData.append('gst_no', customerValues.gstn || '');
        formData.append('business_name', customerValues.businessName);
      } else {
        formData.append('is_exist', 'true');
        formData.append('customer', customerValues.existingUser);
      }

      formData.append(
        'delivery_date',
        dayjs(remarksValues?.selectedDate).format('DD-MM-YYYY'),
      );
      formData.append('orderID', data?.order_number);
      formData.append('net_cost', grandTotal.toString());
      formData.append('remarks', remarksValues?.remarks);

      items.forEach((item, index) => {
        formData.append(`items[${index}][name]`, item.name);
        formData.append(`items[${index}][model]`, item.model.toString());
        formData.append(
          `items[${index}][material]`,
          item?.material?.toString(),
        );
        formData.append(
          `items[${index}][print_type]`,
          item.print_type_id.toString(),
        );
        formData.append(`items[${index}][size]`, item.size.toString());
        formData.append(`items[${index}][qty]`, item.qty.toString());
        formData.append(`items[${index}][discount]`, item.discount.toString());
        formData.append(
          `items[${index}][total_item_cost]`,
          item.total_item_cost.toString(),
        );

        // Append sleeve_case only if it exists
        if (item.sleeve_case !== undefined) {
          formData.append(`items[${index}][sleeve_case]`, item.sleeve_case);
        }
      });

      await newOrder(FormDataPost, formData);
      navigate(Paths.Staff.orders.index);
      notify('Order created successfully!', 'success');
    } catch (error) {
      notify('Failed to create order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Check if all required fields are filled
  const areAllFieldsFilled = () => {
    const rowData = itemForm.getFieldsValue().data || {};
    return (
      Object.keys(rowData).length > 0 &&
      Object.keys(rowData).every((rowKey) => {
        const row = rowData[rowKey];
        return (
          row?.model &&
          row?.material &&
          row?.print_type &&
          row?.sleevecase &&
          row?.size &&
          row?.quantity
        );
      })
    );
  };

  // Calculate totals for display
  const calculateTotals = () => {
    const rowData = itemForm.getFieldsValue().data || {};
    let subTotal = 0;
    Object.keys(rowData).forEach((rowKey) => {
      const row = rowData[rowKey];
      if (row?.quantity) {
        subTotal += calculateTotalCost(rowKey, row.quantity, row.discount);
      }
    });
    const cgst = subTotal * 0.025; // 2.5%
    const sgst = subTotal * 0.025; // 2.5%
    const grandTotal = subTotal + cgst + sgst;
    return { subTotal, cgst, sgst, grandTotal };
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
          className="!mb-0 w-[150px]"
        >
          <Select
            size="middle"
            placeholder="Select Model"
            onChange={(value: number, option: any) => {
              const selectedLabel = option.label;
              setTotalCosts((prev) => ({ ...prev, [record.key]: 0 }));
              // Clear material and sleeve fields when model changes
              itemForm.setFieldsValue({
                data: {
                  [record.key]: {
                    material: undefined,
                    sleevecase:
                      selectedLabel === 'SHORTS' || selectedLabel === 'LOWER'
                        ? undefined
                        : itemForm.getFieldValue([
                            'data',
                            record.key,
                            'sleevecase',
                          ]), // Reset sleeve only for SHORTS or LOWER
                  },
                },
              });
              getMaterials(value, record.key, selectedLabel);
            }}
            options={models?.map((model: any) => ({
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
          rules={[{ required: false, message: 'Please select a material' }]}
          className="!mb-0 w-[120px]"
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
          className="!mb-0 "
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
      render: (_, record) => {
        const selectedModelId = itemForm.getFieldValue([
          'data',
          record.key,
          'model',
        ]);
        const selectedModel = models.find(
          (model) => model.id === selectedModelId,
        );
        const isSleeveDisabled =
          selectedModel?.name === 'SHORTS' || selectedModel?.name === 'LOWER';

        return (
          <Form.Item
            name={['data', record.key, 'sleevecase']}
            rules={[
              {
                required: !isSleeveDisabled,
                message: 'Please select a sleeve',
              },
            ]}
            className="!mb-0"
          >
            <Select
              size="middle"
              placeholder="Select Sleeve"
              options={sleeve}
              disabled={isSleeveDisabled} // Disable if model is SHORTS or LOWER
            />
          </Form.Item>
        );
      },
    },
    {
      title: 'Size',
      dataIndex: 'size',
      render: (_, record) => (
        <Form.Item
          name={['data', record.key, 'size']}
          rules={[{ required: true, message: 'Please select a size' }]}
          className="!mb-0 "
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
        const sizeSelected = itemForm.getFieldValue([
          'data',
          record.key,
          'size',
        ]);

        return sizeSelected && baseCosts[record.key]
          ? baseCosts[record.key].toFixed(2)
          : '-';
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      render: (_, record) => (
        <Form.Item
          name={['data', record.key, 'quantity']}
          rules={[{ required: true, message: 'Please enter Quantity' }]}
          className="!mb-0 "
        >
          <Input
            placeholder="Enter Quantity"
            className="w-full h-9"
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ''); // Remove non-numeric characters
            }}
          />
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
          className="!mb-0 "
        >
          <Input
            placeholder="Enter Discount"
            className="w-full h-9"
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ''); // Remove non-numeric characters
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      align: 'center',
      width: '6%',
      render: (_, record) => {
        return (
          <>
            {/* <h5 className="text-xs">{quantity * baseCosts[record.key]}<span className="w-full text-right text-green-500">-{(quantity * discount)}</span></h5> */}
            <span className="text-base font-semibold">
              {totalCosts[record.key] ? totalCosts[record.key].toFixed(2) : '-'}
            </span>
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
          <div className="flex items-center justify-center gap-3">
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.key)}
            >
              <MdDeleteForever className="mx-auto cursor-pointer text-primary w-7 h-7" />
            </Popconfirm>
            {record.key === dataSource[dataSource.length - 1].key && (
              <FaPlus
                className="w-6 h-6 cursor-pointer text-secondary"
                onClick={handleAdd}
              />
            )}
          </div>
        ) : null,
    },
  ];

  // Function to disable dates before today
  const disabledDate = (current: any) => {
    // Disable dates before the start of today
    return current && current < dayjs().startOf('day');
  };

  // Initial data fetching on component mount
  useEffect(() => {
    getModels();
    getPrintTypes();
  }, [getModels, getPrintTypes]);

  const { subTotal, cgst, sgst, grandTotal } = calculateTotals();

  return (
    <div className="flex flex-col gap-4 custom-form">
      <div className="flex items-center justify-between pb-2 border-b-2">
        <div className="flex">
          <Breadcrumb rootClass="rounded" />
          <h3 className="text-2xl md:text-3xl font-bold text-[#191D23]">
            Create new order
          </h3>
        </div>
      </div>
      <CustomerDetails
        customerForm={customerForm}
        setLoading={setLoading}
        userType={userType}
        setUserType={setUserType}
      />
      {/* Item Details Table */}
      <div className="relative p-3 bg-white rounded-md md:p-5">
        <Form
          form={itemForm}
          onValuesChange={handleFieldChange}
          layout="vertical"
        >
          <h5 className="mb-4 text-xl font-medium">Item Details :</h5>
          <Table
            pagination={false}
            bordered
            dataSource={dataSource}
            columns={defaultColumns as ColumnTypes}
            scroll={{ x: 900 }}
          />
          {/* <div className="fixed z-50 shadow-lg bottom-5 right-5 w-fit">
            <Button
              title=""
              icon={<FaPlus className="w-5 h-5" />}
              handleClick={handleAdd}
              type="button"
              className="bg-secondary rounded-md w-full !px-6 text-white font-medium hover:!text-white/90 mx-auto hover:!bg-primary/95"
            />
          </div> */}
        </Form>
        {/* Totals Section */}
        <Form
          form={remarksForm}
          onValuesChange={handleFieldChange}
          layout="vertical"
          className=""
        >
          <div className="flex flex-col items-end mt-4">
            <div className="flex justify-between w-64">
              <span className="font-medium">Sub Total:</span>
              <span>{subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-64">
              <span className="font-medium">CGST (2.5%):</span>
              <span>{cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-64">
              <span className="font-medium">SGST (2.5%):</span>
              <span>{sgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-64 pt-2 mt-2 border-t">
              <span className="font-bold">Grand Total:</span>
              <span className="font-bold">{grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="grid justify-between grid-cols-1 gap-5 mt-3 md:grid-cols-3">
            <Form.Item
              name="selectedDate"
              label="Delivery Date"
              className="!mb-0"
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <DatePicker
                disabledDate={disabledDate}
                placeholder="Delivery Date"
                // onChange={handleDateChange} // Update state on change
                format="DD-MM-YYYY" // Display format
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item
              name="remarks"
              label="Remarks"
              className="md:col-span-2 !mb-0"
            >
              <Input.TextArea rows={4} placeholder="Enter Remarks here" />
            </Form.Item>
          </div>
        </Form>
      </div>
      <div className="w-full">
        <Button
          title="Submit"
          type="submit"
          loading={loading}
          handleClick={handleSubmit} // Trigger full submission
          className="bg-primary rounded-md w-full text-white h-12 font-medium hover:!text-white/90 mx-auto hover:!bg-primary/95"
        />
      </div>
    </div>
  );
};

const CustomerDetails: React.FC<any> = ({
  customerForm,
  setLoading,
  userType,
  setUserType,
}) => {
  const { get } = useApiJSON(); // Assuming useApiJSON provides get and post methods

  // GST pattern regex
  const GST_PATTERN =
    /^[0-3][0-9][A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  const [customers, setCustomers] = useState<any[]>([]); // Store existing customers
  const [customerDetails, setCustomerDetails] = useState<any>(null); // Store existing customers
  const [isBusinessNameDisabled, setIsBusinessNameDisabled] = useState(false); // Track if businessName is disabled
  const onChange = (e: any) => {
    setUserType(e.target.value);
  };

  // Fetch existing customers with search
  const fetchCustomers = useCallback(
    async (searchTerm: string = '') => {
      try {
        const { data } = await getCustomers(get, searchTerm);
        setCustomers(data);
      } catch (error: any) {
        notify('Failed to fetch existing customers', 'error');
      }
    },
    [get],
  );
  // const fetchCustomers = useCallback(
  //   async (searchTerm: string = '') => {
  //     try {
  //       const { data }: { data: [] } = await get(
  //         `/customers/?data=customer_list&search=${searchTerm}`,
  //       );
  //       setCustomers(data || []); // Assuming data is an array of customer objects
  //     } catch (error) {
  //       notify('Failed to fetch existing customers.', 'error');
  //     }
  //   },
  //   [get],
  // );

  // Handle GST verification
  const handleGSTVerification = async (gstn: string) => {
    setLoading(true);
    try {
      if (gstn) {
        const { data } = await GstVerification(gstn);
        if (data?.taxpayerInfo) {
          customerForm.setFieldsValue({
            businessName: data?.taxpayerInfo?.tradeNam,
          });
          setIsBusinessNameDisabled(true);
          notify('Business name auto-filled successfully!', 'success');
        } else {
          setIsBusinessNameDisabled(false);
          notify('Invalid GST Number or details not found.', 'error');
        }
      } else {
        setIsBusinessNameDisabled(false);
      }
    } catch (error) {
      setIsBusinessNameDisabled(false);
      notify('Failed to verify GST Number. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Debounced GST verification
  const debouncedGSTVerification = useCallback(
    debounce((value: string) => handleGSTVerification(value), 500),
    [handleGSTVerification],
  );

  // Handle GST input change
  const handleGSTChange = (value: string) => {
    if (value && GST_PATTERN.test(value)) {
      debouncedGSTVerification(value); // Only call if pattern matches
    } else {
      setIsBusinessNameDisabled(false); // Re-enable businessName if GST is invalid or empty
    }
  };

  // Handle search for existing customers
  const handleSearch = (searchTerm: string) => {
    fetchCustomers(searchTerm);
  };

  // Handle clear event to refetch full customer list
  const handleClear = () => {
    fetchCustomers(); // Refetch full list when cleared
  };

  // Fetch initial customer list on mount
  useEffect(() => {
    if (userType === 2) {
      fetchCustomers(); // Load initial customer list when "Existing User" is selected
    }
  }, [userType, fetchCustomers]);

  return (
    <Form
      form={customerForm}
      layout="vertical"
      className="p-3 bg-white rounded-md md:p-5"
    >
      <h5 className="mb-4 text-xl font-medium">
        Customer Details :
        <Radio.Group
          className="ml-5"
          onChange={onChange}
          value={userType}
          options={[
            { value: 1, label: <h6>New User</h6> },
            { value: 2, label: <h6>Existing User</h6> },
          ]}
        />
      </h5>

      {/* Conditional Rendering */}
      {userType === 1 && (
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
              disabled={isBusinessNameDisabled} // Controlled by GST verification
            />
          </Form.Item>

          <Form.Item
            className="!mb-0"
            label="Email"
            name="email"
            rules={[
              { required: false, message: 'Please enter your Email' },
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
            name="mobile_number1"
            rules={[
              { required: true, message: 'Please enter Mobile' },
              {
                pattern: /^\d{10}$/,
                message: 'Mobile must be exactly 10 digits',
              },
            ]}
          >
            <Input
              type="tel"
              placeholder="Enter mobile"
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /\D/g,
                  '',
                ); // Remove non-numeric characters
              }}
              className="w-full py-2 h-9 placeholder:text-gray-400"
            />
          </Form.Item>

          <Form.Item
            className="!mb-0"
            label="Mobile 2"
            name="mobile_number2"
            rules={[
              {
                validator: (_, value) =>
                  !value || /^\d{10}$/.test(value)
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error('Mobile must be exactly 10 digits'),
                      ),
              },
            ]}
          >
            <Input
              type="tel"
              placeholder="Enter mobile 2"
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  /\D/g,
                  '',
                ); // Remove non-numeric characters
              }}
              className="w-full py-2 h-9 placeholder:text-gray-400"
            />
          </Form.Item>

          <Form.Item
            className="!mb-0"
            label="GSTN (Optional)"
            name="gstn"
            rules={[
              { required: false },
              {
                pattern: GST_PATTERN,
                message: 'Please enter a valid GSTIN (e.g., 22ABCDE1234F1Z5)',
              },
            ]} // GST is now optional
          >
            <Input
              placeholder="Enter GST Number"
              className="w-full h-9"
              onChange={(e) => handleGSTChange(e.target.value)}
            />
          </Form.Item>
        </div>
      )}

      {userType === 2 && (
        <div>
          <Form.Item
            className="!mb-0"
            name="existingUser"
            rules={[{ required: true, message: 'Please select a user' }]}
          >
            <Select
              size="large"
              showSearch
              placeholder="Search for a user"
              className="h-full"
              allowClear
              onChange={(_value: number, option: any) => {
                setCustomerDetails(option?.data);
              }}
              onClear={handleClear} // Refetch list on clear
              onSearch={handleSearch} // Trigger search on typing
              filterOption={false} // Disable local filtering, rely on API
              options={customers?.map((customer) => ({
                value: customer.id, // Assuming customer has an id field
                label: customer.name, // Display customer name
                data: customer,
              }))}
            />
          </Form.Item>
          {customerDetails && (
            <div className="p-4 mt-2 bg-gray-100 rounded-md">
              <div className="grid grid-cols-1 gap-x-3 gap-y-1 md:grid-cols-2">
                <div>
                  <span className="font-semibold text-gray-950">
                    Customer Name:
                  </span>{' '}
                  {customerDetails?.name}
                </div>
                <div>
                  <span className="font-semibold text-gray-950">
                    Business Name:
                  </span>{' '}
                  {customerDetails?.business_name}
                </div>
                <div>
                  <span className="font-semibold text-gray-950">Address:</span>{' '}
                  {customerDetails?.address1} {customerDetails?.address2}
                </div>
                <div>
                  <span className="font-semibold text-gray-950">Mobile:</span>{' '}
                  {customerDetails?.mobile_number1}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Form>
  );
};

export default NewOrders;
