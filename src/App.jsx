import { useState } from "react";
import "./App.css";
import Worker_page from "./page/Worker_page";
import Worker_time from "./page/Worker_Time";
import Worker_cal from "./page/Worker_cal";
import { Card, Segmented, Flex } from "antd";

function App() {
  const [sc, setSc] = useState("Worker");
  const selectOpt = ["Worker", "Time_Stamp", "Calculate"];

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
          ) : (
            <Worker_cal />
          )}
        </Card>
      </Flex>

      {/* <Worker_page /> */}
    </>
  );
}

export default App;
