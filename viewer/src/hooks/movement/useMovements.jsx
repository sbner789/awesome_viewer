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
  const viewPosRef = useRef(defaultPosition);
  const startPosRef = useRef(defaultPosition);
  const checkWheelRef = useRef(defaultPosition);
  const prevCheckRef = useRef(defaultPosition);
  const prevViewRef = useRef(defaultPosition);

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

  const handleWheel = (e) => {
    const { offsetX, offsetY } = getCanvasCoordinates(e);

    const deltaY = -e.deltaY;
    const wheelScale = deltaY > 0 ? scale * 1.02 : scale / 1.02;

    prevCheckRef.current = {
      x: checkWheelRef.current.x,
      y: checkWheelRef.current.y,
    };

    checkWheelRef.current = {
      x: offsetX - viewPosRef.current.x,
      y: offsetY - viewPosRef.current.y,
    };

    console.log(
      "prevX",
      prevCheckRef.current.x,
      "prevY",
      prevCheckRef.current.y,
      "checkX",
      checkWheelRef.current.x,
      "checkY",
      checkWheelRef.current.y,
      "viewX",
      viewPosRef.current.x,
      "viewY",
      viewPosRef.current.y
    );

    if (wheelScale >= 1 && wheelScale <= 40) {
      setScale(wheelScale);
      // let finalX = offsetX + checkWheelRef.current.x;
      // let finalY = offsetY + checkWheelRef.current.y;

      viewPosRef.current = {
        x: offsetX - checkWheelRef.current.x,
        y: offsetY - checkWheelRef.current.y,
      };
    }

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
  };
};
export default useMovements;
