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
  // const viewPosRef = useRef(defaultPosition);
  const images = [img1, img2]; // test images, later use api data.
  const [transCoord, setTransCoord] = useState(defaultPosition);
  const [scaleValue, setScaleValue] = useState(1);
  const [rotateValue, setRotateValue] = useState(0);
  const [currentImg, setCurrentImg] = useState(0);
  const [isMove, setIsMove] = useState(true);
  const [isDrawRect, setIsDrawRect] = useState(false);

  const {
    handleStartMove,
    handleMove,
    handleStopMove,
    handleRotate,
    handleNext,
    handlePrev,
    handleWheel,
    wheelRef,
    handleButtonZoom,
    translateOffset,
    viewPosRef,
    templateRef,
  } = useMovements({
    canvasRef: canvasRef,
    useImg: imageRef.current,
    images: images,
    currentImg: currentImg,
    setCurrentImg: setCurrentImg,
    scale: scaleValue,
    setScale: setScaleValue,
    rotate: rotateValue,
    setRotate: setRotateValue,
    setTransCoord: setTransCoord,
  });

  const { drawStartRect, drawRect, drawEndRect, saveRect } = useDrawCanvas({
    canvasRef: canvasRef,
    useImg: imageRef.current,
    currentImg: currentImg,
    scale: scaleValue,
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
  }, [rotateValue, currentImg]);

  return (
    <div>
      <div
        ref={wheelRef}
        style={{
          position: "relative",
          border: "2px solid red",
          width: "1920px",
          height: "1080px",
          overflow: "hidden",
        }}
        onWheel={(e) => {
          isMove && handleWheel(e);
        }}
      >
        <div
          ref={templateRef}
          style={{
            position: "relative",
            top: 0,
            left: 0,
            border: "2px solid blue",
            transform: `translate(${translateOffset.x}px, ${translateOffset.y}px) scale(${scaleValue})`,
            transformOrigin: "0 0",
          }}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={(e) => {
              isDrawRect && drawStartRect(e);
              isMove && handleStartMove(e);
            }}
            onMouseMove={(e) => {
              isDrawRect && drawRect(e);
              isMove && handleMove(e);
            }}
            onMouseUp={(e) => {
              isDrawRect && drawEndRect(e);
              isMove && handleStopMove(e);
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
        <button onClick={handleNext}>Next</button>
        <button onClick={handlePrev}>Prev</button>
        <button
          onClick={() => {
            handleButtonZoom("in");
          }}
          disabled={scaleValue >= 40}
        >
          zoom in
        </button>
        <button
          onClick={() => {
            handleButtonZoom("out");
          }}
          disabled={scaleValue <= 1}
        >
          zoom out
        </button>
        <button
          onClick={() => {
            handleRotate(30);
          }}
        >
          rotate +30
        </button>
        <button
          onClick={() => {
            handleRotate(-30);
          }}
        >
          rotate -30
        </button>
      </div>
    </div>
  );
};
export default Viewer;
