import React from "react";
import { useParams } from "react-router-dom";

function ScrumRoomHeader({
  socket,
  roomInfo,
  isUserRoomCreator,
  username,
}) {
  const { userId, roomId } = useParams();

  const copyUrl = () => navigator.clipboard.writeText(roomInfo.URL);

  const closeRoom = async () => await socket.emit("close_room", roomId);

  const leaveRoom = async () => {
    await socket.emit("leave_room", { roomId, username, userId });
  };

  return (
    <>
      <div className="title">
        <span style={{ textTransform: "capitalize" }}>{roomInfo?.name}</span>{" "}
        Room (Created by: {roomInfo?.createdBy}) | Joined as {username}
      </div>
      {isUserRoomCreator() ? (
        <div>
          URL <input readOnly type="text" value={roomInfo?.URL} />{" "}
          <button onClick={copyUrl}>Copy URL</button>
          <button onClick={closeRoom}>Close Room</button>
        </div>
      ) : (
        <div>
          <button onClick={leaveRoom}>Leave</button>
        </div>
      )}
    </>
  );
}

export default ScrumRoomHeader;
