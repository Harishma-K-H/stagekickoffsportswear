import './style.css';

import Button from '@components/Common/Button';
import { notify } from '@components/Common/Toastify';
import { useApiJSON } from '@services/ApiService/Api.service';
import { Form, Input, Pagination, Select, Table } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';

import {
  fetchBranches,
  fetchMaterial,
  fetchModels,
  fetchPrintTypes,
  items,
  newItem,
} from './api';

const Items: React.FC = () => {
  const { get } = useApiJSON();

  const [itemForm] = Form.useForm();
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<{
    value: string;
    label: string;
  }>({ value: '', label: '' });

  const [itemsList, setItemsList] = useState<any>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [paginationData, setPaginationData] = useState({
    count: 0,
    hasPreviousPage: false,
    hasNextPage: false,
    pageNumber: pageNumber,
    pageSize: pageSize,
  });

  const columns = [
    {
      title: 'Sl No.',
      dataIndex: 'slNo',
      key: 'slNo',
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Material',
      dataIndex: 'material',
      key: 'material',
    },
    {
      title: 'Print Type',
      dataIndex: 'printType',
      key: 'printType',
    },
    {
      title: 'Sleeve',
      dataIndex: 'sleeve',
      key: 'sleeve',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 170,
      render: (_: any, _record: any) => {
        return <FaRegEdit className="w-8 h-8 p-1" />;
      },
    },
  ];

  // Fetch branch
  const getBranches = useCallback(async () => {
    try {
      const { data } = await fetchBranches(get);
      setBranches(data);
    } catch (error: any) {
      notify('Failed to fetch models', 'error');
    }
  }, [get]);

  // Fetch item list
  const getItems = useCallback(async () => {
    try {
      const { data } = await items(
        get,
        pageNumber,
        pageSize,
        selectedBranch?.value,
      );
      setItemsList(data.results);
      setPaginationData({
        count: data?.count,
        hasPreviousPage: data?.hasPreviousPage,
        hasNextPage: data?.hasNextPage,
        pageNumber: data?.pageNumber,
        pageSize: data?.pageSize,
      });
    } catch (error: any) {
      notify('Failed to fetch data', 'error');
    }
  }, [get, pageNumber, pageSize, selectedBranch]);

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  const onShowSizeChange = useCallback((current: number, pageSize: number) => {
    setPageSize(pageSize);
    setPageNumber(current);
  }, []);

  const tableDataSource = itemsList?.map((order: any, i: number) => ({
    key: i,
    slNo: i + 1,
    OrderId: order?.orderID,
    customerName: order?.customer?.name,
    orderDate: dayjs(order?.order_date).format('DD-MM-YYYY'),
    deliveryDate: dayjs(order?.delivery_date).format('DD-MM-YYYY'),
    payment_details: order?.payment_details, // Pass payment_details to the record
    total_cost: order?.total_cost, // Pass total_cost to the record
  }));

  // Initial data fetching on component mount
  useEffect(() => {
    getItems();
  }, [getItems]);

  // Initial data fetching on component mount
  useEffect(() => {
    getBranches();
  }, [getBranches]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b-2">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#191D23]">
              Items List {selectedBranch.label}
            </h3>
          </div>
          <Form.Item name="branch" label="Branch" className="!mb-0">
            <Select
              onChange={(
                _value: string,
                option?:
                  | { value: any; label: any }
                  | { value: any; label: any }[],
              ) => {
                if (option && !Array.isArray(option)) {
                  setSelectedBranch(option as { value: string; label: string });
                  if (option.value === '') {
                    itemForm.setFieldValue('branch', null);
                  } else {
                    itemForm.setFieldValue('branch', option.value);
                  }
                }
              }}
              placeholder="Select a branch"
              size="large"
              defaultValue={''}
              options={[{ id: '', name: 'All' }, ...branches]?.map(
                (model: any) => ({
                  value: model.id,
                  label: model.name,
                }),
              )}
              className="w-full min-w-[230px]"
            />
          </Form.Item>
        </div>
        <div className="p-3 bg-white md:p-5 custom-table">
          <ItemForm branches={branches} form={itemForm} />
          <Table
            className="mt-6"
            bordered
            dataSource={tableDataSource}
            columns={columns}
            pagination={false}
            scroll={{ x: '700' }}
          />
          <Pagination
            current={paginationData.pageNumber}
            total={paginationData.count}
            pageSize={paginationData.pageSize}
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            onChange={handlePageChange}
            rootClassName="w-fit mx-auto lg:ml-auto lg:mr-0 mt-5 lg:mt-1"
          />
        </div>
      </div>
    </>
  );
};

