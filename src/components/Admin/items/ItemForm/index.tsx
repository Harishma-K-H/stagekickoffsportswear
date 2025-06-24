import Button from '@components/Common/Button';
import { Form, Input, Select } from 'antd';
import React from 'react';

interface ItemFormProps {
  form: any;
  models: any[];
  materialOptions: any[];
  printTypeOptions: any[];
  getMaterials: (modelId: string | number) => void;
  getPrintTypes: (modelId: string | number) => void;
  onFinish: (values: any) => void;
  editingItemId: number | null;
}

const SLEEVE_OPTIONS = [
  { value: 'full', label: 'Full Sleeve' },
  { value: 'sleeveless', label: 'Sleeveless' },
  { value: 'half', label: 'Half Sleeve' },
];

const ItemForm: React.FC<ItemFormProps> = ({
  form,
  models,
  materialOptions,
  printTypeOptions,
  getMaterials,
  getPrintTypes,
  onFinish,
  editingItemId,
}) => {
  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="horizontal"
      className="grid grid-cols-1 gap-4 md:grid-cols-5"
    >
      <Form.Item
        name="model"
        rules={[{ required: true, message: 'Please select a model' }]}
        className="!mb-0 w-full"
      >
        <Select
          size="large"
          placeholder="Select Model"
          onChange={(value: number) => {
            // When model changes, reset material and print type
            form.setFieldsValue({
              material: undefined,
              print_type: undefined,
            });

            // Then fetch options for the new model
            getMaterials(value);
            getPrintTypes(value);
          }}
          options={models?.map((model) => ({
            value: model.id,
            label: model.name,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="material"
        rules={[{ required: true, message: 'Please select a material' }]}
        className="!mb-0 w-full"
      >
        <Select
          size="large"
          placeholder="Select Material"
          options={
            materialOptions?.map((material) => ({
              value: material.id,
              label: material.name,
            })) || []
          }
        />
      </Form.Item>

      <Form.Item
        name="print_type"
        rules={[{ required: true, message: 'Please select a print type' }]}
        className="!mb-0 w-full"
      >
        <Select
          size="large"
          placeholder="Select Print Type"
          options={
            printTypeOptions?.map((type) => ({
              value: type.id,
              label: type.name,
            })) || []
          }
        />
      </Form.Item>

      <Form.Item
        name="sleevecase"
        rules={[{ required: true, message: 'Please select a sleeve type' }]}
        className="!mb-0 w-full"
      >
        <Select
          size="large"
          placeholder="Select Sleeve"
          options={SLEEVE_OPTIONS}
        />
      </Form.Item>
      

      <Form.Item
        name="price"
        rules={[{ required: true, message: 'Please enter the price' }]}
        className="!mb-0 w-full"
      >
        <Input
          size="large"
          placeholder="Enter Price"
          className="w-full"
          prefix="₹"
          onInput={(e: React.FormEvent<HTMLInputElement>) => {
            e.currentTarget.value = e.currentTarget.value.replace(/\D/g, ''); // Remove non-numeric characters
          }}
        />
      </Form.Item>

      <div className="col-span-1 md:col-span-5">
        <Button
          title={editingItemId ? 'Update Item' : 'Add Item'}
          type="submit"
          className="w-full text-white bg-primary hover:bg-primary/90"
        ></Button>
      </div>
    </Form>
  );
};

export default ItemForm;
