import React from "react";

export default function Storys() {
  return (
    <div
      className="box"
      style={{
        paddingTop: "100px",
        padding: "24px",
        backgroundColor: "#fad0c4",
        height: "100%",
      }}
    >
      <h4>Component with interactions</h4>
      <div
        style={{ display: "flex", justifyContent: "center", padding: "24px" }}
      >
        <img src="https://images.pexels.com/photos/10955653/pexels-photo-10955653.jpeg?dpr=2&w=100" />
      </div>
      <p>You need to add to any interaction u want in the component</p>
      <button
        onClick={() =>
          window.open("https://www.pexels.com/@imadclicks", "_blank")
        }
        style={{
          color: "#3399FF",
          border: "1px solid",
          borderColor: "#3399FF",
          borderRadius: "3px",
          height: "30px",
          cursor: "pointer",
          position: "relative",
          zIndex: "2",
          width: "100%",
        }}
      >
        Follow Imad Clicks on pexels for amazing pictures
      </button>
    </div>
  );
}
