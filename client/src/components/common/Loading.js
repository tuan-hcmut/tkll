import React from "react";

const Loading = () => {
  return (
    <>
      <div className="w-[100%] h-[80vh] flex items-center justify-center z-40">
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default Loading;
