import React from "react";

import "./retro.css";
import ThinkColumn from "./ThinkColumn";

function ThinkColumns({ roomInfo, manageRetroCategoryChanges }) {
  return (
    <div className="retro-columns">
      {roomInfo.retroCategory
        .sort((a, b) => (a.orderId > b.orderId ? 1 : -1))
        .map((category, index) => {
          return (
            <ThinkColumn
              key={index}
              arrayIndex={index}
              category={category}
              manageRetroCategoryChanges={manageRetroCategoryChanges}
            />
          );
        })}
    </div>
  );
}

export default ThinkColumns;
