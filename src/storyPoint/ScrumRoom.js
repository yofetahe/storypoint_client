import React, { useEffect, useState } from "react";
import Attendee from "./Attendee";
import ScrumPoints from "./ScrumPoints";
import ScrumRoomHeader from "./ScrumRoomHeader";

function ScrumRoom({
  socket,
  roomInfo,
  leaveRoom,
  setRoomInfo,
  username,
  resultCount,
  closeRoom,
  setResultCount,
}) {
  const [activateViewPoint, setActivateViewPoint] = useState(false);

  const isUserRoomCreator = () => {
    if (roomInfo.createdBy === username + "*") {
      return true;
    }

    return false;
  };

  const resetBoard = async (roomId) => {
    await socket.emit("reset_board", roomId);
  };

  const viewStoryPointResult = async (roomId) => {
    let count = roomInfo.attendees.filter(
      (attend) => attend.point !== null
    ).length;
    if (count > 0) {
      await socket.emit("view_story_point", roomId);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("view_result", ({ roomData, pointCount }) => {
      setRoomInfo(roomData);
      setResultCount(pointCount);
    });

    socket.on("new_board", (data) => {
      setRoomInfo(data);
    });

    socket.on("exit_room", (data) => {
      setRoomInfo(data);
    });

    socket.on("set_point", (data) => {
      setRoomInfo(data);
    });
  }, [socket]);

  return (
    <div>
      <div className="header">
        <ScrumRoomHeader
          socket={socket}
          leaveRoom={leaveRoom}
          roomInfo={roomInfo}
          closeRoom={closeRoom}
          isUserRoomCreator={isUserRoomCreator}
          username={username}
        />
      </div>

      <div>
        {isUserRoomCreator() && (
          <div>
            {!roomInfo?.viewPoint &&
              (activateViewPoint ? (
                <button onClick={() => viewStoryPointResult(roomInfo?.id)}>
                  View Point
                </button>
              ) : (
                <button className={activateViewPoint ? "" : "disabled"}>
                  View Point
                </button>
              ))}
            {roomInfo?.viewPoint && (
              <button onClick={() => resetBoard(roomInfo?.id)}>Reset</button>
            )}
          </div>
        )}
        <div className="result-section">
          {roomInfo?.viewPoint && (
            <>
              <div className="result-title">
                Average Result: {roomInfo?.avgResult} |{" "}
              </div>
              {Object.keys(resultCount).map((key) => {
                return (
                  <div key={key} className="pointCount">
                    <div className="pointValue">{key}</div>
                    <div className="countValue">{resultCount[key]}</div>
                  </div>
                );
              })}
            </>
          )}
        </div>
        <div className="cards">
          {roomInfo?.attendees?.map((attendee, index) => {
            return (
              <Attendee
                key={index}
                attendee={attendee}
                viewPoint={roomInfo?.viewPoint}
                createdBy={roomInfo.createdBy}
              />
            );
          })}
        </div>
      </div>

      <div className="storyPoints">
        <ScrumPoints
          socket={socket}
          roomInfo={roomInfo}
          username={username}
          setActivateViewPoint={setActivateViewPoint}
        />
      </div>
    </div>
  );
}

export default ScrumRoom;
