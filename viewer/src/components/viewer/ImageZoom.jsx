import React, { useState, useRef, useEffect } from "react";
import img1 from "../../test_images/newjeans-minji.jpg";
import "./test.css";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getDelta(event) {
  let delta = event.deltaY || event.wheelDelta || -event.deltaY;
  if (delta === undefined) {
    delta = event.detail;
  }
  return clamp(delta, -1, 1);
}

const ImageZoom = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [scale, setScale] = useState(1);
  const factor = 0.1;
  const maxScale = 100;

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = getDelta(e);
      const mouse = {
        x: e.pageX - container.offsetLeft,
        y: e.pageY - container.offsetTop,
      };
      const offset = {
        x: container.scrollLeft,
        y: container.scrollTop,
      };
      const imageLoc = {
        x: mouse.x + offset.x,
        y: mouse.y + offset.y,
      };
      const zoomPoint = {
        x: imageLoc.x / scale,
        y: imageLoc.y / scale,
      };

      let newScale = clamp(scale + delta * factor * scale, 1, maxScale);
      setScale(newScale);

      const newZoomPoint = {
        x: zoomPoint.x * newScale,
        y: zoomPoint.y * newScale,
      };

      const newScroll = {
        x: newZoomPoint.x - mouse.x,
        y: newZoomPoint.y - mouse.y,
      };

      image.style.transform = `scale(${newScale})`;
      container.scrollTop = newScroll.y;
      container.scrollLeft = newScroll.x;
    };

    container.addEventListener("wheel", handleWheel);

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [scale]);

  return (
    <div className="main">
      <div className="inner">
        <div className="container" ref={containerRef}>
          <div className="zoom" ref={imageRef} alt="Zoomable" />
        </div>
      </div>
    </div>
  );
};

export default ImageZoom;
