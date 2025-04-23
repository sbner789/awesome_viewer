import React, { useEffect, useRef, useState } from "react";
import useCanvas from "../canvas/useCanvas";

const defaultPosition = { x: 0, y: 0 };

const useMovements = ({
  canvasRef,
  useImg,
  images,
  currentImg,
  setCurrentImg,
  scale,
  setScale,
  rotate,
  setRotate,
  setTransCoord,
}) => {
  const panningRef = useRef(false);
  const wheelRef = useRef(null);
  const viewPosRef = useRef(defaultPosition);
  const startPosRef = useRef(defaultPosition);
  const lastMousePosRef = useRef(defaultPosition);
  const templateRef = useRef(null);
  const [translateOffset, setTranslateOffset] = useState(defaultPosition);
  // const [startDragOffset, setStartDragOffset] = useState(defaultPosition);

  const { imageSetup, getCanvasCoordinates } = useCanvas({
    canvasRef: canvasRef,
    scale: scale,
  });

  const zoomIntensity = 0.05;
  const maxScale = 40;
  const minScale = 1;

  const handleZoom = (direction, mouseX, mouseY) => {
    const newScale =
      direction === "in" ? scale + zoomIntensity : scale - zoomIntensity;
    const clampedScale = Math.min(Math.max(newScale, minScale), maxScale);

    const scaleRatio = clampedScale / scale;

    const newTranslateX =
      translateOffset.x - (mouseX - translateOffset.x) * (scaleRatio - 1);
    const newTranslateY =
      translateOffset.y - (mouseY - translateOffset.y) * (scaleRatio - 1);

    setScale(clampedScale);

    setTranslateOffset({
      x: clampedScale > 1 ? newTranslateX : 0,
      y: clampedScale > 1 ? newTranslateY : 0,
    });
  };

  const handleWheel = (e) => {
    const container = wheelRef.current;
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    lastMousePosRef.current = {
      x: mouseX,
      y: mouseY,
    };
    handleZoom(e.deltaY < 0 ? "in" : "out", mouseX, mouseY);
  };

  const handleButtonZoom = (direction) => {
    const container = wheelRef.current;
    const rect = container.getBoundingClientRect();

    const mouseX = lastMousePosRef.current.x || rect.width / 2;
    const mouseY = lastMousePosRef.current.y || rect.height / 2;
    handleZoom(direction, mouseX, mouseY);
  };

  const handleStartMove = (e) => {
    panningRef.current = true;

    const { offsetX, offsetY } = getCanvasCoordinates(e);

    startPosRef.current = {
      x: offsetX - viewPosRef.current.x,
      y: offsetY - viewPosRef.current.y,
    };
  };

  const handleMove = (e) => {
    if (!panningRef.current) return;
    const { offsetX, offsetY } = getCanvasCoordinates(e);

    viewPosRef.current = {
      x: offsetX - startPosRef.current.x,
      y: offsetY - startPosRef.current.y,
    };

    requestAnimationFrame(() => {
      imageSetup({
        viewX: viewPosRef.current.x,
        viewY: viewPosRef.current.y,
        rotate: rotate,
        img: useImg,
      });
      setTransCoord({
        x: viewPosRef.current.x,
        y: viewPosRef.current.y,
      });
    });
  };

  const handleStopMove = (e) => {
    panningRef.current = false;
  };

  const handleTest = (e) => {
    const container = useImg;
    const rect = container.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    console.log({ mouseX }, { mouseY }, "hello");
  };

  const handleRotate = (rot) => {
    setRotate((prev) => prev + rot);
  };

  const handleNext = () => {
    if (images.length - 1 > currentImg) {
      setCurrentImg((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentImg > 0) {
      setCurrentImg((prev) => prev - 1);
    }
  };

  return {
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
    handleTest,
  };
};
export default useMovements;
