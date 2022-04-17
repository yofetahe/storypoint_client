import React from "react";

const Attendee = ({ attendee, viewPoint, createdBy }) => {
  return (
    <div className={attendee.point ? "point-assigned-card" : "card"}>
      <div className="attendee-name">
        <span id="name">{attendee.name}</span> <br />
        <span id="status">
          {createdBy.indexOf(attendee.name) === -1
            ? "(Guest)"
            : "(Facilitator)"}
        </span>
      </div>
      <div className="story-point">{viewPoint && attendee.point}</div>
    </div>
  );
};

export default Attendee;
