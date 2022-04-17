import React from "react";

import copy from "../images/copy-icon.png";
import "./leftMenu.css";

function LeftMenu({
  isUserRoomCreator,
  copyUrl,
  closeRoom,
  leaveRoom,
  roomInfo,
  username,
}) {
  return (
    <>
      <div className="menu-title">
        <span className="page-name">{roomInfo?.name} Retrospective Room</span>
        <br />
        <span className="sub-title">(Created by: {roomInfo?.createdBy})</span>
      </div>
      <hr />
      <div>
        {isUserRoomCreator() ? (
          <div className="page-action">
            <input readOnly type="text" value={roomInfo?.URL} />
            <button id="copy-btn" onClick={copyUrl}>
              {/* <img src={copy} onClick={copyUrl} /> */}
              Copy URL
            </button>
            {/* <br /> */}
            <button id="close-btn" onClick={closeRoom}>Close Room</button>
          </div>
        ) : (
          <div>
            <button onClick={leaveRoom}>Leave</button>
          </div>
        )}
      </div>
      <hr />
      <div className="participant-list">
        <div className="title">Attendees</div>
        <div className="participant">
          {roomInfo.attendees.map((attendee) => {
            return (
              <div
                className={
                  username === attendee.name ? "attendee-page" : "attendee"
                }
                key={attendee.id}
              >
                <span className="attendee-name">{attendee.name} </span>
                <span className="attendee-type">
                  {roomInfo.createdBy.indexOf(attendee.name) === -1
                    ? "(Guest)"
                    : "(Facilitator)"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default LeftMenu;
