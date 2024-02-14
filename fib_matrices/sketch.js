let input, button, n, lastx, inputLabel;
function setup() {
  textAlign(CENTER, CENTER);

  input = createInput();
  input.position(100, 60);
  inputLabel = createP("Find fibonacci number at position:");
  inputLabel.position(100, 20);

  button = createButton("Submit");
  button.position(100, 80);
  button.mousePressed(() => {
    if (n < 0) {
      alert("Please enter a non-negative number");
    } else {
      n = input.value();
      clear();
      let canvas = createCanvas((n * 2000) / n, n * (2000 / n));
      canvas.parent("canvas");
      textSize(20);
      textAlign(LEFT, CENTER);
      text("Fibonacci by squaring", 100, 125);
      text(
        '"result" matrix highlighted red, "a" matrix highlighted blue',
        100,
        200
      );
      textAlign(CENTER, CENTER);
      printFib();
    }
  });
}

function printFib() {
  fib(n);
}

let mod = Math.pow(10, 9) + 7;

function matrix_multiply(a, b, x, y, n, multType) {
  if (y) {
    printMult(a, b, x, y, n, multType);
  }
  let result = [];
  for (let i = 0; i < a.length; i++) {
    result[i] = [];
    for (let j = 0; j < b[0].length; j++) {
      result[i][j] = 0;
      for (let k = 0; k < a[0].length; k++) {
        result[i][j] += a[i][k] * b[k][j];
        result[i][j] %= mod;
      }
    }
  }
  return result;
}

function squaring(a, n, nInitial) {
  let y = 300;
  result = [
    [1, 0],
    [0, 1],
  ];
  while (n > 0) {
    if (n % 2 === 1) {
      //if n is odd, multiply result by a
      result = matrix_multiply(result, a, 150, y, n, "result");
      stroke("red");
      matrix(
        lastx + 25,
        y,
        result[0][0],
        result[0][1],
        result[1][0],
        result[1][1]
      );
      stroke("black");
      y += 60;
    }
    if (n > 1) {
      stroke("black");
      a = matrix_multiply(a, a, 150, y, n, "a");
      stroke("blue");
      matrix(lastx + 25, y, a[0][0], a[0][1], a[1][0], a[1][1]);
      y += 60;
    }
    n = Math.floor(n / 2);
  }
  return { result, y };
}

function fib(n) {
  textSize(20);
  if (n === 0 || typeof n === "undefined" || n === null) return 0;
  let base = [
    [1, 1],
    [1, 0],
  ];
  let result = squaring(base, n - 1, n);
  if (n) {
    text("f(" + n + ") = " + result.result[0][0], 100, result.y + 35);
  }
  iterateFibs(lastx + 30, 300, n);
  return result[0][0];
}

function printMult(a, b, x, y, n, multType) {
  multType == "result" ? stroke("red") : stroke("blue");
  if (multType == "") stroke("black");

  matrix(x, y, a[0][0], a[0][1], a[1][0], a[1][1]);
  stroke("black");
  let x2 =
    x +
    100 +
    Math.max(textWidth(a[0][0]), textWidth(a[0][1])) +
    Math.max(textWidth(a[1][0]), textWidth(a[1][1]));
  x3 =
    x +
    Math.max(textWidth(a[0][0]), textWidth(a[0][1])) +
    35 +
    Math.max(textWidth(a[1][0]), textWidth(a[1][1]));

  drawCross(x3 + (x2 - x3) / 2, y - 25, 8);

  multType !== "" ? stroke("blue") : stroke("black");
  matrix(x2, y, b[0][0], b[0][1], b[1][0], b[1][1]);
  stroke("black");
  line(lastx + 10, y - 20, lastx + 30, y - 20);
  line(lastx + 10, y - 30, lastx + 30, y - 30);
  lastx += 20;
  if (n) text("n = " + n, x - 40 - textWidth(n), y - 35);
}

function matrix(x, y, a, b, c, d) {
  xleft = x + 5 + Math.max(textWidth(a), textWidth(c));
  xright = xleft + 30 + Math.max(textWidth(b), textWidth(d));
  lastx = xright;
  line(xleft, y, x, y);
  line(x, y, x, y - 50);
  line(x, y - 50, xleft, y - 50);
  line(xright, y, xleft + 25, y);
  line(xright, y, xright, y - 50);
  line(xleft + 25, y - 50, xright, y - 50);
  text(c, x + 5 + Math.max(textWidth(a), textWidth(c)) / 2, y - 15);
  text(d, xright - 5 - Math.max(textWidth(b), textWidth(d)) / 2, y - 15);
  text(a, x + 5 + Math.max(textWidth(a), textWidth(c)) / 2, y - 35);
  text(b, xright - 5 - Math.max(textWidth(b), textWidth(d)) / 2, y - 35);
}

function matrix2by1(x, y, a, b) {
  xleft = x - Math.max(textWidth(a), textWidth(b)) / 2;
  xright = x + 25 + Math.max(textWidth(a), textWidth(b)) / 2;
  line(x, y, xleft, y);
  line(xleft, y, xleft, y - 50);
  line(xleft, y - 50, x, y - 50);
  line(xright, y, x + 25, y);
  line(xright, y, xright, y - 50);
  line(x + 25, y - 50, xright, y - 50);
  text(b, x + 12.5, y - 15);
  text(a, x + 12.5, y - 35);
}

function drawCross(x, y, size) {
  line(x - size, y - size, x + size, y + size);
  line(x - size, y + size, x + size, y - size);
}

function iterateFibs(x, y, n) {
  let mOne = [
    [1, 1],
    [1, 0],
  ];
  let mPow = [
    [1, 1],
    [1, 0],
  ];

  for (let index = 0; index < n - 1; index++) {
    let adjInd = index + 2;
    text("m^" + adjInd, x + 15, y - 30);
    mPow = matrix_multiply(
      mPow,
      mOne,
      x + 20 + textWidth("m^" + adjInd),
      y,
      null,
      ""
    );
    matrix(lastx + 30, y, mPow[0][0], mPow[0][1], mPow[1][0], mPow[1][1]);
    y += 60;
  }
}
