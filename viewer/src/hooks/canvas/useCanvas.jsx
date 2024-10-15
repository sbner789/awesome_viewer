const useCanvas = ({
  canvasRef,
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
    const canvas = canvasRef.current;
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

  const imageSetup = ({ viewX, viewY, rotate, img, canvasW, canvasH }) => {
    const { context, imageWidth, imageHeight } = getCanvas(canvasW, canvasH);
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
        rotate: rotate,
        img: useImg,
        canvasW: width,
        canvasH: height,
      });
    };
  };

  const getCanvasCoordinates = (e) => {
    const { canvas } = getCanvas();
    const rect = canvas.getBoundingClientRect();

    const offsetX = (e.clientX - rect.left) / scale;
    const offsetY = (e.clientY - rect.top) / scale;

    return { offsetX, offsetY };
  };

  const rotatePoint = (x, y, angle, centerX, centerY) => {
    const radians = (angle * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const dx = x - centerX;
    const dy = y - centerY;

    return {
      x: dx * cos - dy * sin + centerX,
      y: dx * sin + dy * cos + centerY,
    };
  };

  const getSvgCoordinates = (e) => {
    const { canvas } = getCanvas();
    const rect = canvas.getBoundingClientRect();

    const mouseX = (e.clientX - rect.left) / scale;
    const mouseY = (e.clientY - rect.top) / scale;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const { x: offsetSvgX, y: offsetSvgY } = rotatePoint(
      mouseX,
      mouseY,
      -rotate,
      centerX,
      centerY
    );

    return { offsetSvgX, offsetSvgY };
  };

  return {
    loadImage,
    getCanvas,
    imageSetup,
    getCanvasCoordinates,
    getSvgCoordinates,
  };
};
export default useCanvas;
