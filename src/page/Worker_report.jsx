import React, { useState, useEffect } from "react";
import rt_database from "../components/rt_database";
import { Table, DatePicker, Skeleton, Divider } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const Worker_report = () => {
  const { getWorkerTimeRec, getWorkerRec, deleteWorkerTimeRec } = rt_database();
  const [load, setLoad] = useState(false);
  const [startColumns, setStartcolumns] = useState([]);
  const [tbData, setTbdata] = useState([]);

  useEffect(() => {
    callData();
  }, []);

  const callData = async (value) => {
    const take2 = await getWorkerRec();
    const dynamicCo = take2.map((item) => ({
      title: item.fname,
      dataIndex: item.id,
      render: (_, record) => {
        const dtidx = item.id;
        return (
          <>
            <p>เข้างาน: {record[dtidx]?.wEnter || "-"}</p>
            <br />
            <p>เบิก: {record[dtidx]?.borrow || "-"}</p>
          </>
        );
      },
    }));
    const stCol = [
      {
        title: "วันที่",
        dataIndex: "date",
        rowScope: "row",
        fixed: "left",
      },
    ];
    //borrow
    setStartcolumns([...stCol, ...dynamicCo]);

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
    // console.log(filteredTaketime);
    // Group items by date
    const genItems = filteredTaketime.reduce((acc, item) => {
      const existingItem = acc.find((i) => i.date === item.date);

      if (existingItem) {
        existingItem[item.worker_id] = {
          wEnter: item.work_enter,
          borrow: item.borrow, // Ensure consistent structure
        };
      } else {
        acc.push({
          date: item.date,
          [item.worker_id]: {
            wEnter: item.work_enter,
            borrow: item.borrow,
          },
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

    const checkday = value || dayjs().format("MM-YYYY");
    // console.log(checkday);
    const filterGenitems = genItems.filter((item) => {
      const dayBox = item.date.split("-");
      const dayCheck = checkday.split("-");

      return dayBox[1] === dayCheck[0] && dayBox[2] === dayCheck[1];
    });
    setTbdata([]);
    setTbdata(filterGenitems);
    // console.log(filterGenitems);
    // deleteWorkerTimeRec
    unFilteredTaketime.map((item) => {
      deleteWorkerTimeRec(item.id);
    });
    // console.log(unFilteredTaketime);

    setLoad(true);
  };

  const onDateChange = (date, dateString) => {
    console.log(dateString);
    callData(dateString);
  };

  return (
    <>
      {load ? (
        <>
          <Divider />
          <DatePicker
            onChange={onDateChange}
            format={"MM-YYYY"}
            picker="month"
            defaultValue={dayjs()}
          />
          <Divider />
          <Table
            columns={startColumns}
            dataSource={tbData}
            bordered
            scroll={{
              x: 1000,
              y: 600,
            }}
            pagination={{ pageSize: 31 }}
          />
        </>
      ) : (
        <Skeleton active />
      )}
    </>
  );
};

export default Worker_report;
