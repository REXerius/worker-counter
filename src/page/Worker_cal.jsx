import React, { useState, useEffect } from "react";
import rt_database from "../components/rt_database";
import {
  DatePicker,
  Table,
  Button,
  Flex,
  Modal,
  message,
  Divider,
  Skeleton,
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    callData();
  }, []);

  const callData = async (value) => {
    const take2 = await getWorkerRec();

    const box = take2.map((item) => ({
      ...item,
      sumtime: 0,
      sumcost: 0,
      withdraw: 0,
      total: 0,
    }));
    // console.log(box);
    setBigdata(box);
    setLoading(true);
  };

  const ondateChange = async (date, dateString) => {
    // setLoading(false);
    // console.log(dateString);
    // setRangedate(dateString);
    const newBigdata = await Promise.all(
      bigdata.map(async (item) => {
        const { sumtime, sumcost, withdraw, total } = await findValue(
          item,
          dateString
        );

        return {
          ...item,
          sumtime,
          sumcost,
          withdraw,
          total,
        };
      })
    );
    setBigdata(newBigdata);
    // console.log(newBigdata);
    // setCurdate(dateString);
    // callData(dateString);
    // setLoading(true);
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const findValue = async (value, dt) => {
    const take2 = await getWorkertimebyidRec(value.id);

    const costmoney =
      bigdata[bigdata.findIndex((item) => item.id === value.id)].cost;
    // console.log(costmoney);
    let workcnt = 0.0;
    let borrowcnt = 0;
    take2.map((item) => {
      const startDate = parseDate(dt[0]); // "01-08-2024"
      const endDate = parseDate(dt[1]); // "31-08-2024"
      const targetDateParsed = parseDate(item.date);
      if (targetDateParsed >= startDate && targetDateParsed <= endDate) {
        workcnt += parseFloat(item.work_enter);
        borrowcnt += item.borrow;
      }
    });

    const box = {
      sumtime: workcnt,
      sumcost: costmoney * workcnt,
      withdraw: borrowcnt,
      total: costmoney * workcnt - borrowcnt,
    };

    return box;
    // setBigbox(box);
    // setIsModalOpen(true);
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
      title: "เวลาทั้งหมด",
      dataIndex: "sumtime",
      key: "sumtime",
    },
    {
      title: "รายได้ทั้งหมด",
      dataIndex: "sumcost",
      key: "sumcost",
    },
    {
      title: "เบิกทั้งหมด",
      dataIndex: "withdraw",
      key: "withdraw",
    },
    {
      title: "ยอดรวม + หักลบ",
      dataIndex: "total",
      key: "total",
    },
    // {
    //   title: "จัดการ",
    //   key: "action",
    //   render: (_, record) => (
    //     <Button
    //       type="primary"
    //       onClick={() => {
    //         rangedate.length > 0
    //           ? showModal(record)
    //           : message.info("โปรดเลือกวันที่");
    //       }}
    //     >
    //       คำนวณ
    //     </Button>
    //   ),
    // },
  ];

  return (
    <>
      {/* <Modal
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
      </Modal> */}
      {loading ? (
        <div style={{ width: "100%", height: "auto" }}>
          <Divider>กำหนดวัน</Divider>
          <RangePicker
            popupClassName="dateRangePicker"
            format={"DD-MM-YYYY"}
            onChange={ondateChange}
          />
          <Divider>--</Divider>
          <br />
          <Table columns={columns} dataSource={bigdata} />
        </div>
      ) : (
        <Skeleton active />
      )}
    </>
  );
};

export default Worker_cal;
