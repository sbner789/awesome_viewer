import React, { useRef, useState } from "react";
import useCanvas from "../canvas/useCanvas";

const defaultPosition = { x: 0, y: 0 };

const useDrawCanvas = ({
  canvasRef,
  useImg,
  currentImg,
  scale,
  viewPosition,
  rotate,
}) => {
  const [saveRect, setSaveRect] = useState([]);
  const isDrawingRectRef = useRef(false);
  const rectPosRef = useRef(defaultPosition);
  const svgRectCoordRef = useRef(defaultPosition);

  const { getCanvas, imageSetup, getCanvasCoordinates, getSvgCoordinates } =
    useCanvas({
      canvasRef: canvasRef,
      scale: scale,
      rotate: rotate,
    });

  const drawStartRect = (e) => {
    const { offsetX, offsetY } = getCanvasCoordinates(e);
    const { offsetSvgX, offsetSvgY } = getSvgCoordinates(e);

    isDrawingRectRef.current = true;
    rectPosRef.current = {
      x: offsetX,
      y: offsetY,
    };
    svgRectCoordRef.current = {
      x: offsetSvgX,
      y: offsetSvgY,
    };

    const { context } = getCanvas();
    context.beginPath();
  };

  const drawRect = (e) => {
    if (!isDrawingRectRef.current) return;
    const { offsetX, offsetY } = getCanvasCoordinates(e);
    const { context } = getCanvas();

    requestAnimationFrame(() => {
      imageSetup({
        viewX: viewPosition.x,
        viewY: viewPosition.y,
        rotate: rotate,
        img: useImg,
      });
      context.save();
      context.strokeStyle = "red";
      context.strokeRect(
        rectPosRef.current.x,
        rectPosRef.current.y,
        offsetX - rectPosRef.current.x,
        e.shiftKey
          ? offsetX - rectPosRef.current.x
          : offsetY - rectPosRef.current.y
      );
      context.restore();
    });
  };

  const drawEndRect = (e) => {
    isDrawingRectRef.current = false;
    drawConvertToSVG(e);
  };

  const drawConvertToSVG = (e) => {
    const { offsetX, offsetY } = getCanvasCoordinates(e);
    const svgPathX = rectPosRef.current.x;
    const svgPathY = rectPosRef.current.y;
    const svgRotatePathX = svgRectCoordRef.current.x;
    const svgRotatePathY = svgRectCoordRef.current.y;

    const rectX = svgRotatePathX;
    const rectY = svgRotatePathY;
    const rectWidth = offsetX - svgPathX;
    const rectHeight = e.shiftKey ? offsetX - svgPathX : offsetY - svgPathY;

    if (rectWidth > 0 && rectHeight > 0) {
      const newSvgRect = (
        <rect
          key={saveRect.length}
          x={rectX - viewPosition.x}
          y={rectY - viewPosition.y}
          width={Math.abs(rectWidth)}
          height={Math.abs(rectHeight)}
          stroke="red"
          strokeWidth="2"
          fill="none"
          transform={`rotate(${-rotate},${svgRotatePathX},${svgRotatePathY})`}
        />
      );
      setSaveRect((prev) => [
        ...prev,
        {
          img_id: currentImg,
          key: newSvgRect.key,
          type: newSvgRect.type,
          props: newSvgRect.props,
        },
      ]);
    }
  };

  return { drawStartRect, drawRect, drawEndRect, saveRect };
};
export default useDrawCanvas;
