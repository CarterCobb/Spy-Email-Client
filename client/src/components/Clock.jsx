import React, { useState, useEffect } from "react";

/**
 * Pads 0 or 1 zeros to front of numer
 * @param {Number} number
 * @returns {String}
 */
const pad = (numer) => {
  var s = String(numer);
  while (s.length < 2) s = "0" + s;
  return s;
};

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="footer-clock">
      <span>
        {time.getFullYear() +
          "/" +
          pad(time.getMonth() + 1) +
          "/" +
          pad(time.getDate())}
      </span>
      <span>
        {time.getHours() +
          ":" +
          pad(time.getMinutes()) +
          ":" +
          pad(time.getSeconds()) +
          " " +
          (time.getHours() >= 12 ? "PM" : "AM")}
      </span>
    </div>
  );
};

export default Clock;
