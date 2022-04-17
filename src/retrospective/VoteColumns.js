import React from "react";
import VoteColumn from "./VoteColumn";

function VoteColumns({ roomInfo, manageCategoryInputVote }) {
  return (
    <div className="retro-columns">
      {roomInfo.retroCategory
        .sort((a, b) => (a.orderId > b.orderId ? 1 : -1))
        .map((category, index) => {
          return (
            <VoteColumn
              key={index}
              arrayIndex={index}
              category={category}
              manageCategoryInputVote={manageCategoryInputVote}
            />
          );
        })}
    </div>
  );
}

export default VoteColumns;