interface ItemFormProps {
  branches: { id: string; name: string }[];
  form: any;
}

const ItemForm: React.FC<ItemFormProps> = ({ branches, form }) => {
  const { get, post } = useApiJSON();

  const [modelName, setModelName] = useState<string>('');
  const [models, setModels] = useState<any[]>([]);
  const [materialOptions, setMaterialOptions] = useState<string[]>([]);
  const [printType, setPrintType] = useState<string[]>([]);
  const [sleeve] = useState<any[]>([
    { value: 'full', label: 'Full Sleeve' },
    { value: 'sleeveless', label: 'Sleeveless' },
    { value: 'half', label: 'Half Sleeve' },
  ]);

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
    async (modelId: string | number) => {
      if (!modelId) return;
      try {
        const { data } = await fetchMaterial(get, modelId);
        setMaterialOptions(data);
      } catch (error: any) {
        setMaterialOptions([]);
        notify(error?.response?.data?.error, 'error');
      }
    },
    [get],
  );

  // Fetch print types
  const getPrintTypes = useCallback(
    async (modelId: string | number) => {
      try {
        const { data } = await fetchPrintTypes(get, modelId);
        setPrintType(data);
      } catch (error: any) {
        setPrintType([]);
        notify(error?.response?.data?.error, 'error');
      }
    },
    [get],
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (values: any) => {
      try {
        // Perform your submit logic here
        const payload = {
          name: modelName,
          ...values,
        };
        console.log({ modelName });

        await newItem(post, payload);
        console.log('Form submitted with values:', values);
        notify('Form submitted successfully', 'success');
      } catch (error: any) {
        notify(error?.response?.data?.error, 'error');
      }
    },
    [modelName, post, form],
  );

  // Initial data fetching on component mount
  useEffect(() => {
    getModels();
  }, [getModels]);

  return (
    <Form
      className="grid grid-cols-3 md:grid-cols-6 gap-4 gap-y-3"
      form={form}
      onFinish={handleSubmit}
    >
      <Form.Item
        name={'model'}
        rules={[{ required: true, message: 'Please select a model' }]}
        className="!mb-0 w-full"
      >
        <Select
          size="middle"
          placeholder="Select Model"
          onChange={(value: number, option: any) => {
            setModelName(option.label);
            getMaterials(value);
            getPrintTypes(value);

            form.setFieldsValue({
              material: undefined,
              print_type: undefined,
            });
          }}
          options={models?.map((model: any) => ({
            value: model.id,
            label: model.name,
          }))}
        />
      </Form.Item>
      <Form.Item
        name="material"
        className="!mb-0 w-full"
        rules={[
          {
            required: materialOptions?.length == 0 ? false : true,
            message: 'Please select a material',
          },
        ]}
      >
        <Select
          disabled={materialOptions?.length == 0 ? true : false}
          size="middle"
          placeholder="Select Material"
          options={
            materialOptions?.map((material: any) => ({
              value: material.id,
              label: material.name,
            })) || []
          }
        />
      </Form.Item>
      <Form.Item
        name={'print_type'}
        className="!mb-0  w-full"
        rules={[
          {
            required: printType?.length == 0 ? false : true,
            message: 'Please select a print type',
          },
        ]}
      >
        <Select
          disabled={printType?.length == 0 ? true : false}
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
      <Form.Item
        name={'sleevecase'}
        className="!mb-0  w-full"
        rules={[{ required: true, message: 'Please select a model' }]}
      >
        <Select size="middle" placeholder="Select Sleeve" options={sleeve} />
      </Form.Item>
      <Form.Item
        name="branch"
        className="!mb-0 w-full"
        rules={[{ required: true, message: 'Please select a branch' }]}
        // initialValue={selectedBranch.value}
      >
        <Select
          placeholder="Select a branch"
          // value={selectedBranch.value}
          options={branches?.map((model: any) => ({
            value: model.id,
            label: model.name,
          }))}
        />
      </Form.Item>
      <Form.Item
        name={'item_cost'}
        rules={[{ required: true, message: 'Please enter the item cost' }]}
        className="!mb-0  w-full"
      >
        <Input
          placeholder="Enter item cost"
          className="w-full h-9"
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ''); // Remove non-numeric characters
          }}
        />
      </Form.Item>
      <Button
        title="Submit"
        type="submit"
        className="w-full col-span-3 md:col-span-6 font-semibold text-white rounded-md bg-primary"
      ></Button>
    </Form>
  );
};

export default Items;
