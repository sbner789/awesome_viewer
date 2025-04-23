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
  const getCanvas = (canvasW, canvasH) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (canvasW || canvasH != null) {
      canvas.width = canvasW;
      canvas.height = canvasH;
    }

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const imageWidth = canvasWidth;
    const imageHeight = canvasHeight;

    return {
      canvas,
      context,
      imageWidth,
      imageHeight,
      canvasWidth,
      canvasHeight,
    };
  };

  const imageSetup = ({ viewX, viewY, rotate, img, canvasW, canvasH }) => {
    const { context, imageWidth, imageHeight, canvasWidth, canvasHeight } =
      getCanvas(canvasW, canvasH);
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.save();
    context.setTransform(1, 0, 0, 1, viewX, viewY);
    context.translate(canvasWidth / 2, canvasHeight / 2);
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
