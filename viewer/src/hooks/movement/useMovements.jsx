import React, { useRef, useState } from "react";
import useCanvas from "../canvas/useCanvas";

const defaultPosition = { x: 0, y: 0 };

const useMovements = ({
  canvasRef,
  useImg,
  scale,
  coordinates,
  rotate,
  setTransCoord,
}) => {
  const panningRef = useRef(false);
  const viewPosRef = useRef(defaultPosition);
  const startPosRef = useRef(defaultPosition);

  const handleStartMove = (e) => {
    const { offsetX, offsetY } = coordinates(e);
    startPosRef.current = {
      x: offsetX - viewPosRef.current.x,
      y: offsetY - viewPosRef.current.y,
    };
    panningRef.current = true;
  };

  const handleMove = (e) => {
    const { offsetX, offsetY } = coordinates(e);
    if (!panningRef.current) return;
    viewPosRef.current = {
      x: offsetX - startPosRef.current.x,
      y: offsetY - startPosRef.current.y,
    };

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    requestAnimationFrame(() => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.setTransform(
        1,
        0,
        0,
        1,
        viewPosRef.current.x,
        viewPosRef.current.y
      );
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate((rotate * Math.PI) / 180);
      context.drawImage(
        useImg,
        -imgWidth / 2,
        -imgHeight / 2,
        imgWidth,
        imgHeight
      );
      context.restore();
    });
    setTransCoord({
      x: viewPosRef.current.x,
      y: viewPosRef.current.y,
    });
  };

  const handleStopMove = () => {
    panningRef.current = false;
  };

  return {
    handleStartMove,
    handleMove,
    handleStopMove,
    viewPosRef,
  };
};
export default useMovements;
