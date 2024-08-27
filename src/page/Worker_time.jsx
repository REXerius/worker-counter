import React, { useState, useEffect } from "react";
import rt_database from "../components/rt_database";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import {
  Button,
  Table,
  Typography,
  Switch,
  Flex,
  InputNumber,
  DatePicker,
  Modal,
  Form,
} from "antd";

const Worker_time = () => {
  const { getcurWorkerbydate, setWorkertimeRec, updateWorkertimeRec } =
    rt_database();
  const [bigdata, setBigdata] = useState([]);
  const [showtype, setShowtype] = useState(false);
  const [curdate, setCurdate] = useState(dayjs().format("DD-MM-YYYY"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iseditModalOpen, setIseditModalOpen] = useState(false);
  const [staticdata, setStaticdata] = useState([]);
  const [editData, seteditdata] = useState({});
  const [form] = Form.useForm();

  useEffect(() => {
    // const dataRef = ref(database, "worker_record");
    callData();
  }, []);

  const callData = async (value) => {
    const take2 = await getcurWorkerbydate(value || curdate);
    setBigdata(take2);
  };

  const onChange = (e, id) => {
    console.log(e, id);
  };

  const ondateChange = (date, dateString) => {
    // console.log(dateString);
    setCurdate(dateString);
    callData(dateString);
  };

  const showModal = (value) => {
    setStaticdata(value);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleeditOk = () => {
    setIseditModalOpen(false);
  };

  const handleeditCancel = () => {
    setIseditModalOpen(false);
  };

  const showeditModal = (value) => {
    console.log(value);
    seteditdata(value);
    setIseditModalOpen(true);
    console.log(form.getFieldValue());
    form.setFieldsValue({
      work_enter: value.timestamps.work_enter,
      borrow: value.timestamps.borrow,
    });
  };

  const onFinish = (val) => {
    // console.log(val);
    // console.log(staticdata);
    const box = {
      borrow: val.borrow,
      date: curdate,
      work_enter: val.work_enter,
      worker_id: staticdata.id,
    };
    // console.log(box);
    setWorkertimeRec(box);
    callData();
    setIsModalOpen(false);
  };

  const onFinish2 = (val) => {
    // console.log(val);
    // console.log(editData);
    const box = {
      borrow: val.borrow,
      date: curdate,
      work_enter: val.work_enter,
      worker_id: editData.timestamps.worker_id,
    };
    updateWorkertimeRec(editData.id, box);
    callData();
    setIseditModalOpen(false);
    // console.log(box);
  };

  const columns = [
    {
      title: "ชื่อ",
      dataIndex: "fname",
      key: "fname",
      render: (_, record) => <p>{record.data.fname}</p>,
    },
    {
      title: "นามสกุล",
      dataIndex: "lname",
      key: "lname",
      render: (_, record) => <p>{record.data.lname}</p>,
    },
    {
      title: "บันทึก",
      key: "save",
      render: (_, record) => (
        <Button type="primary" onClick={() => showModal(record)}>
          บันทึก
        </Button>
      ),
    },
  ];

  const columns2 = [
    {
      title: "ชื่อ",
      dataIndex: "fname",
      key: "fname",
      render: (_, record) => <p>{record.data.fname}</p>,
    },
    {
      title: "นามสกุล",
      dataIndex: "lname",
      key: "lname",
      render: (_, record) => <p>{record.data.lname}</p>,
    },
    {
      title: "เวลาทำงาน",
      dataIndex: "time",
      key: "time",
      render: (_, record) => <p>{record.timestamps.work_enter}</p>,
    },
    {
      title: "เงินเบิก",
      dataIndex: "money",
      key: "money",
      render: (_, record) => <p>{record.timestamps.borrow}</p>,
    },
    {
      title: "แก้ไข",
      key: "edit",
      render: (_, record) => (
        <Button type="primary" onClick={() => showeditModal(record)}>
          แก้ไข
        </Button>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={staticdata?.data?.fname + " " + staticdata?.data?.lname}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="ยกเลิก"
        okText="ตกลง"
      >
        {/* {console.log(staticdata)} */}
        <Form
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          style={{ width: "100%" }}
        >
          <Form.Item
            label="เวลาทำงาน ( 0.1 - 1 )"
            name="work_enter"
            rules={[
              {
                required: true,
                message: "โปรดกรอกเวลาทำงาน !",
              },
            ]}
            initialValue={"1"}
          >
            <InputNumber
              style={{
                width: "auto",
              }}
              min="0"
              max="1"
              step="0.1"
              stringMode
            />
          </Form.Item>

          <Form.Item
            label="เงินเบิก"
            name="borrow"
            rules={[
              {
                required: true,
                message: "โปรดกรอกเงินเบิก !",
              },
            ]}
            initialValue={0}
          >
            <InputNumber
              style={{
                width: "auto",
              }}
              min="0"
              max="5000"
            />
          </Form.Item>
          <Flex justify="center" align="center" style={{ width: "100%" }}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ textAlign: "center" }}
              >
                บันทึก
              </Button>
            </Form.Item>
          </Flex>
        </Form>
      </Modal>
      <Modal
        title={editData?.data?.fname + " " + editData?.data?.lname}
        open={iseditModalOpen}
        onOk={handleeditOk}
        onCancel={handleeditCancel}
        cancelText="ยกเลิก"
        okText="ตกลง"
      >
        {/* {console.log(editData)} */}
        <Form
          form={form}
          name="editform"
          onFinish={onFinish2}
          autoComplete="off"
          layout="vertical"
          style={{ width: "100%" }}
        >
          <Form.Item
            label="เวลาทำงาน ( 0.1 - 1 )"
            name="work_enter"
            rules={[
              {
                required: true,
                message: "โปรดกรอกเวลาทำงาน !",
              },
            ]}
          >
            <InputNumber
              style={{
                width: "auto",
              }}
              min="0"
              max="1"
              step="0.1"
              stringMode
            />
          </Form.Item>

          <Form.Item
            label="เงินเบิก"
            name="borrow"
            rules={[
              {
                required: true,
                message: "โปรดกรอกเงินเบิก !",
              },
            ]}
          >
            <InputNumber
              style={{
                width: "auto",
              }}
              min="0"
              max="5000"
            />
          </Form.Item>
          <Flex justify="center" align="center" style={{ width: "100%" }}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ textAlign: "center" }}
              >
                บันทึก
              </Button>
            </Form.Item>
          </Flex>
        </Form>
      </Modal>
      <div style={{ width: "100%", height: "auto" }}>
        <Flex justify="space-around" align="start" style={{ width: "auto" }}>
          <Switch
            checkedChildren="กรอกแล้ว"
            unCheckedChildren="ยังไม่กรอก"
            value={showtype}
            onChange={() => setShowtype(!showtype)}
          />
          <DatePicker
            onChange={ondateChange}
            defaultValue={dayjs()}
            format={"DD-MM-YYYY"}
          />
        </Flex>
        <br />
        {showtype ? (
          <Table
            columns={columns2}
            dataSource={bigdata.filter((item) => item.timestamps?.worker_id)}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={bigdata.filter((item) => !item.timestamps?.worker_id)}
          />
        )}
      </div>
    </>
  );
};

export default Worker_time;
