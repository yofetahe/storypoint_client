import React, { useState } from "react";

function ThinkColumn({ arrayIndex, category, manageRetroCategoryChanges }) {
  const [categoryInput, setCategoryInput] = useState("");

  const addCategoryInput = (e) => {
    // && (e.key === 'Enter' || e.code === "NumpadEnter")
    if (categoryInput.trim() !== "") {
      manageRetroCategoryChanges(category.id, categoryInput);
    }
    document.getElementsByTagName("textarea")[arrayIndex].value = "";
    setCategoryInput("");
  };

  return (
    <div key={category.id} className="retro-category">
      <div className="category-title">{category.title}</div>
      <div className="category-description">{category.description}</div>
      <div className="category-input-form">
        <textarea
          placeholder="What do you think?"
          onChange={(event) => setCategoryInput(event.target.value)}
          //   onKeyDown={addInput}
        ></textarea>
        <button onClick={() => addCategoryInput()}> Add </button>
      </div>
      {category.attendeeInput?.length === 0 ? (
        <div className="category-input">--- No content ---</div>
      ) : (
        category.attendeeInput?.map((input, index) => {
          return (
            <div key={index} className="category-input">
              <div className="category-input-blur">{input.content}</div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ThinkColumn;
