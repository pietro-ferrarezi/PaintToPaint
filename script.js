// Falta:
// Ferramenta de borracha
// Ferramenta balde de tinta

let modes = ["default", "glow"];
let shapes = ["square", "circle"];
let tools = ["brush", "eraser", "bucket"];

let nowMode = modes[0];
let nowColor = "#000000";
let lastPos = null;

const colors = [
  "#FF0000",
  "#FF1A00",
  "#FF3300",
  "#FF4D00",
  "#FF6600",
  "#FF8000",
  "#FF9900",
  "#FFB300",
  "#FFCC00",
  "#FFE600",
  "#FFFF00",
  "#CCFF00",
  "#99FF00",
  "#66FF00",
  "#33FF00",
  "#00FF00",
  "#00FF33",
  "#00FF66",
  "#00FF99",
  "#00FFCC",
  "#00FFFF",
  "#00CCFF",
  "#0099FF",
  "#0066FF",
  "#0033FF",
  "#0000FF",
  "#1A00FF",
  "#3300FF",
  "#4D00FF",
  "#6600FF",
  "#8000FF",
  "#9900FF",
  "#B300FF",
  "#CC00FF",
  "#E600FF",
  "#FF00FF",
];

let isPainting = false;

let stroke = 20;
let shape = shapes[0];
let tool = tools[0];

class Brush {
  constructor(shape, stroke, type, x, y) {
    this.shape = shape;
    this.stroke = stroke;
    this.type = type;
    this.x = x;
    this.y = y;
  }
}

const canvasCursor = document.querySelector(".canvasCursor");
const ctxC = canvasCursor.getContext("2d", {
  willReadFrequently: true,
});
const canvasDrawing = document.querySelector(".canvasDrawing");
const ctxD = canvasDrawing.getContext("2d", {
  willReadFrequently: true,
});

document.getElementById("glow").addEventListener("change", (e) => {
  if (e.target.checked) {
    nowMode = modes[1];
    nowColor = colors[0];
    document.getElementById("color").disabled = true;
    canvasDrawing.style.backgroundColor = "black";
    clean(canvasDrawing);
  } else {
    nowMode = modes[0];
    document.getElementById("color").disabled = false;
    canvasDrawing.style.backgroundColor = "white";
    clean(canvasDrawing);
  }
});

document.getElementById("color").addEventListener("change", (e) => {
  nowColor = e.target.value;
  if (nowColor.length === 9) {
    e.target.value = nowColor.slice(0, 7);
  }
});

document.getElementById("clean").addEventListener("click", () => {
  clean(canvasDrawing);
  console.log("Cleaned!");
});

document.getElementById("stroke").addEventListener("input", (e) => {
  stroke = e.target.value;
  clean(canvasCursor);
  const brush = new Brush(
    shape,
    stroke,
    tools[0],
    canvasCursor.width / 2 - stroke / 2,
    canvasCursor.height / 2 - stroke / 2,
  );
  draw(ctxC, brush, "#FF0000");
});

document.getElementById("square").addEventListener("click", (e) => {
  shape = shapes[0];
  e.currentTarget.classList.add("active");
  document.getElementById("circle").classList.remove("active");
});
document.getElementById("circle").addEventListener("click", (e) => {
  shape = shapes[1];
  e.currentTarget.classList.add("active");
  document.getElementById("square").classList.remove("active");
});

document.getElementById("brush").addEventListener("click", (e) => {
  tool = tools[0];
  e.currentTarget.classList.add("active");
  document.getElementById("eraser").classList.remove("active");
  document.getElementById("bucket").classList.remove("active");
});
document.getElementById("eraser").addEventListener("click", (e) => {
  tool = tools[1];
  e.currentTarget.classList.add("active");
  document.getElementById("brush").classList.remove("active");
  document.getElementById("bucket").classList.remove("active");
});
document.getElementById("bucket").addEventListener("click", (e) => {
  tool = tools[2];
  e.currentTarget.classList.add("active");
  document.getElementById("eraser").classList.remove("active");
  document.getElementById("brush").classList.remove("active");
});

document.getElementById("download").addEventListener("click", () => {
  const link = document.createElement("a");
  let fileName = prompt("What's the file name?")
  link.download = `${fileName.trim().replace(" ", "_")}.png`;
  link.href = canvasDrawing.toDataURL("image/png");
  link.click();
});

const fileInput = document.getElementById("fileInput")
document.getElementById("upload").addEventListener("click", (e) => {
  fileInput.click()
})
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0]

  if(!file) return

  const img = new Image()

  img.onload = () => {
    ctxD.clearRect(0, 0, canvasDrawing.width, canvasDrawing.height)
    ctxD.drawImage(img, 0, 0, canvasDrawing.width, canvasDrawing.height)
  }

  img.src = URL.createObjectURL(file)
})

function getMousePos(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.floor(event.clientX - rect.left),
    y: Math.floor(event.clientY - rect.top),
  };
}

canvasDrawing.addEventListener("mousemove", (e) => {
  clean(canvasCursor);

  const pos = getMousePos(canvasDrawing, e);
  const brush = new Brush(
    shape,
    stroke,
    tool,
    pos.x - (stroke / 2).toFixed(0),
    pos.y - (stroke / 2).toFixed(0),
  );

  if (nowMode === modes[1]) {
    nowColor = colors[(colors.indexOf(nowColor) + 1) % colors.length];
  }

  draw(ctxC, brush, nowColor);

  if (isPainting) {
    if (lastPos) {
      if (brush.type === tools[1]) {
        erase(ctxD, lastPos, pos, brush);
      } else {
        drawLine(ctxD, lastPos, pos, brush, nowColor);
      }
    } else {
      if (brush.type != tools[1]) {
        draw(ctxD, brush, nowColor);
      }
    }
    lastPos = pos;
  } else {
    lastPos = null;
  }
});

