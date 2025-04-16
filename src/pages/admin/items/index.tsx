import './style.css';

import Button from '@components/Common/Button';
import { notify } from '@components/Common/Toastify';
import { useApiJSON } from '@services/ApiService/Api.service';
import { Form, Input, Pagination, Select, Table } from 'antd';
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

interface Item {
  id: string;
  model: string;
  material: string;
  printType: string;
  sleeve: string;
  price: number;
  itemCode: string;
  key: number;
  slNo: number;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  record: Item;
  index: number;
  children: React.ReactNode;
}

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
  const [editingKey, setEditingKey] = useState<string>('');

  const [modelOptions, setModelOptions] = useState<any[]>([]);
  const [materialOptions, setMaterialOptions] = useState<any[]>([]);
  const [printTypeOptions, setPrintTypeOptions] = useState<any[]>([]);

  const isEditing = (record: any) => record.id === editingKey;

  const edit = async (record: any) => {
    try {
      // Get the modelId from the record first
      const [modelResponse] = await Promise.all([fetchModels(get)]);

      // Find the model option that matches the record's model name
      const modelOption = modelResponse.data.find(
        (model: any) => model.name === record.model,
      );

      if (!modelOption) {
        throw new Error('Model not found');
      }

      const modelId = modelOption.id;

      // Now fetch materials and print types with the modelId
      const [materialResponse, printTypeResponse] = await Promise.all([
        fetchMaterial(get, modelId),
        fetchPrintTypes(get, modelId),
      ]);

      // Set options in state
      setModelOptions(
        modelResponse.data.map((item: any) => ({
          value: item.id,
          label: item.name,
        })),
      );

      setMaterialOptions(
        materialResponse.data.map((item: any) => ({
          value: item.id,
          label: item.name,
        })),
      );

      setPrintTypeOptions(
        printTypeResponse.data.map((item: any) => ({
          value: item.id,
          label: item.name,
        })),
      );

      // Set form values
      itemForm.setFieldsValue({
        model: modelId, // Use the modelId instead of model name
        material: record.material,
        printType: record.printType,
        sleeve: record.sleeve,
        price: record.price,
      });

      setEditingKey(record.id);
    } catch (error) {
      notify('Failed to fetch options', 'error');
    }
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: string) => {
    try {
      const row = await itemForm.validateFields();
      const newData = [...itemsList];
      const index = newData.findIndex((item) => key === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setItemsList(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    record,
    index,
    children,
    ...restProps
  }: EditableCellProps) => {
    let inputNode;

    switch (dataIndex) {
      case 'model':
        inputNode = (
          <Select
            options={modelOptions}
            style={{ width: '100%' }}
            placeholder={`Select ${title}`}
          />
        );
        break;
      case 'material':
        inputNode = (
          <Select
            options={materialOptions}
            style={{ width: '100%' }}
            placeholder={`Select ${title}`}
          />
        );
        break;
      case 'printType':
        inputNode = (
          <Select
            options={printTypeOptions}
            style={{ width: '100%' }}
            placeholder={`Select ${title}`}
          />
        );
        break;
      case 'sleeve':
        inputNode = (
          <Select
            options={[
              { value: 'full', label: 'Full Sleeve' },
              { value: 'sleeveless', label: 'Sleeveless' },
              { value: 'half', label: 'Half Sleeve' },
            ]}
            style={{ width: '100%' }}
            placeholder={`Select ${title}`}
          />
        );
        break;
      case 'price':
        inputNode = (
          <Input
            type="number"
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
            }}
          />
        );
        break;
      default:
        inputNode = <Input />;
    }

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const columns = [
    {
      title: 'Sl No.',
      dataIndex: 'slNo',
      key: 'slNo',
      editable: false,
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
      editable: true,
    },
    {
      title: 'Material',
      dataIndex: 'material',
      key: 'material',
      editable: true,
    },
    {
      title: 'Print Type',
      dataIndex: 'printType',
      key: 'printType',
      editable: true,
    },
    {
      title: 'Sleeve',
      dataIndex: 'sleeve',
      key: 'sleeve',
      editable: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      editable: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 170,
      render: (_: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <span className="flex gap-2">
            <Button
              handleClick={() => save(record.id)}
              type="submit"
              className="text-white bg-primary"
              title="Save"
            />
            <Button
              handleClick={cancel}
              type="button"
              className="text-white bg-red-500"
              title="Cancel"
            />
          </span>
        ) : (
          <FaRegEdit
            className="w-8 h-8 p-1 cursor-pointer"
            onClick={() => edit(record)}
          />
        );
      },
    },
  ].map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

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

  const tableDataSource = itemsList?.map((item: any, i: number) => ({
    key: i,
    slNo: i + 1,
    model: item?.model,
    material: item?.material,
    printType: item?.print_type,
    sleeve: item?.is_sleeve,
    price: item?.item_cost,
    itemCode: item?.item_code,
    id: item?.id,
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
          <Form form={itemForm}>
            <Table
              className="mt-6"
              bordered
              dataSource={tableDataSource}
              columns={columns}
              pagination={false}
              scroll={{ x: '700' }}
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              rowClassName={(record) =>
                isEditing(record) ? 'editable-row' : ''
              }
            />
          </Form>
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
