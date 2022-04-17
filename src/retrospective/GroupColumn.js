import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

function GroupColumn({ socket, category, dragOver, dragDrop, dragStart }) {
  const [groupTitle, setGroupTitle] = useState("");

  const createGroup = () => {
    if (groupTitle === "") {
      return;
    }
    let groupedInput = { id: '', title: groupTitle, groupedInputIds: [] }
    /** Get contents to be grouped */
    const grouped_content = document.getElementById(
      `group-content-${category.id}`
    ).innerHTML;
    const parser = new DOMParser();
    const doc = parser.parseFromString(grouped_content, "text/html");
    const addedContent = doc.body;

    /** To create a group min two content is required */
    if (Array.from(addedContent.children).length === 1) {
      return;
    }

    /** Create the draggable div */
    const groupDiv = document.createElement("div");
    groupDiv.setAttribute("id", `${category.id}_100`);
    groupDiv.setAttribute("data-index", `${category.id}_100`);
    groupDiv.setAttribute("draggable", "true");
    groupDiv.classList.add("category-input");
    groupDiv.classList.add("grouped-content");
    groupDiv.addEventListener("dragstart", (ev) => dragStart(ev));

    /** Group Title */
    const title = document.createElement("div");
    title.classList.add("group-title");
    title.innerHTML = groupTitle;
    groupDiv.appendChild(title);

    /** Group Content */
    Array.from(addedContent.children).forEach((cont) => {
      groupedInput.groupedInputIds.push(cont['id'].split('_')[1]);
      cont.classList.remove("category-input");
      cont.classList.add("group-content-item");
      groupDiv.appendChild(cont);
    });

    /** Create external container div */
    const containerDiv = document.createElement("div");
    containerDiv.setAttribute("id", `Container_${category.id}_100`);
    containerDiv.classList.add("category-input-container");
    containerDiv.appendChild(groupDiv);

    /** Getting the draggable-container to append the group to */
    document
      .getElementById(`Container_${category.id}`)
      .appendChild(containerDiv);

    /** Reset grouping form */
    const titleElement = document.getElementById(`group-title-${category.id}`);
    titleElement.value = "";
    titleElement.classList.remove("enable-form-element");
    titleElement.classList.add("disable-form-element");
    document.getElementById(`group-content-${category.id}`).innerHTML = "";
    const createGroupBtn = document.getElementById(`create-group-btn-${category.id}`);
    createGroupBtn.classList.remove("enable-form-element");
    createGroupBtn.classList.add("disable-form-element");
    const cancelGroupBtn = document.getElementById(`cancel-group-btn-${category.id}`);
    cancelGroupBtn.classList.remove("enable-form-element");
    cancelGroupBtn.classList.add("disable-form-element");

    /** TODO: Needs to update grouping data on the backend */
    groupedInput.id = uuidv4();
    console.log(groupedInput);
  };

  const cancelGroupCreation = () => {

  }

  return (
    <div key={category.id} id={category.id} className="retro-category">
      <div className="category-title">{category.title}</div>
      <div className="group-create-form">
        <input
          id={`group-title-${category.id}`}
          className="group-title disable-form-element"
          type="text"
          placeholder="Group Title"
          onChange={(e) => setGroupTitle(e.target.value)}
        />
        <div
          id={`group-content-${category.id}`}
          className="group-content"
          onDragOver={(ev) => dragOver(ev)}
          onDrop={(ev) => dragDrop(ev)}
          data-placeholder="Grouping - Drag & Drop the input"
        ></div>
        <button
          id={`create-group-btn-${category.id}`}
          onClick={() => createGroup()}
          className="disable-form-element"
        >
          Create Group
        </button>
        <button
          id={`cancel-group-btn-${category.id}`}
          onClick={() => cancelGroupCreation()}
          className="disable-form-element"
        >
          Cancel
        </button>
      </div>
      <div
        className="draggable-container"
        id={`Container_${category.id}`}
        onDragOver={(ev) => dragOver(ev)}
        onDrop={(ev) => dragDrop(ev)}
      >
        <div
          className={`category-no-input ${
            category.attendeeInput?.length === 0 ? "" : "display-no-input"
          }`}
        >
          --- No content ---
        </div>
        {category.attendeeInput?.map((input, index) => {
          return (
            <div
              key={`Container_${category.id}_${input.id}`}
              id={`Container_${category.id}_${input.id}`}
              className="category-input-container"
            >
              <div
                id={`${category.id}_${input.id}`}
                data-index={`${category.id}_${input.id}`}
                key={index}
                className="category-block category-input"
                draggable="true"
              >
                {input.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GroupColumn;
