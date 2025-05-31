import React from "react";
import notfoundImage from "@/assets/NT.png";

const Notfound = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${notfoundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    ></div>
  );
};

export default Notfound;
