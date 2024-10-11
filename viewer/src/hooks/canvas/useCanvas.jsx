import React from "react";

const useCanvas = ({
  useCanvas,
  width,
  height,
  useImg,
  images,
  currentImg,
  scale,
  viewPosition,
  rotate,
}) => {
  const getCanvas = (canvasWidth, canvasHeight) => {
    const canvas = useCanvas.current;
    const context = canvas.getContext("2d");

    if (canvasWidth || canvasHeight != null) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }

    const imageWidth = canvas.width;
    const imageHeight = canvas.height;

    return {
      canvas,
      context,
      imageWidth,
      imageHeight,
    };
  };

  const { context, imageWidth, imageHeight } = getCanvas(width, height);

  const imageSetup = ({ viewX, viewY, img }) => {
    context.clearRect(0, 0, imageWidth, imageHeight);
    context.save();
    context.setTransform(1, 0, 0, 1, viewX, viewY);
    context.translate(imageWidth / 2, imageHeight / 2);
    context.rotate((rotate * Math.PI) / 180);
    context.drawImage(
      img,
      -imageWidth / 2,
      -imageHeight / 2,
      imageWidth,
      imageHeight
    );
    context.restore();
  };

  const loadImage = () => {
    useImg.src = images[currentImg];
    useImg.onload = () => {
      imageSetup({
        viewX: viewPosition.x,
        viewY: viewPosition.y,
        img: useImg,
      });
    };
  };

  return { loadImage };
};
export default useCanvas;
