import React from "react";

import { format } from "date-fns";

import "./times-list.css";
import "antd/dist/antd.css";

import { Table } from "antd";
const TimesList = (props) => {
  console.log(" props.timesList", props.timesList);

  const sourceData = props.timesList.map((item) => ({
    state: item.type,
    date: format(item.from, "dd/MM/yy"),
    from: format(item.from, "HH:mm"),
    to: format(item.to, "HH:mm"),
    duration: item.duration,
  }));

  const columns = [
    { title: "State", dataIndex: "state", key: "state" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "From", dataIndex: "from", key: "from" },
    { title: "To", dataIndex: "to", key: "to" },
    { title: "Duration", dataIndex: "duration", key: "duration" },
  ];
  return (
    <div className="wrapper">
      <h4>Time tracker:</h4>
      {props.timesList.length !== 0 ? (
        <Table
          bordered
          dataSource={sourceData}
          columns={columns}
          rowClassName={(record, index) =>
            record.state === "taken" ? "taken" : "empty"
          }
        />
      ) : (
        "No data available"
      )}
    </div>
  );
};

export default TimesList;
