import React from "react";

import "./vote.css";

function VoteColumn({ category, manageCategoryInputVote }) {
  const disableVoteButton = (categoryId, inputId) => {
    manageCategoryInputVote(categoryId, inputId);
    document.getElementById(`voteBtn_${inputId}`).remove();    
  };

  return (
    <div key={category.id} className="retro-category">
      <div className="category-title">{category.title}</div>
      <div className="category-description">{category.description}</div>
      {category.attendeeInput?.length === 0 ? (
        <div className="category-input">--- No content ---</div>
      ) : (
        category.attendeeInput?.map((input, index) => {
          return (
            <div key={index} className="category-input">
              <div className="input-content">
                {input.content}{" "}
                <span
                  id={`voteBtn_${input.id}`}
                  className="voteButton"
                  onClick={() => disableVoteButton(category.id, input.id)}
                >
                  +
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default VoteColumn;
