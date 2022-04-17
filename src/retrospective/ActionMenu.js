import React, { useEffect, useState } from "react";

import "./actionMenu.css";

function ActionMenu({ socket, roomInfo, setRoomInfo, mangeActionPages, currentPage, isUserRoomCreator }) {
  const [disableTimer, setDisableTimer] = useState(false);
  // const [timerStart, setTimerStart] = useState(false);
  const actionSequence = {
    think: 1,
    group: 2,
    vote: 3,
    discuss: 4,
    summery: 5,
  };

  const resetTimeCounter = () => {
    // setTimerStart(false);
    clearInterval(window.intervalVal);
    document.getElementById("count-down-value").innerHTML = 2;
    let timeBare = document.getElementById("time-counter");
    timeBare.style.width = "0%";
  };

  const validatePageSequence = (selectedPage) => {
    /** 
     * TODO - to navigate from think to group, at lease there must be one input
     * /
    /** Validate the page order */
    let requestedPageOrder, currentPageOrder;
    Object.entries(actionSequence).forEach(([key, value]) => {
      if (currentPage === key) {
        currentPageOrder = value;
      }
      if (selectedPage === key) {
        requestedPageOrder = value;
      }
    });

    if (
      requestedPageOrder <= currentPageOrder ||
      requestedPageOrder - currentPageOrder > 1
    ) {
      return false;
    }

    return true;
  };

  const manageBtnStatus = (btn) => {
    if (!isUserRoomCreator) {
      return;
    }
    const rslt = validatePageSequence(btn);
    if (!rslt) {
      return;
    }

    /** Clear interval and update time bar css if it exist */
    resetTimeCounter();
    /** To disable the time */
    setDisableTimer(true);

    /** Button status logic */
    const btns = document.getElementById("buttons");
    Array.from(btns.children).forEach((b) => {
      if (b.id === btn) {
        b.classList.remove("inactive");
      } else {
        b.classList.add("inactive");
      }
    });
    mangeActionPages(btn);
  };

  const startCountDown = () => {    
    /** to enable reset button */
    // setTimerStart(true);

    /** timer logic */
    let timeBare = document.getElementById("time-counter");
    const limit = document.getElementById("count-down-value").innerHTML;
    let timeRemain = Number(limit) * 60;
    window.intervalVal = setInterval(() => {
      timeRemain -= 1;
      const rslt = Math.trunc(100 - (timeRemain * 100) / (Number(limit) * 60));
      timeBare.style.width = `${rslt}%`;
      if (rslt > 85) {
        timeBare.style.backgroundColor = "red";
      }
      if (timeRemain === 0) {
        clearInterval(window.intervalVal);
      }
    }, 1000);
  };

  const changeTimerValue = (val) => {
    if (!isUserRoomCreator) {
      return;
    }

    const limitSpan = document.getElementById("count-down-value");
    const limit = Number(limitSpan.innerHTML);
    if ((limit === 1 && val === -1) || (limit === 9 && val === 1)) {
      return;
    }
    limitSpan.innerHTML = `${limit + val}`;
  };

  const manageThinkTime = (type) => {
    if (!isUserRoomCreator || disableTimer) {
      return;
    }

    let timer_flag
    if (type === 'start') {
      /** When the tab is changed other than think */
      timer_flag = true;
    }
    if (type === 'reset') {
      timer_flag = false;
    }
    socket.emit("set_time_count_down", {roomId: roomInfo.id, timer_flag});
  }

  useEffect(() => {
    if (!socket) return;

    socket.on("timer_start", (data) => {
      if (data.timerStarted) {
        startCountDown();
      } else {
        resetTimeCounter();
      }
      setRoomInfo(data)
    })
  }, [socket])

  return (
    <div className="action-menu">
      <div className="action-menu-manager">
        <div className="time-setting">
          <span className="timer-adjustment" onClick={() => changeTimerValue(-1)}>
            -
          </span>
          0:0<span id="count-down-value">2</span>
          <span className="timer-adjustment" onClick={() => changeTimerValue(1)}>
            +
          </span>
        </div>
        {roomInfo.timerStarted ? (
          <span className="time-start-btn" onClick={() => manageThinkTime('reset')}>
            Reset
          </span>
        ) : (
          <span className="time-start-btn" onClick={() => manageThinkTime('start')}>
            Set
          </span>
        )}
      </div>
      <div className="action-menu-separator">|</div>
      <div id="buttons" className="action-menu-btns">
        <button
          id="think"
          className={`${currentPage === "think" ? "" : "inactive"} ${
            isUserRoomCreator ? "" : "disabledBtn"
          }`}
          onClick={() => manageBtnStatus("think")}
        >
          Think
        </button>
        <button
          id="group"
          className={`${currentPage === "group" ? "" : "inactive"} ${
            isUserRoomCreator ? "" : "disabledButton"
          }`}
          onClick={() => manageBtnStatus("group")}
        >
          Group
        </button>
        <button
          id="vote"
          className={`${currentPage === "vote" ? "" : "inactive"} ${
            isUserRoomCreator ? "" : "disabledButton"
          }`}
          onClick={() => manageBtnStatus("vote")}
        >
          Vote
        </button>
        <button
          id="discuss"
          className={`${currentPage === "discuss" ? "" : "inactive"} ${
            isUserRoomCreator ? "" : "disabledButton"
          }`}
          onClick={() => manageBtnStatus("discuss")}
        >
          Discuss
        </button>
        <button
          id="summery"
          className={`${currentPage === "summery" ? "" : "inactive"} ${
            isUserRoomCreator ? "" : "disabledButton"
          }`}
          onClick={() => manageBtnStatus("summery")}
        >
          Summery
        </button>
      </div>
      <div className="action-menu-timer-bar">
        <div id="time-counter"></div>
      </div>
    </div>
  );
}

export default ActionMenu;
