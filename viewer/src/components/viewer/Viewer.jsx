import React, { useEffect, useRef, useState } from "react";
import img1 from "../../test_images/newjeans-minji.jpg";
import img2 from "../../test_images/won-young.jpg";
import useCanvas from "../../hooks/canvas/useCanvas";
import useDrawCanvas from "../../hooks/draw/useDrawCanvas";
import useMovements from "../../hooks/movement/useMovements";

const defaultPosition = { x: 0, y: 0 };

const Viewer = () => {
  const canvasRef = useRef(null);
  const imageRef = useRef(new Image());
  const images = [img1, img2]; // test images, later use api data.
  const [transCoord, setTransCoord] = useState(defaultPosition);
  const [scaleValue, setScaleValue] = useState(1);
  const [rotateValue, setRotateValue] = useState(0);
  const [currentImg, setCurrentImg] = useState(0);
  const [isMove, setIsMove] = useState(true);
  const [isDrawRect, setIsDrawRect] = useState(false);

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const offsetX = (e.clientX - rect.left) / scaleValue;
    const offsetY = (e.clientY - rect.top) / scaleValue;

    return { offsetX, offsetY };
  };

  const { handleStartMove, handleMove, handleStopMove, viewPosRef } =
    useMovements({
      canvasRef: canvasRef,
      useImg: imageRef.current,
      scale: scaleValue,
      coordinates: getCanvasCoordinates,
      rotate: rotateValue,
      setTransCoord: setTransCoord,
    });

  const { drawStartRect, drawRect, drawEndRect, saveRect } = useDrawCanvas({
    canvasRef: canvasRef,
    useImg: imageRef.current,
    currentImg: currentImg,
    scale: scaleValue,
    coordinates: getCanvasCoordinates,
    viewPosition: viewPosRef.current,
    rotate: rotateValue,
  });

  const { loadImage } = useCanvas({
    canvasRef: canvasRef,
    width: 1920,
    height: 1080,
    useImg: imageRef.current,
    images: images,
    currentImg: currentImg,
    scale: scaleValue,
    viewPosition: viewPosRef.current,
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
          <canvas
            ref={canvasRef}
            onMouseDown={(e) => {
              isMove && handleStartMove(e);
              isDrawRect && drawStartRect(e);
            }}
            onMouseMove={(e) => {
              isMove && handleMove(e);
              isDrawRect && drawRect(e);
            }}
            onMouseUp={(e) => {
              isMove && handleStopMove(e);
              isDrawRect && drawEndRect(e);
            }}
          ></canvas>
          <svg
            width={1920}
            height={1080}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
              transform: `translate(${transCoord.x}px, ${transCoord.y}px) rotate(${rotateValue}deg)`,
            }}
          >
            {saveRect.map((el) => {
              if (el.img_id === currentImg)
                return (
                  <rect
                    key={el.key}
                    width={el.props.width}
                    height={el.props.height}
                    x={el.props.x}
                    y={el.props.y}
                    stroke={el.props.stroke}
                    strokeWidth={el.props.strokeWidth}
                    fill={el.props.fill}
                    transform={el.props.transform}
                  />
                );
            })}
          </svg>
        </div>
      </div>
      <div>
        <button
          onClick={() => {
            setIsDrawRect(!isDrawRect);
            isDrawRect ? setIsMove(true) : setIsMove(false);
          }}
        >
          {isDrawRect ? "Stop Rect" : "Start Rect"}
        </button>
      </div>
    </div>
  );
};
export default Viewer;