canvasDrawing.addEventListener("mousedown", (e) => {
  if (tool === tools[2]) {
    const pos = getMousePos(canvasDrawing, e);
    bucket(pos, nowColor);
    isPainting = false;
    return;
  }
  isPainting = true;
});
canvasDrawing.addEventListener("mouseup", () => {
  isPainting = false;
});

function draw(canvasCtx, brush, color, x = 0, y = 0) {
  color = convertToRGB(color);
  canvasCtx.fillStyle = RGBArrayToCSSString(color);

  if (brush.type === tools[2]) {
    canvasCtx.fillRect(x, y, 1, 1);
  } else {
    if (brush.type === tools[1]) {
      canvasCtx.fillStyle = nowMode === modes[0] ? "#FFFFFF" : "#000000";
    }

    if (brush.shape === shapes[0]) {
      canvasCtx.fillRect(brush.x, brush.y, brush.stroke, brush.stroke);
    } else if (brush.shape === shapes[1]) {
      canvasCtx.beginPath();
      canvasCtx.arc(
        brush.x + brush.stroke / 2,
        brush.y + brush.stroke / 2,
        brush.stroke / 2,
        0,
        Math.PI * 2,
      );
      canvasCtx.fill();
    }
  }
}

function drawLine(canvasCtx, from, to, brush, color) {
  canvasCtx.beginPath();
  canvasCtx.lineWidth = brush.stroke;
  canvasCtx.lineCap = brush.shape === shapes[1] ? "round" : "square";
  canvasCtx.strokeStyle = color;
  canvasCtx.moveTo(from.x, from.y);
  canvasCtx.lineTo(to.x, to.y);
  canvasCtx.stroke();
}

function erase(canvasCtx, from, to, brush) {
  canvasCtx.save();
  // canvasCtx.globalCompositeOperation = "destination-out";
  canvasCtx.beginPath();
  canvasCtx.lineWidth = brush.stroke;
  canvasCtx.lineCap = brush.shape === shapes[1] ? "round" : "square";
  canvasCtx.strokeStyle = nowMode === modes[0] ? "white" : "black";
  canvasCtx.moveTo(from.x, from.y);
  canvasCtx.lineTo(to.x, to.y);
  canvasCtx.stroke();
  canvasCtx.restore();
}

function clean(canvas) {
  const ctx = canvas.getContext("2d");

  if (canvas === canvasCursor) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = nowMode === modes[0] ? "#FFFFFF" : "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function bucket(originPoint, newColor) {
  const { x, y } = originPoint;

  const imageData = screenshot(canvasDrawing);
  const data = imageData.data;

  const color = convertToRGB(newColor);
  const originColor = getColor(data, canvasDrawing.width, x, y);

  if (isSameColor(originColor, color)) return;

  const queue = [[x, y]];
  const visited = new Set()

  while (queue.length > 0) {
    const [cx, cy] = queue.shift();

    if (
      cx < 0 ||
      cy < 0 ||
      cx >= canvasDrawing.width ||
      cy >= canvasDrawing.height
    ) {
      continue;
    }

    const key = `${cx},${cy}`

    if (visited.has(key)) continue

    visited.add(key)

    const currentColor = getColor(data, canvasDrawing.width, cx, cy);

    if (!isSameColor(currentColor, originColor)) continue;

    setColor(data, canvasDrawing.width, cx, cy, color);

    queue.push([cx + 1, cy]);
    queue.push([cx - 1, cy]);
    queue.push([cx, cy + 1]);
    queue.push([cx, cy - 1]);
  }

  ctxD.putImageData(imageData, 0, 0);
}

function getColor(data, width, x, y) {
  const index = (y * width + x) * 4;

  return [data[index], data[index + 1], data[index + 2]];
}
function setColor(data, width, x, y, color) {
  const index = (y * width + x) * 4;

  data[index] = color[0];
  data[index + 1] = color[1];
  data[index + 2] = color[2];
  data[index + 3] = 255;
}

function screenshot(canvas) {
  ctx = canvas.getContext("2d");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  return imageData;
}

function convertToRGB(color) {
  if (
    Array.isArray(color) &&
    color.length === 3 &&
    color.every(
      (valor) => Number.isInteger(valor) && valor >= 0 && valor <= 255,
    )
  ) {
    return color;
  }
  if (typeof color === "string") {
    color = color.trim().replace("#", "");
    if (/^[0-9A-Fa-f]{6}$/.test(color)) {
      const r = parseInt(color.substring(0, 2), 16);
      const g = parseInt(color.substring(2, 4), 16);
      const b = parseInt(color.substring(4, 6), 16);
      return [r, g, b];
    } else {
      throw new Error(`HEX inválido! "${color}"`);
    }
  } else {
    throw new Error(`Cor inválida! "${color}"`);
  }
}
function RGBArrayToCSSString(color) {
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

function isSameColor(origin, color) {
  return (
    origin[0] === color[0] && origin[1] === color[1] && origin[2] === color[2]
  );
}

window.onload = clean(canvasDrawing);