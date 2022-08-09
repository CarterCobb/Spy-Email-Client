import React, { useState, useEffect } from "react";

Number.prototype.pad = function (size) {
  var s = String(this);
  while (s.length < (size || 2)) s = "0" + s;
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
          (time.getMonth() + 1).pad() +
          "/" +
          time.getDate().pad()}
      </span>
      <span>
        {time.getHours() + ":" + time.getMinutes().pad() + ":" + time.getSeconds().pad() + " " + ((time.getHours() >= 12) ? "PM" : "AM")}
      </span>
    </div>
  );
};

export default Clock;
