import React, { useEffect } from "react";
import skip from "../images/sleeping.jpg";

function ScrumPoints({ socket, roomInfo, username, setActivateViewPoint }) {
  const buttons = ["_1", "_2", "_3", "_5", "_8", "_13", "_0"];

  const setStoryPoint = async (point) => {
    if (!roomInfo.viewPoint) {
      await socket.emit("send_point", {
        roomId: roomInfo?.id,
        username,
        point,
      });
    }
    setActivateViewPoint(true);

    buttons.forEach((btn) => {
      const b = document.getElementById(btn);
      if (btn === `_${point}`) {
        b.classList.add("selectedPoint");
      } else {
        b.classList.remove("selectedPoint");
      }
    });
  };

  useEffect(() => {
    if (!roomInfo?.viewPoint) {
      buttons.forEach((btn) => {
        document.getElementById(btn).classList.remove("selectedPoint");
      });
    }
  }, [roomInfo.viewPoint]);

  return (
    <div>
      <div className="title">Story Points</div>
      <div id="buttons">
        <button id="_1" onClick={() => setStoryPoint(1)}>
          1
        </button>
        <button id="_2" onClick={() => setStoryPoint(2)}>
          2
        </button>
        <button id="_3" onClick={() => setStoryPoint(3)}>
          3
        </button>
        <button id="_5" onClick={() => setStoryPoint(5)}>
          5
        </button>
        <button id="_8" onClick={() => setStoryPoint(8)}>
          8
        </button>
        <button id="_13" onClick={() => setStoryPoint(13)}>
          13
        </button>
        <button id="_0" onClick={() => setStoryPoint(0)}>
          Skip
          {/* <img src={skip} alt="Skip" style={{width: "25px"}} /> */}
        </button>
      </div>
    </div>
  );
}

export default ScrumPoints;
