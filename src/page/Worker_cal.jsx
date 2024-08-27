import React, { useState, useEffect } from "react";
import rt_database from "../components/rt_database";
import {
  DatePicker,
  Table,
  Button,
  Flex,
  Modal,
  message,
  InputNumber,
} from "antd";
const { RangePicker } = DatePicker;
import "./Worker.css";

const Worker_cal = () => {
  const { getWorkertimebyidRec, getWorkerRec } = rt_database();
  const [bigdata, setBigdata] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rangedate, setRangedate] = useState([]);
  // const [costmoney, setCostmoney] = useState(0);
  const [bigbox, setBigbox] = useState({});

  useEffect(() => {
    callData();
  }, []);

  const callData = async (value) => {
    const take2 = await getWorkerRec();
    setBigdata(take2);
  };

  const ondateChange = (date, dateString) => {
    // console.log(dateString);
    setRangedate(dateString);
    // setCurdate(dateString);
    // callData(dateString);
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const showModal = async (value) => {
    const take2 = await getWorkertimebyidRec(value.id);

    const costmoney =
      bigdata[bigdata.findIndex((item) => item.id === value.id)].cost;
    // console.log(costmoney);
    let workcnt = 0.0;
    let borrowcnt = 0;
    take2.map((item) => {
      const startDate = parseDate(rangedate[0]); // "01-08-2024"
      const endDate = parseDate(rangedate[1]); // "31-08-2024"
      const targetDateParsed = parseDate(item.date);
      if (targetDateParsed >= startDate && targetDateParsed <= endDate) {
        workcnt += parseFloat(item.work_enter);
        borrowcnt += item.borrow;
      }
    });
    const box = {
      workingcount: workcnt,
      summoney: costmoney * workcnt,
      borrow: borrowcnt,
      sumborrow: costmoney * workcnt - borrowcnt,
    };
    setBigbox(box);
    setIsModalOpen(true);
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
        <Button
          type="primary"
          onClick={() => {
            rangedate.length > 0
              ? showModal(record)
              : message.info("โปรดเลือกวันที่");
          }}
        >
          คำนวณ
        </Button>
      ),
    },
  ];

  return (
    <>
      <Modal
        title="เพิ่มคนงาน"
        open={isModalOpen}
        onOk={() => setIsModalOpen(!isModalOpen)}
        onCancel={() => setIsModalOpen(!isModalOpen)}
        okText="ตกลง"
        cancelText="ยกเลิก"
      >
        {bigbox ? (
          <>
            จำนวนเวลาทำงานทั้งหมด : {bigbox.workingcount} <br />
            จำนวนรายได้ทั้งหมด (คูณด้วยค่าแรง) : {bigbox.summoney} <br />
            จำนวนเงินเบิกทั้งหมด : {bigbox.borrow} <br />
            จำนวนเงินหักแล้ว : {bigbox.sumborrow} <br />
          </>
        ) : (
          "loading..."
        )}
      </Modal>
      <Flex justify="center" align="center">
        กำหนดวัน :
        <RangePicker
          popupClassName="dateRangePicker"
          format={"DD-MM-YYYY"}
          onChange={ondateChange}
        />
      </Flex>
      <br />
      <Table columns={columns} dataSource={bigdata} />
    </>
  );
};

export default Worker_cal;
