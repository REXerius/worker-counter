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
} from "antd";

const Worker_page = () => {
  const { getWorkerRec, setWorkerRec, updateWorkerRec, deleteWorkerRec } =
    rt_database();
  const [bigdata, setBigdata] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // const dataRef = ref(database, "worker_record");
    callData();
  }, []);

  const callData = async () => {
    const take = await getWorkerRec();
    setBigdata(take);
    // console.log(take);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    // console.log(values);
    const box = {
      fname: values.fname,
      lname: values.lname,
      status: true,
    };
    setWorkerRec(box);
    setIsModalOpen(false);
    callData();
  };

  const updateItems = async (e, val) => {
    console.log(e);
    const box = {
      fname: val.fname,
      lname: val.lname,
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
      title: "จัดการ",
      key: "action",
      render: (_, record) => (
        <Flex justify="space-around" align="start" style={{ width: "auto" }}>
          {/* <a>Invite {record.name}</a>
          <a>Delete</a> */}
          <Switch
            checkedChildren="อยู่"
            unCheckedChildren="ไม่อยู่"
            value={record.status}
            onClick={(e) => updateItems(e, record)}
          />
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
        </Flex>
      ),
    },
  ];

  return (
    <>
      <Modal
        title="เพิ่มคนงาน"
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        okText="ตกลง"
        cancelText="ยกเลิก"
      >
        <Form
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          form={form}
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
        </Form>
      </Modal>
      <Flex justify="space-around" align="start">
        <div>รายชื่อคนงาน</div>
        <Button type="primary" onClick={showModal}>
          + เพิ่มคนงาน
        </Button>
      </Flex>
      <br />
      <Table columns={columns} dataSource={bigdata} />
    </>
  );
};

export default Worker_page;
