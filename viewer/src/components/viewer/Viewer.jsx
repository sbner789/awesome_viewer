import React, { useEffect, useRef, useState } from "react";
import img1 from "../../test_images/newjeans-minji.jpg";
import img2 from "../../test_images/won-young.jpg";
import useCanvas from "../../hooks/canvas/useCanvas";
import useDrawCanvas from "../../hooks/draw/useDrawCanvas";
import useMovements from "../../hooks/movement/useMovements";
import "./test.css";

const defaultPosition = { x: 0, y: 0 };
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

const Viewer = () => {
  const canvasRef = useRef(null);
  const wheelCotainerRef = useRef(null);
  const wheelMoveRef = useRef(null);
  const imageRef = useRef(new Image());
  const images = [img1, img2]; // test images, later use api data.
  const [transCoord, setTransCoord] = useState(defaultPosition);
  const [scaleValue, setScaleValue] = useState(1);
  const [rotateValue, setRotateValue] = useState(0);
  const [currentImg, setCurrentImg] = useState(0);
  const [isMove, setIsMove] = useState(true);
  const [isDrawRect, setIsDrawRect] = useState(false);
  const [transOrigin, setTransOrigin] = useState(defaultPosition);

  const {
    handleStartMove,
    handleMove,
    handleStopMove,
    handleRotate,
    // handleZoom,
    handleNext,
    handlePrev,
    viewPosRef,
    // handleWheel,
    // wheelRef,
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

  const handleWheelZoom = (e) => {
    const delta = getDelta(e);
    const mouse = {
      x: e.pageX - wheelCotainerRef.current.offsetLeft,
      y: e.pageY - wheelCotainerRef.current.offsetTop,
    };
    const offset = {
      x: wheelCotainerRef.current.scrollLeft,
      y: wheelCotainerRef.current.scrollTop,
    };
    const imageLoc = {
      x: mouse.x + offset.x,
      y: mouse.y + offset.y,
    };
    const zoomPoint = {
      x: imageLoc.x / scaleValue,
      y: imageLoc.y / scaleValue,
    };
    let newScale = clamp(scaleValue + delta * 0.1 * scaleValue, 1, 40);
    setScaleValue(newScale);
    const newZoomPoint = {
      x: zoomPoint.x * newScale,
      y: zoomPoint.y * newScale,
    };
    const newScroll = {
      x: newZoomPoint.x - mouse.x,
      y: newZoomPoint.y - mouse.y,
    };
    setTransOrigin({
      x: 0,
      y: 0,
    });
    wheelMoveRef.current.style.transform = `scale(${newScale})`;
    wheelCotainerRef.current.scrollTop = newScroll.y;
    wheelCotainerRef.current.scrollLeft = newScroll.x;
  };

  const handleZoom = (zoom) => {
    setScaleValue((prev) => prev + zoom);
    setTransOrigin({
      x: 50,
      y: 50,
    });
    wheelMoveRef.current.style.transform = `scale(${scaleValue})`;
  };

  useEffect(() => {
    loadImage();
    return () => {
      wheelCotainerRef.current.removeEventListener("wheel", handleWheelZoom);
    };
  }, [rotateValue, currentImg]);

  return (
    <div>
      <div
        ref={wheelCotainerRef}
        style={{
          position: "relative",
          border: "2px solid red",
          width: "1920px",
          height: "1080px",
          overflow: "hidden",
        }}
        onWheel={(e) => {
          handleWheelZoom(e);
        }}
      >
        <div
          // className="zoom"
          ref={wheelMoveRef}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transformOrigin: `${transOrigin.x}% ${transOrigin.y}%`,
            // transform: `scale(${scaleValue})`,
            // transformOrigin: `${wheelPos.x * 100}% ${wheelPos.y * 100}%`,
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
        <button onClick={handleNext}>Next</button>
        <button onClick={handlePrev}>Prev</button>
        <button
          onClick={() => {
            handleZoom(1);
          }}
          disabled={scaleValue >= 40}
        >
          zoom in
        </button>
        <button
          onClick={() => {
            handleZoom(-1);
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
