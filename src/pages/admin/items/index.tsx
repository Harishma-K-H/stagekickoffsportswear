import './style.css';

import Button from '@components/Common/Button';
import { notify } from '@components/Common/Toastify';
import { useApiJSON } from '@services/ApiService/Api.service';
import { Form, Input, Pagination, Popconfirm, Select, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';

import {
  fetchBranches,
  fetchMaterial,
  fetchModels,
  fetchPrintTypes,
  items,
  newItem,
  updateItem,
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
  dataName: string;
  title: string;
  record: Item;
  index: number;
  children: React.ReactNode;
}

const Items: React.FC = () => {
  const { get, put } = useApiJSON();

  const [editItemForm] = Form.useForm();
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

  const getMaterialsForModel = useCallback(
    async (modelId: string | number) => {
      if (!modelId) return;
      try {
        const { data } = await fetchMaterial(get, modelId);
        setMaterialOptions(
          data.map((item: any) => ({
            value: item.id,
            label: item.name,
          })),
        );
      } catch (error: any) {
        setMaterialOptions([]);
        notify(error?.response?.data?.error, 'error');
      }
    },
    [get],
  );

  const getPrintTypesForModel = useCallback(
    async (modelId: string | number) => {
      try {
        const { data } = await fetchPrintTypes(get, modelId);
        setPrintTypeOptions(
          data.map((item: any) => ({
            value: item.id,
            label: item.name,
          })),
        );
      } catch (error: any) {
        setPrintTypeOptions([]);
        notify(error?.response?.data?.error, 'error');
      }
    },
    [get],
  );

  const edit = async (record: any) => {
    try {
      // Get the modelId from the record first
      const modelResponse = await fetchModels(get);
      const modelId = record.model; // Use the ID directly since we have it

      // Now fetch materials and print types with the modelId
      await Promise.all([
        getMaterialsForModel(modelId),
        getPrintTypesForModel(modelId),
      ]);

      // Set options in state
      setModelOptions(
        modelResponse.data.map((item: any) => ({
          value: item.id,
          label: item.name,
        })),
      );

      // Set form values using IDs
      editItemForm.setFieldsValue({
        model: record.model, // ID
        material: record.material, // ID
        printType: record.printType, // ID
        sleevecase: record.sleevecase,
        price: record.price,
        branch: record.branch, // ID
      });

      setEditingKey(record.id);
    } catch (error) {
      notify('Failed to fetch options', 'error');
    }
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = useCallback(
    async (key: any) => {
      try {
        const row = await editItemForm.validateFields();
        const modelName = modelOptions.find((m) => m.value == row.model)?.label;

        // Perform your submit logic here
        const payload = {
          name: modelName,
          ...row,
        };

        await updateItem(put, payload, key);
        await getItems();
        notify('item updated successfully', 'success');
        setEditingKey('');
      } catch (error: any) {
        notify(error?.response?.data?.error, 'error');
      }
    },
    [put, modelOptions, editItemForm],
  );

  const EditableCell = ({
    editing,
    dataIndex,
    dataName,
    title,
    record,
    index,
    children,
    ...restProps
  }: EditableCellProps) => {
    let inputNode;
    let rules = [{ required: true, message: `Please Input ${title}!` }];

    switch (dataName) {
      case 'model':
        inputNode = (
          <Select
            options={modelOptions}
            style={{ width: '100%' }}
            placeholder={`Select ${title}`}
            onChange={async (value: number) => {
              // Clear existing material and print type selections
              editItemForm.setFieldsValue({
                material: undefined,
                printType: undefined,
              });

              // Fetch new options based on selected model
              await Promise.all([
                getMaterialsForModel(value),
                getPrintTypesForModel(value),
              ]);
            }}
          />
        );
        break;
      case 'material':
        rules = [
          {
            required: materialOptions?.length > 0,
            message: `Please Input ${title}!`,
          },
        ];
        inputNode = (
          <Select
            options={materialOptions}
            style={{ width: '100%' }}
            placeholder={`Select ${title}`}
            disabled={materialOptions?.length == 0 ? true : false}
          />
        );
        break;
      case 'printType':
        rules = [
          {
            required: printTypeOptions?.length > 0,
            message: `Please Input ${title}!`,
          },
        ];
        inputNode = (
          <Select
            options={printTypeOptions}
            style={{ width: '100%' }}
            placeholder={`Select ${title}`}
            disabled={printTypeOptions?.length == 0 ? true : false}
          />
        );
        break;
      case 'sleevecase':
        rules = [
          {
            required: false,
            message: `Please Input ${title}!`,
          },
        ];
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
      case 'branch':
        inputNode = (
          <Select
            options={branches.map((item: any) => ({
              value: item.id,
              label: item.name,
            }))}
            style={{ width: '100%' }}
            placeholder={`Select ${title}`}
            disabled={!editItemForm.getFieldValue('model')}
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
          <Form.Item name={dataName} rules={rules}>
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const columns: any = [
    {
      title: 'Sl No.',
      dataIndex: 'slNo',
      dataName: 'slNo',
      key: 'slNo',
      editable: false,
      width: '5%',
      align: 'center',
    },
    {
      title: 'Model',
      dataIndex: 'model_name',
      dataName: 'model',
      key: 'model',
      editable: true,
      width: '14%',
    },
    {
      title: 'Material',
      dataIndex: 'material_name',
      dataName: 'material',
      key: 'material',
      editable: true,
      width: '14%',
    },
    {
      title: 'Print Type',
      dataIndex: 'printType_name',
      dataName: 'printType',
      key: 'printType',
      editable: true,
      width: '14%',
    },
    {
      title: 'Sleeve',
      dataIndex: 'sleevecase',
      dataName: 'sleevecase',
      key: 'sleevecase',
      editable: true,
      width: '14%',
    },
    {
      title: 'Branch',
      dataIndex: 'branch_name',
      dataName: 'branch',
      key: 'branch',
      editable: true,
      width: '14%',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      dataName: 'price',
      key: 'price',
      width: '14%',
      editable: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      dataName: 'action',
      key: 'action',
      width: 170,
      render: (_: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <span className="flex gap-2">
            <Popconfirm title="Sure to Save?" onConfirm={() => save(record.id)}>
              <h2
                className="w-full font-semibold text-white rounded-md bg-primary px-4 py-3 flex items-center"
                title="Save"
              >
                Save
              </h2>
            </Popconfirm>
            <Popconfirm title="Sure to Cancel?" onConfirm={cancel}>
              <h2
                className="w-full font-semibold text-white rounded-md bg-primary px-4 py-3 flex items-center"
                title="Save"
              >
                Cancel
              </h2>
            </Popconfirm>
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
        dataName: col.dataName,
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
  }, [get, pageNumber, pageSize, selectedBranch, save]);

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
    model_name: item?.model_name,
    model: item?.model,
    material_name: item?.material_name,
    material: item?.material,
    printType_name: item?.print_type_name,
    printType: item?.print_type,
    sleevecase: item?.sleevecase,
    price: item?.item_cost,
    itemCode: item?.item_code,
    id: item?.id,
    branch_name: item?.branch?.name,
    branch: item?.branch?.id,
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
                    editItemForm.setFieldValue('branch', null);
                  } else {
                    editItemForm.setFieldValue('branch', option.value);
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
          <Form form={editItemForm}>
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
        await newItem(post, payload);
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
        // rules={[{ required: true, message: 'Please select a model' }]}
      >
        <Select size="middle" placeholder="Select Sleeve" options={sleeve} />
      </Form.Item>
      <Form.Item
        name="branch"
        className="!mb-0 w-full"
        rules={[{ required: true, message: 'Please select a branch' }]}
      >
        <Select
          placeholder="Select a branch"
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
