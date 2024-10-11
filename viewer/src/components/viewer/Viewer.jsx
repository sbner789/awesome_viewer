import React, { useEffect, useRef, useState } from "react";
import img1 from "../../test_images/newjeans-minji.jpg";
import img2 from "../../test_images/won-young.jpg";
import useCanvas from "../../hooks/canvas/useCanvas";

const defaultPosition = { x: 0, y: 0 };

const Viewer = () => {
  const canvasRef = useRef(null);
  const imageRef = useRef(new Image());
  const images = [img1, img2]; // test images, later use api data.
  const [viewPosition, setViewPosition] = useState(defaultPosition);
  const [startPosition, setStartPosition] = useState(defaultPosition);
  const [transCoord, setTransCoord] = useState(defaultPosition);
  const [scaleValue, setScaleValue] = useState(1);
  const [rotateValue, setRotateValue] = useState(0);
  const [currentImg, setCurrentImg] = useState(0);
  const [moveState, setMoveState] = useState(true);
  const [isDrawRect, setIsDrawRect] = useState(false);

  const { loadImage } = useCanvas({
    useCanvas: canvasRef,
    width: 1920,
    height: 1080,
    useImg: imageRef.current,
    images: images,
    currentImg: currentImg,
    scale: scaleValue,
    viewPosition: viewPosition,
    rotate: rotateValue,
  });

  useEffect(() => {
    loadImage();
  });

  return (
    <div>
      <div
        style={{
          position: "relative",
          border: "2px solid red",
          width: "1920px",
          height: "1080px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "1920px",
            height: "1080px",
            // transform: `scale(${scaleValue})`,
          }}
        >
          <canvas ref={canvasRef}></canvas>
        </div>
      </div>
    </div>
  );
};
export default Viewer;
