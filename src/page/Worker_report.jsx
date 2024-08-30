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
  Skeleton,
} from "antd";

const Worker_report = () => {
  const { getWorkerTimeRec, getWorkerRec, deleteWorkerTimeRec } = rt_database();
  const [load, setLoad] = useState(false);
  const [startColumns, setStartcolumns] = useState([
    {
      title: "วันที่",
      dataIndex: "date",
      rowScope: "row",
    },
  ]);
  const [tbData, setTbdata] = useState([]);

  useEffect(() => {
    callData();
  }, []);

  const callData = async (value) => {
    const take2 = await getWorkerRec();
    const dynamicCo = take2.map((item) => ({
      title: item.fname,
      dataIndex: item.id,
    }));
    setStartcolumns([...startColumns, ...dynamicCo]);

    const taketime = await getWorkerTimeRec();
    const uniqueTaketime = new Map();
    const unUniqueTaketime = new Map();

    taketime.forEach((item) => {
      const key = `${item.date}-${item.worker_id}`;
      if (!uniqueTaketime.has(key)) {
        uniqueTaketime.set(key, item);
      } else {
        unUniqueTaketime.set(key, item);
      }
    });

    const filteredTaketime = Array.from(uniqueTaketime.values());
    const unFilteredTaketime = Array.from(unUniqueTaketime.values());

    // Group items by date
    const genItems = filteredTaketime.reduce((acc, item) => {
      const existingItem = acc.find((i) => i.date === item.date);

      if (existingItem) {
        existingItem[item.worker_id] = item.work_enter;
      } else {
        acc.push({
          date: item.date,
          [item.worker_id]: item.work_enter,
        });
      }

      return acc;
    }, []);
    genItems.sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split("-");
      const [dayB, monthB, yearB] = b.date.split("-");

      const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
      const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

      return dateA - dateB;
    });
    setTbdata(genItems);
    // console.log(genItems); // This will display the generated items
    // deleteWorkerTimeRec
    unFilteredTaketime.map((item) => {
      deleteWorkerTimeRec(item.id);
    });
    // console.log(unFilteredTaketime);

    setLoad(true);
  };

  return (
    <>
      {load ? (
        <Table
          columns={startColumns}
          dataSource={tbData}
          bordered
          scroll={{
            x: 800,
          }}
        />
      ) : (
        <Skeleton active />
      )}
    </>
  );
};

export default Worker_report;
