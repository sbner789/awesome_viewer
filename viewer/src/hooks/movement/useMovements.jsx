import React, { useEffect, useRef, useState } from "react";
import useCanvas from "../canvas/useCanvas";

const defaultPosition = { x: 0, y: 0 };

const useMovements = ({
  canvasRef,
  moveRef,
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
  const viewPosRef = useRef(defaultPosition);
  const startPosRef = useRef(defaultPosition);
  const checkWheelRef = useRef(defaultPosition);
  const wheelPanningRef = useRef(false);
  const viewPanningRef = useRef(false);

  const { imageSetup, getCanvasCoordinates } = useCanvas({
    canvasRef: canvasRef,
    scale: scale,
  });

  const handleStartMove = (e) => {
    const { offsetX, offsetY } = getCanvasCoordinates(e);
    startPosRef.current = {
      x: offsetX - viewPosRef.current.x,
      y: offsetY - viewPosRef.current.y,
    };
    panningRef.current = true;
  };

  const handleMove = (e) => {
    const { offsetX, offsetY } = getCanvasCoordinates(e);
    if (!panningRef.current) return;
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

  // const handleWheel = (e) => {
  //   const { offsetX, offsetY } = getCanvasCoordinates(e);

  //   const deltaY = -e.deltaY;
  //   const wheelScale = deltaY > 0 ? scale * 1.02 : scale / 1.02;

  //   checkWheelRef.current = {
  //     x: offsetX - viewPosRef.current.x,
  //     y: offsetY - viewPosRef.current.y,
  //   };

  //   console.log(
  //     "checkX",
  //     checkWheelRef.current.x,
  //     "checkY",
  //     checkWheelRef.current.y
  //   );

  //   if (wheelScale >= 1 && wheelScale <= 40) {
  //     setScale(wheelScale);
  //     let finalX = offsetX - checkWheelRef.current.x;
  //     let finalY = offsetY - checkWheelRef.current.y;
  //     viewPosRef.current = {
  //       x: finalX,
  //       y: finalY,
  //     };
  //     console.log("viewX", viewPosRef.current.x, "viewY", viewPosRef.current.y);
  //   }

  //   requestAnimationFrame(() => {
  //     imageSetup({
  //       viewX: viewPosRef.current.x,
  //       viewY: viewPosRef.current.y,
  //       rotate: rotate,
  //       img: useImg,
  //     });
  //     setTransCoord({
  //       x: viewPosRef.current.x,
  //       y: viewPosRef.current.y,
  //     });
  //   });
  // };

  const handleWheel = (e) => {
    const { offsetX, offsetY } = getCanvasCoordinates(e);

    const wheelData = e.deltaY < 0 ? 1 : -1;
    setScale((prevZoom) => {
      const newZoom = prevZoom + wheelData * 0.5;
      return Math.max(1, Math.min(newZoom, 5));
    });
    console.log("okay");
    const moveset = moveRef;
    if (moveset) {
      const rect = moveset.getBoundingClientRect();
      const x = (offsetX / moveset.width) * 100;
      const y = (offsetY / moveset.height) * 100;
      console.log({ x }, { y });
      moveset.style.translate = `${x}% ${y}%`;
    }
  };

  const handleStopMove = () => {
    panningRef.current = false;
  };

  const handleRotate = (rot) => {
    setRotate((prev) => prev + rot);
  };

  const handleZoom = (zoom) => {
    setScale((prev) => prev + zoom);
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
    handleZoom,
    handleNext,
    handlePrev,
    viewPosRef,
    handleWheel,
    // handleWheelMove,
  };
};
export default useMovements;
