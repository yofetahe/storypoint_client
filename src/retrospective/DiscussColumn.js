import React, { useEffect, useState } from "react";

import "./retro.css";

function DiscussColumn({ socket, retroCategory, roomInfo }) {
  const [allInputs, setAllInputs] = useState([]);

  const collectAllInput = () => {
    roomInfo.retroCategory.forEach((category) => {
      category.attendeeInput.forEach((input) => {
        setAllInputs((previousData) => {
          return [...previousData, input];
        });
      });
    });
    allInputs.sort((a, b) => b.vote - a.vote);
    /* TODO: needs group by vote and render by vote group at once */
  };

  useEffect(() => {
    collectAllInput();
  }, []);

  return (
    <div>
      {allInputs.map((input, index) => {
        return (
          <div key={index} className="category-input">
            {input.content} - {input.vote}
          </div>
        );
      })}
    </div>
  );
}

export default DiscussColumn;
