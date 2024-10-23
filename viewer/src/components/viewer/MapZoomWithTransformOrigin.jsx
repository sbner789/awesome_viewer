import React, { useRef, useState } from "react";
import img1 from "../../test_images/newjeans-minji.jpg";

const MapZoomWithTransformOrigin = () => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  //   const [dragging, setDragging] = useState(false);
  //   const [startDragOffset, setStartDragOffset] = useState({ x: 0, y: 0 });

  const zoomIntensity = 0.1;
  const maxScale = 3;
  const minScale = 0.5;

  // 확대/축소를 처리하는 함수
  const handleZoom = (direction, mouseX, mouseY) => {
    const newScale =
      direction === "in" ? scale + zoomIntensity : scale - zoomIntensity;
    const clampedScale = Math.min(Math.max(newScale, minScale), maxScale); // 최대/최소 줌 제한

    const scaleRatio = clampedScale / scale;

    // 확대/축소 시 위치 보정
    const newTranslateX =
      translate.x - (mouseX - translate.x) * (scaleRatio - 1);
    const newTranslateY =
      translate.y - (mouseY - translate.y) * (scaleRatio - 1);

    setScale(clampedScale);
    setTranslate({
      x: newTranslateX,
      y: newTranslateY,
    });
  };

  // 휠로 줌인/줌아웃을 처리하는 함수
  const handleWheel = (e) => {
    e.preventDefault();
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    handleZoom(e.deltaY < 0 ? "in" : "out", mouseX, mouseY);
  };

  // 버튼으로 줌인/줌아웃을 처리하는 함수
  const handleButtonZoom = (direction) => {
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // 화면 중앙 좌표 계산
    const mouseX = rect.width / 2;
    const mouseY = rect.height / 2;

    handleZoom(direction, mouseX, mouseY);
  };

  //   // 마우스로 드래그 시작할 때 호출되는 함수
  //   const handleMouseDown = (e) => {
  //     setDragging(true);
  //     setStartDragOffset({
  //       x: e.clientX - translate.x,
  //       y: e.clientY - translate.y,
  //     });
  //   };

  //   // 드래그하는 동안 호출되는 함수
  //   const handleMouseMove = (e) => {
  //     if (!dragging) return;

  //     setTranslate({
  //       x: e.clientX - startDragOffset.x,
  //       y: e.clientY - startDragOffset.y,
  //     });
  //   };

  //   // 드래그가 끝났을 때 호출되는 함수
  //   const handleMouseUp = () => {
  //     setDragging(false);
  //   };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      //   onMouseDown={handleMouseDown}
      //   onMouseMove={handleMouseMove}
      //   onMouseUp={handleMouseUp}
      //   onMouseLeave={handleMouseUp}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        // cursor: dragging ? "grabbing" : "grab",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          //   top: 0,
          //   left: 0,
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transformOrigin: "0 0",
          pointerEvents: "none", // 이미지에서 마우스 이벤트가 발생하지 않도록 설정
        }}
      >
        <img src={img1} alt="Zoomable" width={1920} height={1080} />
      </div>
      {/* 줌인/줌아웃 버튼 */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={() => handleButtonZoom("in")}
          style={{ fontSize: "20px" }}
        >
          +
        </button>
        <button
          onClick={() => handleButtonZoom("out")}
          style={{ fontSize: "20px" }}
        >
          -
        </button>
      </div>
    </div>
  );
};

export default MapZoomWithTransformOrigin;
