import React from "react";

const ScentsTable = ({ data }) => {
  return (
    <>
      <ul>
        {data.map((scent) => {
          return (
            <li key={scent.id}>
              {scent.id}
              {scent.attributes.name}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default ScentsTable;
