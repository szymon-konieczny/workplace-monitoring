import React from "react";

import {
  intervalToDuration,
  differenceInMilliseconds,
  distanceInWordsStrict,
} from "date-fns";

import "./total-time.css";

const TotalTime = (props) => {
  const getTotals = (timesList) => {
    if (timesList.length === 0) {
      return {
        totalTaken: { hours: 0, minutes: 0, seconds: 0 },
        totalEmpty: { hours: 0, minutes: 0, seconds: 0 },
      };
    }

    const takensList = timesList.filter(({ type }) => type === "taken");
    const emptiesList = timesList.filter(({ type }) => type === "empty");

    const takensListWithDurations = getDataWithDuration(takensList);
    const emptiesListWithDurations = getDataWithDuration(emptiesList);

    console.log("takensListWithDurations", takensListWithDurations);
    console.log("emptiesListWithDurations", emptiesListWithDurations);

    const minTaken = getMin(takensListWithDurations);
    const maxTaken = getMax(takensListWithDurations);
    const minEmpty = getMin(emptiesListWithDurations);
    const maxEmpty = getMax(emptiesListWithDurations);

    // console.log("minTaken", minTaken);
    // console.log("maxTaken", maxTaken);

    // console.log("minEmpty", minEmpty);
    // console.log("maxEmpty", maxEmpty);

    if (!minTaken || !maxTaken || !minEmpty || !maxEmpty) {
      return {
        totalTaken: { hours: 0, minutes: 0, seconds: 0 },
        totalEmpty: { hours: 0, minutes: 0, seconds: 0 },
      };
    }

    const totalTaken = intervalToDuration(minTaken, maxTaken);
    const totalEmpty = intervalToDuration(minEmpty, maxEmpty);

    return { totalTaken, totalEmpty };
  };

  const getDataWithDuration = (data) => {
    if (!data || data.length === 0) {
      return 0;
    }

    data.map((item) => ({
      ...item,
      duration: differenceInMilliseconds(item.to, item.from),
    }));
  };

  const formatDurations = (data) =>
    data.map(({ from, to }) => intervalToDuration({ start: from, end: to }));

  const getMin = (data) =>
    data
      ? data.reduce(
          (min, val) =>
            val.duration < min.duration ? val.duration : min.duration,
          data[0].duration
        )
      : [];
  const getMax = (data) =>
    data
      ? data.reduce(
          (max, val) =>
            val.duration > max.duration ? val.duration : max.duration,
          data[0].duration
        )
      : [];

  const { totalTaken, totalEmpty } = getTotals(props.timesList);

  // const {
  //   hours: takenHours,
  //   minutes: takenMinutes,
  //   seconds: takenSeconds,
  // } = totalTaken;
  // const {
  //   hours: emptyHours,
  //   minutes: emptyMinutes,
  //   seconds: emptySeconds,
  // } = totalEmpty;

  return (
    <div className="totals-wrapper">
      {/* <div>
        Total taken:
        {takenHours !== 0 ? <span>{takenHours}h</span> : ""}
        {takenMinutes !== 0 ? <span>{takenMinutes}min</span> : ""}
        {takenSeconds !== 0 ? <span>{takenSeconds}s</span> : ""}
      </div>
      <div>
        Total empty:
        {emptyHours !== 0 ? <span>{emptyHours}h</span> : ""}
        {emptyMinutes !== 0 ? <span>{emptyMinutes}min</span> : ""}
        {emptySeconds !== 0 ? <span>{emptySeconds}s</span> : ""}
      </div> */}
    </div>
  );
};

export default TotalTime;
