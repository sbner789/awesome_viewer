import React, { useState, useRef, useEffect } from "react";
import img1 from "../../test_images/newjeans-minji.jpg";
// import "./test.css";

const ImageZoom = () => {
  const [scale, setScale] = useState(1); // 이미지 스케일 상태
  const [origin, setOrigin] = useState({ x: 50, y: 50 }); // 초기 transform-origin
  const imageRef = useRef(null); // 이미지 DOM 참조

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomSpeed = 0.001; // 줌인/줌아웃 속도
    let newScale = scale + e.deltaY * zoomSpeed;

    // 스케일 범위 제한 (최소 0.5배 ~ 최대 3배)
    if (newScale < 0.5) newScale = 1;
    if (newScale > 3) newScale = 3;

    const rect = imageRef.current.getBoundingClientRect();
    const offsetX = (e.clientX - rect.left) / rect.width;
    const offsetY = (e.clientY - rect.top) / rect.height;

    // 기존 transform-origin 값에 변동된 값 추가
    const newOriginX =
      origin.x + (offsetX - 0.5) * (1 - scale / newScale) * 100;
    const newOriginY =
      origin.y + (offsetY - 0.5) * (1 - scale / newScale) * 100;

    // transform-origin 업데이트
    setOrigin({ x: newOriginX, y: newOriginY });
    imageRef.current.style.transformOrigin = `${newOriginX}% ${newOriginY}%`;

    // 스케일 업데이트
    setScale(newScale);
    // imageRef.current.style.transform = `scale(${newScale})`;
  };

  return (
    <div
      className="image-container"
      onWheel={handleWheel}
      style={{
        position: "relative",
        width: "1920px",
        height: "1080px",
        overflow: "hidden",
        // cursor: dragging ? "grabbing" : "grab",
      }}
    >
      <img
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transform: `scale(${scale})`,
        }}
        ref={imageRef}
        src={img1}
        alt="Zoomable"
        className="zoomable-image"
      />
    </div>
  );
};

export default ImageZoom;
