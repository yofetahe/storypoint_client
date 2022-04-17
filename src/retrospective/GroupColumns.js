import React, { useEffect } from "react";
import GroupColumn from "./GroupColumn";

import "./group.css";

function GroupColumns({ socket, roomInfo }) {
  let dragStartIndex;

  const swapItem = (fromIndex, toIndex) => {
    /** get the required data */
    const fromArray = fromIndex.split("_");
    const categoryId = fromArray[0];
    const index = fromArray[1];
    const element = `
      <div
        id=${categoryId}_${index}
        data-index=${categoryId}_${index}
        key=${index}
      >
        ${document.getElementById(fromIndex).innerHTML}
      </div>`;

    /* Gray-out merged input parent value */
    const itemFromContainer = document.getElementById(`Container_${fromIndex}`);
    itemFromContainer.style.color = "silver";

    /** Set draggable property to false  */
    const itemFrom = document.getElementById(`${fromIndex}`);
    itemFrom.setAttribute("draggable", "false");

    /** Update the new parent div */
    const itemTo = document.getElementById(`${toIndex}`);
    itemTo.insertAdjacentHTML("afterend", element);
    itemTo.setAttribute("draggable", "false");

    /** Add CSS for the appended content */
    const draggedItem = document.getElementById(`${categoryId}_${index}`);
    draggedItem.classList.add("appended-content");
    draggedItem.setAttribute("draggable", "true");
  };

  const dragStart = (ev, draggable) => {
    // console.log('Event: ', 'dragstart');
    // dragStartIndex = draggable.closest("div").getAttribute("data-index");
    ev.dataTransfer.dropEffect = "move";
    ev.dataTransfer.setData("text/id", ev.target.id);
    ev.dataTransfer.setData("text/plain", ev.target.innerText);
    ev.dataTransfer.setData("text/html", ev.target.outerHTML);
    ev.dataTransfer.setData(
      "text/uri-list",
      ev.target.ownerDocument.location.href
    );
  };

  const dragEnter = (ev, item) => {
    // console.log('Event: ', 'dragenter');
    // item.classList.add("over"); // over css
  };

  const dragOver = (ev, item) => {
    // console.log('Event: ', 'dragover');
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
  };

  const dragDrop = (ev, item) => {
    // console.log('Event: ', 'dragdrop');
    // const dragEndIndex = item.getAttribute("data-index");
    // swapItem(dragStartIndex, dragEndIndex);
    // item.classList.remove("over");
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text/id");

    /** To add content for the grouping */
    if (ev.target.className === "group-content") {
      const htmlVal = document.getElementById(data);
      htmlVal.setAttribute("draggable", "false");
      ev.target.appendChild(htmlVal);

      /** Enabling the group create form input and button */
      const catId = ev.target.firstChild['id'].split('_')[0];
      const title = document.getElementById(`group-title-${catId}`);
      title.classList.remove("disable-form-element");
      title.classList.add("enable-form-element");
      const createGroupBtn = document.getElementById(`create-group-btn-${catId}`);
      createGroupBtn.classList.add("enable-form-element");
      const cancelGroupBtn = document.getElementById(`cancel-group-btn-${catId}`);
      cancelGroupBtn.classList.add("enable-form-element");
    }

    /** To move content from column to column */
    if (ev.target.className === "draggable-container") {
      ev.target.appendChild(document.getElementById(data));
      Array.from(ev.target.children).forEach((child) => {
        if (child.className.trim() === "category-no-input") {
          child.classList.add("display-no-input");
        }
      });
    }
  };

  const dragLeave = (ev, item) => {
    // console.log('Event: ', 'dragleave');
    // item.classList.remove("over"); // over css
  };

  const addDragEventListners = () => {
    const draggables = document.querySelectorAll(".category-input"); // draggable
    const dragListItems = document.querySelectorAll(".category-input"); // draggable-list(ul) li

    draggables.forEach((draggable) => {
      draggable.addEventListener("dragstart", (ev) => dragStart(ev, draggable));
    });

    dragListItems.forEach((item) => {
      item.addEventListener("dragover", (ev) => dragOver(ev, item));
      item.addEventListener("drop", (ev) => dragDrop(ev, item));
      item.addEventListener("dragenter", (ev) => dragEnter(ev, item));
      item.addEventListener("dragleave", (ev) => dragLeave(ev, item));
    });
  };

  useEffect(() => {
    addDragEventListners();
  }, []);

  return (
    <div className="retro-columns">
      {roomInfo.retroCategory
        .sort((a, b) => (a.orderId > b.orderId ? 1 : -1))
        .map((category, index) => {
          return (
            <GroupColumn
              key={index}
              arrayIndex={index}
              socket={socket}
              category={category}
              dragOver={dragOver}
              dragDrop={dragDrop}
              dragStart={dragStart}
            />
          );
        })}
    </div>
  );
}

export default GroupColumns;
