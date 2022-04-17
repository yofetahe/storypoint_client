import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import "./retro.css";
import "../App.css";
import LeftMenu from "./LeftMenu";
import ThinkColumns from "./ThinkColumns";
import ActionMenu from "./ActionMenu";
import GroupColumns from "./GroupColumns";
import VoteColumns from "./VoteColumns";
import Summery from "./Summery";
import DiscussColumn from "./DiscussColumn";

function Retro({ pageData, socket, username, userId, roomInfo, setRoomInfo }) {
  const [retroCategory, setRetroCategory] = useState(roomInfo.retroCategory);

  const isUserRoomCreator = () => {
    if (roomInfo.createdBy === username + "*") {
      return true;
    }

    return false;
  };

  const copyUrl = () => navigator.clipboard.writeText(roomInfo.URL);

  const closeRoom = async () => await socket.emit("close_room", roomInfo.id);

  const leaveRoom = async () => {
    await socket.emit("leave_room", {
      roomId: roomInfo.id,
      username,
      userId,
    });
  };

  const mangeActionPages = (selectedPage) => {
    setRoomInfo({ ...roomInfo, currentPage: selectedPage });
    /* Socket Impl: needs socket call to change attendee's page as well */
    socket.emit("retro_page_change", { roomId: roomInfo.id, selectedPage });
  };

  const manageRetroCategoryChanges = (categoryId, input) => {
    const categoryInput = {
      id: uuidv4(),
      content: input,
      vote: 0,
    };
    socket.emit("category_input_change", {
      roomId: roomInfo.id,
      categoryId,
      categoryInput,
    });
  };

  const manageCategoryInputVote = (categoryId, inputId) => {
    console.log(categoryId, inputId);
    socket.emit("category_input_vote_change", {
      roomId: roomInfo.id,
      categoryId,
      inputId,
    });
  };

  /** TODO: fetch retroData based on roomID */

  useEffect(() => {
    if (!socket) return;

    socket.on("set_selectedPage", (data) => {
      setRoomInfo(data);
    });

    socket.on("category_input_updated", (data) => {
      setRoomInfo(data);
    });

    socket.on("category_input_vote_updated", (data) => {
      console.log(data);
      setRoomInfo(data);
    });
  }, [socket]);

  return (
    <div className="retro-container">
      <div className="left-menu">
        <LeftMenu
          isUserRoomCreator={isUserRoomCreator}
          copyUrl={copyUrl}
          closeRoom={closeRoom}
          leaveRoom={leaveRoom}
          roomInfo={roomInfo}
          username={username}
        />
      </div>
      <div className="content">
        <ActionMenu
          socket={socket}
          roomInfo={roomInfo}
          setRoomInfo={setRoomInfo}
          mangeActionPages={mangeActionPages}
          currentPage={roomInfo.currentPage}
          isUserRoomCreator={isUserRoomCreator()}
        />

        {roomInfo.currentPage === "think" && (
          <ThinkColumns
            roomInfo={roomInfo}
            manageRetroCategoryChanges={manageRetroCategoryChanges}
          />
        )}
        {roomInfo.currentPage === "group" && (
          <GroupColumns socket={socket} roomInfo={roomInfo} />
        )}
        {roomInfo.currentPage === "vote" && (
          <VoteColumns
            roomInfo={roomInfo}
            retroCategory={retroCategory}
            setRetroCategory={setRetroCategory}
            manageCategoryInputVote={manageCategoryInputVote}
          />
        )}
        {roomInfo.currentPage === "discuss" && (
          <DiscussColumn
            socket={socket}
            retroCategory={retroCategory}
            roomInfo={roomInfo}
          />
        )}
        {roomInfo.currentPage === "summery" && <Summery />}
      </div>
    </div>
  );
}

export default Retro;
