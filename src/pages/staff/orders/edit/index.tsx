import './style.css';

import Breadcrumb from '@components/Common/Breadcrumb';
import Button from '@components/Common/Button';
import { notify } from '@components/Common/Toastify';
import Paths from '@routes/paths';
import { useApiFormData, useApiJSON } from '@services/ApiService/Api.service';
import { getSleeveCaseConfig } from '@utils/sleeveCaseUtils'; // Adjust the import path
import {
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Select,
  Table,
  TableProps,
} from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FaPlus } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router';

import {
  fetchItemCost,
  fetchMaterial,
  fetchModels,
  fetchPrintTypes,
  orderById,
  updateOrderById,
} from './api';

type ColumnTypes = Exclude<TableProps['columns'], undefined>;

const NewOrders: React.FC = () => {
  const { get } = useApiJSON();
  const { put: FormDataPut } = useApiFormData();
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [itemForm] = Form.useForm();
  const [customerForm] = Form.useForm();
  const [remarksForm] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(1);
  const [orderDetails, setOrderDetails] = useState<any>({});

  const [models, setModels] = useState<any[]>([]);
  const [materialOptions, setMaterialOptions] = useState<Record<string, any[]>>(
    {},
  );
  const [printType, setPrintType] = useState<Record<string, any[]>>({});
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
  const [subtotalDiscount, setSubtotalDiscount] = useState<number>(0);
  const [sleeveConfigs, setSleeveConfigs] = useState<Record<string, any>>({});
  const [deletedItemIds, setDeletedItemIds] = useState<number[]>([]);

  // function to fetch order by ID
  const getOrderById = useCallback(async () => {
    if (orderId === null || orderId === undefined) return; // Skip if orderId is null

    try {
      const { data } = await orderById(get, orderId);

      setOrderDetails(data);
    } catch (error: any) {
      notify('Failed to fetch order details', 'error');
    }
  }, [get, orderId]);

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
    [get],
  );

  // Fetch print types
  const getPrintTypes = useCallback(
    async (modelId: string | number, rowKey: string) => {
      try {
        const { data } = await fetchPrintTypes(get, modelId);
        setPrintType((prev) => ({ ...prev, [rowKey]: data }));
      } catch (error: any) {
        setPrintType((prev) => ({ ...prev, [rowKey]: [] }));
        notify(error?.response?.data?.error, 'error');
      }
    },
    [get],
  );

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
        const cost = data.cost || 0;
        if (cost === 0) {
          notify(`Item is not valid`, 'warning');
        }

        // Update base cost first
        setBaseCosts((prev) => {
          const newCosts = { ...prev, [rowKey]: cost };
          return newCosts;
        });

        // Then update row total cost with the new base cost
        setTimeout(() => {
          const quantity = itemForm.getFieldValue(['data', rowKey, 'quantity']);
          if (quantity) {
            const newTotalCost = calculateRowTotalCost(rowKey, quantity, cost);
            setTotalCosts((prev) => ({
              ...prev,
              [rowKey]: newTotalCost,
            }));
          }
        }, 0);
      } catch (error: any) {
        notify(error?.response?.data?.error, 'error');
        setBaseCosts((prev) => ({ ...prev, [rowKey]: 0 }));
        setTotalCosts((prev) => ({ ...prev, [rowKey]: 0 }));
      }
    },
    [get, itemForm],
  );

  // Calculate row total cost based on base cost and quantity
  const calculateRowTotalCost = (
    rowKey: string,
    quantity: string,
    baseCostValue?: number,
  ): number => {
    const baseCost =
      baseCostValue !== undefined ? baseCostValue : baseCosts[rowKey] || 0;
    const qty = parseFloat(quantity) || 0;
    return baseCost * qty;
  };

  // Handle adding a new row
  const handleAdd = async () => {
    try {
      // Validate the current form fields
      await itemForm.validateFields();
      const newKey = String(count);

      // Get the current form values
      const itemValues = itemForm.getFieldsValue();
      const currentData = itemValues.data || {};

      // Check for invalid rows (totalCosts[rowKey] === 0)
      for (const rowKey of Object.keys(currentData)) {
        if (totalCosts[rowKey] === 0) {
          notify('Item is not valid', 'warning');
          return; // Stop execution, don't add new row
        }
      }

      // Add new row with initial sleeve config
      setDataSource([...dataSource, { key: newKey }]);
      setSleeveConfigs((prev) => ({
        ...prev,
        [newKey]: getSleeveCaseConfig(),
      }));

      setCount(count + 1);
    } catch (error) {
      // Validation failed, do not add a new row
      console.error('Validation failed:', error);
    }
  };

  const handleDelete = (key: React.Key) => {
    if (dataSource.length <= 1) {
      notify('Required minimum 1 order', 'warning');
      return;
    }

    // Check if the deleted item has an existing ID from the API
    const deletedItem = orderDetails?.items?.find(
      (_: any, index: number) => String(index) === String(key),
    );
    console.log(deletedItem, 'deletedItem');

    if (deletedItem?.id) {
      setDeletedItemIds((prev) => [...prev, deletedItem.id]);
    }

    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);

    // Clean up states for the deleted row
    setBaseCosts((prev) => {
      const { [key as string]: _, ...rest } = prev;
      return rest;
    });

    setTotalCosts((prev) => {
      const { [key as string]: _, ...rest } = prev;
      return rest;
    });

    setSleeveConfigs((prev) => {
      const { [key as string]: _, ...rest } = prev;
      return rest;
    });

    setModelName((prev: any) => {
      const { [key as string]: _, ...rest } = prev;
      return rest;
    });
  };

  // Handle form field changes
  const handleFieldChange = (changedFields: any, allFields: any) => {
    const rowData = allFields.data || {};
    Object.keys(rowData).forEach(async (rowKey) => {
      const row = rowData[rowKey];
      const changedField = Object.keys(changedFields.data?.[rowKey] || {})[0];

      // Check if cost-related fields changed
      if (
        ['model', 'material', 'print_type', 'sleevecase', 'size'].includes(
          changedField,
        )
      ) {
        // Get current model configuration
        const modelOption = models.find((m: any) => m.id === row?.model);
        const currentConfig = getSleeveCaseConfig(
          modelOption?.name,
          materialOptions[rowKey]?.find((m: any) => m.id === row?.material)
            ?.name,
        );

        // Build validation conditions
        const isModelValid = !!row?.model;
        const isSizeValid = !!row?.size;

        // Material validation
        const isMaterialValid =
          materialOptions[rowKey]?.length === 0 ||
          (!!row?.material &&
            materialOptions[rowKey]?.some((m: any) => m.id === row.material));

        // Print type validation
        const isPrintTypeValid =
          printType[rowKey]?.length === 0 ||
          (!!row?.print_type &&
            printType[rowKey]?.some((p: any) => p.id === row.print_type));

        // Sleeve validation considering config
        const isSleeveCaseValid = currentConfig.isDisabled || !!row?.sleevecase;

        // Check if all required fields are valid
        if (
          isModelValid &&
          isSizeValid &&
          isMaterialValid &&
          isPrintTypeValid &&
          isSleeveCaseValid
        ) {
          const payload = {
            modelId: row.model,
            materialId: row.material || null,
            printId: row.print_type || null,
            sleeveCase: currentConfig.isDisabled ? null : row.sleevecase,
          };

          // Add a small delay to ensure all state updates are processed
          setTimeout(() => {
            getItemCost(rowKey, payload);
          }, 100);
        }
      } else if (changedField === 'quantity') {
        const quantity = row.quantity;
        const currentBaseCost = baseCosts[rowKey] || 0;
        const newTotalCost = calculateRowTotalCost(
          rowKey,
          quantity,
          currentBaseCost,
        );

        setTotalCosts((prev) => ({
          ...prev,
          [rowKey]: newTotalCost,
        }));
      }
    });
  };

  // Handle subtotal discount change
  const handleDiscountChange = (value: string) => {
    const discount = parseFloat(value) || 0;
    setSubtotalDiscount(discount);
  };

  // Calculate totals for display with subtotal discount
  const calculateTotals = () => {
    const rowData = itemForm.getFieldsValue().data || {};
    let subTotal = 0;

    Object.keys(rowData).forEach((rowKey) => {
      const row = rowData[rowKey];
      if (row?.quantity) {
        subTotal += totalCosts[rowKey] || 0;
      }
    });

    // Apply subtotal discount
    const discountedSubtotal = Math.max(0, subTotal - subtotalDiscount);

    const cgst = discountedSubtotal * 0.025; // 2.5%
    const sgst = discountedSubtotal * 0.025; // 2.5%
    const grandTotal = discountedSubtotal + cgst + sgst;

    return {
      rawSubTotal: subTotal,
      subTotal: discountedSubtotal,
      discount: subtotalDiscount,
      cgst,
      sgst,
      grandTotal,
    };
  };

  // Handle full submission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (orderId === null || orderId === undefined) return; // Skip if orderId is null
      const itemValues = await itemForm.validateFields();
      const remarksValues = await remarksForm.validateFields();

      if (!itemValues || !remarksValues) {
        return;
      }

      const formData = new FormData();

      // Get current form values for items
      const currentData = itemValues.data || {};

      // Check for invalid rows (totalCosts[rowKey] === 0)
      for (const rowKey of Object.keys(currentData)) {
        if (totalCosts[rowKey] === 0) {
          notify(`Item is not valid`, 'warning');
          return; // Stop submission
        }
      }

      const { subTotal } = calculateTotals();
      console.log({ orderDetails });
      formData.append('orderID', orderDetails?.id);
      formData.append('customer', orderDetails?.customer?.id);
      formData.append(
        'delivery_date',
        dayjs(remarksValues?.selectedDate).format('YYYY-MM-DD'),
      );
      formData.append('net_cost', subTotal.toString());
      formData.append('remarks', remarksValues?.remarks || '');
      formData.append('discount', subtotalDiscount.toString());
      formData.append('deleted_item_ids', JSON.stringify(deletedItemIds));

      const items = Object.keys(itemValues.data || {}).map((key) => {
        const row = itemValues.data[key];
        const item: any = {
          name: modelName[key],
          model: row.model,
          material: row.material,
          print_type_id: row.print_type,
          size: parseInt(row.size, 10),
          qty: parseInt(row.quantity, 10),
          // discount: 0, // No per-product discount anymore
          total_item_cost: totalCosts[key],
        };

        if (
          modelName[key] !== 'SHORTS' &&
          modelName[key] !== 'LOWER' &&
          modelName[key] !== 'CAP'
        ) {
          item.sleeve_case = row.sleevecase;
        }

        return item;
      });

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
        // formData.append(`items[${index}][discount]`, item.discount.toString());
        formData.append(
          `items[${index}][total_item_cost]`,
          item.total_item_cost.toString(),
        );

        // Append sleeve_case only if it exists
        if (item.sleeve_case !== undefined) {
          formData.append(`items[${index}][sleeve_case]`, item.sleeve_case);
        }
      });

      // Call update API instead of create
      await updateOrderById(FormDataPut, formData);
      navigate(Paths.Staff.orders.index);
      notify('Order updated successfully!', 'success');
    } catch (error: any) {
      notify(error?.response?.data?.error, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Function to disable dates before today
  const disabledDate = (current: any) => {
    // Disable dates before the start of today
    return current && current < dayjs().startOf('day');
  };

  useEffect(() => {
    const initializeOrderData = async () => {
      if (orderDetails?.customer) {
        // Set customer form values for existing user
        customerForm.setFieldsValue({
          existingUser: {
            value: orderDetails.customer.id,
            label: orderDetails.customer.name,
          },
        });
      }
      if (orderDetails?.items?.length > 0) {
        // Set dataSource based on items
        const newDataSource = orderDetails.items.map(
          (_item: any, index: number) => ({
            key: String(index),
          }),
        );
        setDataSource(newDataSource);
        setCount(orderDetails.items.length);

        // Set itemForm values
        const itemFormValues: any = {
          data: {},
        };

        // Initialize form values for each item
        orderDetails.items.forEach((item: any, index: number) => {
          itemFormValues.data[String(index)] = {
            model: models.find((m) => m.name === item.model)?.id,
            material: item.material,
            print_type: item.print_type,
            sleevecase: item.sleeve_case,
            size: item.size,
            quantity: item.qty,
          };

          // Set base costs and total costs
          setBaseCosts((prev) => ({
            ...prev,
            [String(index)]: item.unit_cost,
          }));
          setTotalCosts((prev) => ({
            ...prev,
            [String(index)]: parseFloat(item.total_item_cost),
          }));

          // Fetch materials and print types for each item
          const modelId = models.find((m) => m.name === item.model)?.id;
          if (modelId) {
            getMaterials(modelId, String(index), item.model);
            getPrintTypes(modelId, String(index));
          }
        });

        itemForm.setFieldsValue(itemFormValues);

        // Set remarks form values
        remarksForm.setFieldsValue({
          selectedDate: dayjs(orderDetails.delivery_date),
          remarks: orderDetails.remarks,
        });

        // Set discount directly from orderDetails
        if (orderDetails.discount) {
          setSubtotalDiscount(parseFloat(orderDetails.discount));
          remarksForm.setFieldsValue({
            discount: orderDetails.discount,
          });
        }
      }
    };

    if (orderDetails?.id) {
      initializeOrderData();
    }
  }, [
    orderDetails,
    models,
    getMaterials,
    getPrintTypes,
    itemForm,
    remarksForm,
  ]);

  const { rawSubTotal, subTotal, cgst, sgst, grandTotal } = calculateTotals();

  // Columns definition
  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: 'MODEL',
      dataIndex: 'model',
      width: '15%',
      render: (_, record) => (
        <Form.Item
          name={['data', record.key, 'model']}
          rules={[{ required: true, message: 'Please select a model' }]}
          className="!mb-0 w-full"
        >
          <Select
            size="middle"
            placeholder="Select Model"
            onChange={(value: number, option: any) => {
              const selectedLabel = option.label;
              setTotalCosts((prev) => ({ ...prev, [record.key]: 0 }));

              // Get sleeve configuration based on model
              const newConfig = getSleeveCaseConfig(selectedLabel);
              setSleeveConfigs((prev) => ({
                ...prev,
                [record.key]: newConfig,
              }));

              // Reset form values
              itemForm.setFieldsValue({
                data: {
                  [record.key]: {
                    material: undefined,
                    print_type: undefined,
                    sleevecase: newConfig.isDisabled
                      ? undefined
                      : itemForm.getFieldValue([
                          'data',
                          record.key,
                          'sleevecase',
                        ]),
                    size: undefined,
                    quantity: undefined,
                  },
                },
              });

              getMaterials(value, record.key, selectedLabel);
              getPrintTypes(value, record.key);
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
      width: '15%',
      render: (_, record) => (
        <Form.Item
          name={['data', record.key, 'material']}
          rules={[
            {
              required: materialOptions[record.key]?.length == 0 ? false : true,
              message: 'Please select a material',
            },
          ]}
          className="!mb-0 w-full"
        >
          <Select
            disabled={materialOptions[record.key]?.length == 0}
            size="middle"
            placeholder="Select Material"
            options={
              materialOptions[record.key]?.map((material: any) => ({
                value: material.id,
                label: material.name,
              })) || []
            }
            onChange={(_, option: any) => {
              const modelOption = models.find(
                (m: any) =>
                  m.id ===
                  itemForm.getFieldValue(['data', record.key, 'model']),
              );

              // Update sleeve config based on both model and material
              const newConfig = getSleeveCaseConfig(
                modelOption?.name,
                option?.label,
              );
              setSleeveConfigs((prev) => ({
                ...prev,
                [record.key]: newConfig,
              }));

              // Clear sleeve selection if the new config disables sleeves
              if (newConfig.isDisabled) {
                itemForm.setFieldsValue({
                  data: {
                    [record.key]: {
                      ...itemForm.getFieldValue(['data', record.key]),
                      sleevecase: undefined,
                    },
                  },
                });
              }
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: 'PRINT TYPE',
      dataIndex: 'printType',
      width: '15%',
      render: (_, record) => (
        <Form.Item
          name={['data', record.key, 'print_type']}
          rules={[
            {
              required: printType[record.key]?.length == 0 ? false : true,
              message: 'Please select a print type',
            },
          ]}
          className="!mb-0 w-full"
        >
          <Select
            disabled={printType[record.key]?.length == 0 ? true : false}
            size="middle"
            placeholder="Select Print Type"
            options={
              printType[record.key]?.map((type: any) => ({
                value: type.id,
                label: type.name,
              })) || []
            }
          />
        </Form.Item>
      ),
    },
    {
      title: 'SLEEVE',
      dataIndex: 'sleeve',
      width: '13%',
      render: (_, record) => {
        const currentConfig =
          sleeveConfigs[record.key] || getSleeveCaseConfig();

        return (
          <Form.Item
            name={['data', record.key, 'sleevecase']}
            rules={[
              ({ getFieldValue }) => ({
                validator: async (_, value) => {
                  const modelId = getFieldValue(['data', record.key, 'model']);
                  const materialId = getFieldValue([
                    'data',
                    record.key,
                    'material',
                  ]);

                  const modelOption = models.find((m) => m.id === modelId);
                  const materialOption = materialOptions[record.key]?.find(
                    (m: any) => m.id === materialId,
                  );

                  const config = getSleeveCaseConfig(
                    modelOption?.name,
                    materialOption?.name,
                  );

                  if (config.isDisabled) {
                    return Promise.resolve();
                  }

                  if (!value && !config.isDisabled) {
                    return Promise.reject('Please select a sleeve type');
                  }

                  return Promise.resolve();
                },
              }),
            ]}
            className="!mb-0 !w-full"
          >
            <Select
              size="middle"
              placeholder="Select Sleeve"
              options={currentConfig.options}
              disabled={currentConfig.isDisabled}
            />
          </Form.Item>
        );
      },
    },
    {
      title: 'Size',
      dataIndex: 'size',
      width: '2%',
      render: (_, record) => (
        <Form.Item
          name={['data', record.key, 'size']}
          rules={[{ required: true, message: 'Please select a size' }]}
          className="!mb-0 w-[80px]"
        >
          <Select size="middle" placeholder="Select size" options={size} />
        </Form.Item>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      align: 'center',
      width: '8%',
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
      width: '8%',
      render: (_, record) => (
        <Form.Item
          name={['data', record.key, 'quantity']}
          rules={[{ required: true, message: 'Please enter Quantity' }]}
          className="!mb-0"
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
      title: 'Total',
      dataIndex: 'total',
      align: 'center',
      render: (_, record) => {
        return (
          <span className="text-base font-semibold">
            {totalCosts[record.key] ? totalCosts[record.key].toFixed(2) : '-'}
          </span>
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

  // Initial data fetching on component mount
  useEffect(() => {
    getModels();
    getOrderById();
  }, [getModels, getOrderById]);

  return (
    <>
      <Helmet>
        <title>KICKOFF SPORTS WEAR - New Orders </title>
      </Helmet>
      <div className="flex flex-col gap-4 custom-form">
        <div className="flex items-center justify-between pb-2 border-b-2">
          <div className="flex">
            <Breadcrumb rootClass="rounded" />
            <h3 className="text-2xl md:text-3xl font-bold text-[#191D23]">
              Create new order
            </h3>
          </div>
        </div>
        <CustomerDetails customerData={orderDetails?.customer} />
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
          </Form>

          {/* Totals Section with subtotal discount */}
          <Form form={remarksForm} layout="vertical" className="">
            <div className="flex flex-col items-end mt-4">
              <div className="flex justify-between w-64">
                <span className="font-medium">Raw Subtotal:</span>
                <span>{rawSubTotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between w-64">
                <span className="font-medium">Discount:</span>
                <Form.Item
                  name="discount"
                  className="!mb-0"
                  rules={[
                    {
                      validator: (_, value) =>
                        value && parseFloat(value) < 0
                          ? Promise.reject(new Error('Cannot be negative'))
                          : Promise.resolve(),
                    },
                    {
                      validator: (_, value) =>
                        value && isNaN(parseFloat(value))
                          ? Promise.reject(new Error('Must be a valid number'))
                          : Promise.resolve(),
                    },
                    {
                      validator: (_, value) =>
                        value && parseFloat(value) > rawSubTotal
                          ? Promise.reject(new Error('Cannot exceed total'))
                          : Promise.resolve(),
                    },
                  ]}
                >
                  <Input
                    placeholder="0.00"
                    className="w-32 text-right h-9"
                    value={subtotalDiscount || ''}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(
                        /[^0-9.]/g,
                        '',
                      );
                    }}
                  />
                </Form.Item>
              </div>

              <div className="flex justify-between w-64">
                <span className="font-medium">Subtotal:</span>
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
                  format="DD-MM-YYYY"
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
            handleClick={handleSubmit}
            className="bg-primary rounded-md w-full text-white h-12 font-medium hover:!text-white/90 mx-auto hover:!bg-primary/95"
          />
        </div>
      </div>
    </>
  );
};

const CustomerDetails: React.FC<any> = ({ customerData }) => {
  return (
    <div className="p-3 bg-gray-100 rounded-md md:p-5">
      <h5 className="mb-4 text-xl font-medium">Customer Details</h5>
      {customerData && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid grid-cols-1 gap-x-3 gap-y-2">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Customer Name</span>
              <span className="font-medium">{customerData.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Business Name</span>
              <span className="font-medium">{customerData.business_name}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Email</span>
              <span className="font-medium">{customerData.email || '-'}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-3 gap-y-2">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Address</span>
              <span className="font-medium">
                {customerData.address1}
                {customerData.address2 && `, ${customerData.address2}`}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Mobile Numbers</span>
              <span className="font-medium">
                {customerData.mobile_number1}
                {customerData.mobile_number2 &&
                  `, ${customerData.mobile_number2}`}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">GST Number</span>
              <span className="font-medium">{customerData.gst_no || '-'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewOrders;
