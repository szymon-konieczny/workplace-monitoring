import React, { useState, useLayoutEffect } from "react";

import { getTime, formatDistanceStrict } from "date-fns";

import TotalTime from "../total-time/TotalTime";
import TimesList from "../times-list/TimesList";

const TimeTracker = (props) => {
  const getCurrentTime = () => getTime(new Date());

  const [trackerConfig, setTrackerConfig] = useState({
    takenStartTracking: 0,
    takenStopTracking: 0,
    emptyStartTracking: 0,
    emptyStopTracking: 0,
    statuses: [],
  });

  useLayoutEffect(() => {
    if (props.isWorkplaceOccupied) {
      setTrackerConfig((trackerConfig) => ({
        ...trackerConfig,
        emptyStopTracking: getCurrentTime(),
        takenStartTracking: getCurrentTime(),
        statuses: [
          ...trackerConfig.statuses,
          {
            type: "empty",
            to: trackerConfig.emptyStartTracking,
            from: trackerConfig.emptyStopTracking,
            duration: formatDistanceStrict(
              trackerConfig.emptyStartTracking,
              trackerConfig.emptyStopTracking
            ),
          },
        ],
      }));
    } else {
      setTrackerConfig((trackerConfig) => ({
        ...trackerConfig,
        emptyStartTracking: getCurrentTime(),
        takenStopTracking: getCurrentTime(),
        statuses: [
          ...trackerConfig.statuses,
          {
            type: "taken",
            to: trackerConfig.takenStartTracking,
            from: trackerConfig.takenStopTracking,
            duration: formatDistanceStrict(
              trackerConfig.takenStartTracking,
              trackerConfig.takenStopTracking
            ),
          },
        ],
      }));
    }
  }, [props.isWorkplaceOccupied]);

  const filteredTotals = trackerConfig.statuses.filter(
    (time) => time.from && time.to
  );

  return (
    // <>
    <div className="tracker-wrapper">
      {/* <TotalTime timesList={filteredTotals}></TotalTime> */}
      <TimesList timesList={filteredTotals}></TimesList>
    </div>
    /* <pre>{JSON.stringify(trackerConfig, null, 2)}</pre> */
    /* </> */
  );
};

export default TimeTracker;
