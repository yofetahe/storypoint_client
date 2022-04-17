import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { initialState } from "../model";
import getPageData from "./getPageData";

function CreateRoom({ pageData, socket, setRoomInfo, baseURL, userJoined }) {
  const { subdirectory, roomTitle } = getPageData(pageData);

  const [roomId, setRoomId] = useState(uuidv4());
  const [creatorName, setCreatorName] = useState("");
  const [room, setRoom] = useState("");

  let history = useHistory();

  const manageCreatorNameChange = (value) => setCreatorName(value);
  const manageRoomChange = (value) => setRoom(value);

  const createRoom = async (room, username) => {
    if (room === "" && username === "") {
      return;
    }

    const roomDetail = initialState(
      roomId,
      room,
      username,
      baseURL,
      subdirectory
    );

    await socket.emit("create_room", { roomDetail, username });
  };

  const joinRoom = async (roomId, username) => {
    const userData = {
      id: uuidv4(),
      name: username,
      point: null,
    };
    await socket.emit("join_room", { roomId, userData });
  };

  useEffect(() => {
    if (userJoined.status) {
      history.push(`/${subdirectory}/${roomId}/${userJoined.userId}`);
    }
  }, [userJoined.userId]);

  useEffect(() => {
    if (!socket) return;
    socket.on("created_room", async ({ room, username }) => {
      setRoomInfo(room);
      joinRoom(room.id, username);
    });
  }, [socket]);

  return (
    <div className="header">
      <div id="app-navigator">
        {subdirectory === "retro" ? (
          <Link to="/storypoint">Go to Story point</Link>
        ) : (
          <Link to="/retro">Go to Retro</Link>
        )}
      </div>
      <div className="title">{roomTitle} | Create Room</div>
      <input
        type="text"
        placeholder="Your name"
        onChange={(event) => manageCreatorNameChange(event.target.value)}
      />
      <input
        type="text"
        placeholder="Room Name"
        onChange={(event) => manageRoomChange(event.target.value)}
      />
      <button onClick={() => createRoom(room, creatorName)}>
        Create {roomTitle} Room
      </button>
    </div>
  );
}

export default CreateRoom;
