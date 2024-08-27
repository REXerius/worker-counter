import React, { useState, useEffect } from "react";
import rt_database from "../components/rt_database";
import {
  Button,
  Modal,
  Switch,
  Flex,
  Form,
  Input,
  Popconfirm,
  message,
  Table,
  InputNumber,
} from "antd";

const Worker_page = () => {
  const { getWorkerRec, setWorkerRec, updateWorkerRec, deleteWorkerRec } =
    rt_database();
  const [bigdata, setBigdata] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iseditModalOpen, setIsEditModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editItems, setEdititems] = useState({});

  useEffect(() => {
    // const dataRef = ref(database, "worker_record");
    callData();
  }, []);

  const callData = async () => {
    const take = await getWorkerRec();
    setBigdata(take);
    console.log(take);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showeditModal = (val) => {
    // console.log(val);
    setEdititems(val);
    editForm.setFieldsValue({
      fname: val.fname,
      lname: val.lname,
      cost: val.cost,
    });
    setIsEditModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    // console.log(values);
    const box = {
      fname: values.fname,
      lname: values.lname,
      cost: values.cost,
      status: true,
    };
    setWorkerRec(box);
    setIsModalOpen(false);
    callData();
  };

  const oneditFinish = async (val) => {
    // console.log(val);
    // console.log(editItems);
    // updateWorkerRec()
    const box = {
      fname: val.fname,
      lname: val.lname,
      cost: val.cost,
      status: editItems.status,
    };
    await updateWorkerRec(editItems.id, box);
    callData();
    setIsEditModalOpen(false);
  };

  const updateItems = async (e, val) => {
    // console.log(e);
    const box = {
      fname: val.fname,
      lname: val.lname,
      cost: val.cost,
      status: e,
    };
    await updateWorkerRec(val.id, box);
    callData();
  };

  const confirm = (e) => {
    // console.log(e);
    deleteWorkerRec(e);
    callData();
    message.success("ลบคนงานแล้ว !");
  };

  const columns = [
    {
      title: "ชื่อ",
      dataIndex: "fname",
      key: "fname",
    },
    {
      title: "นามสกุล",
      dataIndex: "lname",
      key: "lname",
    },
    {
      title: "ค่าแรง",
      dataIndex: "cost",
      key: "cost",
    },
    {
      title: "อยู่หรือไม่",
      key: "action1",
      render: (_, record) => (
        <Switch
          checkedChildren="อยู่"
          unCheckedChildren="ไม่อยู่"
          value={record.status}
          onClick={(e) => updateItems(e, record)}
        />
      ),
    },
    {
      title: "แก้ไข",
      key: "action2",
      render: (_, record) => (
        <Button type="primary" onClick={() => showeditModal(record)}>
          แก้ไข
        </Button>
      ),
    },
    {
      title: "ลบ",
      key: "action3",
      render: (_, record) => (
        <Popconfirm
          title="ลบรายการ"
          description="ต้องการลบรายการนี้หรือไม่ ?"
          onConfirm={() => confirm(record.id)}
          okText="ตกลง"
          cancelText="ยกเลิก"
        >
          <Button type="primary" danger>
            ลบคนงาน
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Modal
        title="เพิ่มคนงาน"
        open={isModalOpen}
        onOk={() => createForm.submit()}
        onCancel={handleCancel}
        okText="ตกลง"
        cancelText="ยกเลิก"
      >
        <Form
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          form={createForm}
        >
          <Form.Item
            label="ชื่อ"
            name="fname"
            rules={[
              {
                required: true,
                message: "โปรดกรอกชื่อ!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="นามสกุล"
            name="lname"
            rules={[
              {
                required: true,
                message: "โปรดกรอกชื่อนามสกุล!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="ค่าแรง"
            name="cost"
            rules={[
              {
                required: true,
                message: "โปรดกรอกค่าแรง!",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="แก้ไขคนงาน"
        open={iseditModalOpen}
        onOk={() => editForm.submit()}
        onCancel={() => setIsEditModalOpen(!iseditModalOpen)}
        okText="ตกลง"
        cancelText="ยกเลิก"
      >
        <Form
          name="editform"
          onFinish={oneditFinish}
          autoComplete="off"
          layout="vertical"
          form={editForm}
        >
          <Form.Item
            label="ชื่อ"
            name="fname"
            rules={[
              {
                required: true,
                message: "โปรดกรอกชื่อ!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="นามสกุล"
            name="lname"
            rules={[
              {
                required: true,
                message: "โปรดกรอกชื่อนามสกุล!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="ค่าแรง"
            name="cost"
            rules={[
              {
                required: true,
                message: "โปรดกรอกค่าแรง!",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
      <div style={{ width: "100%", height: "100vh" }}>
        <Flex justify="space-around" align="start">
          <div>รายชื่อคนงาน</div>
          <Button type="primary" onClick={showModal}>
            + เพิ่มคนงาน
          </Button>
        </Flex>
        <br />
        <Table
          columns={columns}
          dataSource={bigdata}
          scroll={{
            x: 700,
            y: 500,
          }}
        />
      </div>
    </>
  );
};

export default Worker_page;
