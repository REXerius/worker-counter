import { useState } from "react";
import "./App.css";
import { Card, Segmented, Flex } from "antd";
import Worker_page from "./page/Worker_page";
import Worker_time from "./page/Worker_time";
import Worker_cal from "./page/Worker_cal";
import Worker_report from "./page/Worker_report";

function App() {
  const [sc, setSc] = useState("Worker");
  const selectOpt = ["Worker", "Time_Stamp", "Calculate", "Report"];

  return (
    <>
      <Flex
        justify="center"
        align="center"
        style={{ width: "100vw", height: "100%" }}
      >
        <Card
          title={
            <Segmented
              options={selectOpt}
              onChange={(value) => {
                setSc(value);
              }}
            />
          }
          bordered={false}
          style={{
            width: window.innerWidth < 1001 ? "100%" : "50%",
            height: "auto",
          }}
          styles={{ body: { padding: 0 } }}
        >
          {sc === "Worker" ? (
            <Worker_page />
          ) : sc === "Time_Stamp" ? (
            <Worker_time />
          ) : sc === "Calculate" ? (
            <Worker_cal />
          ) : (
            <Worker_report />
          )}
        </Card>
      </Flex>

      {/* <Worker_page /> */}
    </>
  );
}

export default App;
