let locations, addedNodes, shortestPath, graphs, almostShortest, blurbY;

function preload() {
  graphs = loadStrings("graph1.txt");
}

function setup() {
  textAlign(CENTER, BASELINE);
  blurbY = addTopBlurb();

  let dropdown = createSelect();
  dropdown.class(
    "w-10/12 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  );
  dropdown.position(100, blurbY + 150);
  dropdown.id("dropdown");
  dropdown.option("Select a graph");
  if (typeof graphs == "promise") {
    window.setTimeout(setup, 100);
  }

  getShortest();

  graphs = graphs.join("\n");

  graphs = graphs.split("\n**\n");
  for (let i = 1; i < graphs.length + 1; i++) {
    dropdown.option(i);
  }

  lines = graphs[0].split("\n");
  dropdown.changed(() => {
    lines = graphs[dropdown.value() - 1].split("\n");
    getShortest();
    drawGraph();
  });
}

async function drawGraph() {
  let canvas = createCanvas(window.innerWidth, window.innerHeight + 500);
  textAlign(CENTER, CENTER);

  if (typeof lines == "undefined") {
    window.setTimeout(jdraw, 100);
  }

  let x = 50;
  let farthestX = 50;
  let y = 750;
  let farthestY = 750;
  addedNodes = new Map();
  locations = new Map();

  circle(x, y, 50);
  text(lines[1][0], x, y);
  addedNodes.set(lines[1][0], [{ x: x + 200, y: y - 400 }]);
  locations.set(lines[1][0], [x, y]);

  for (let i = 2; i < lines.length; i++) {
    lines[i] = lines[i].split(" ");

    if (!addedNodes.has(lines[i][0])) {
      circle(farthestX + 200, y, 50);
      text(lines[i][0], farthestX + 200, y);
      farthestX += 200;
      addedNodes.set(lines[i][0], [{ x: farthestX + 200, y: y - 400 }]);
      locations.set(lines[i][0], [farthestX, y]);
    }

    if (!addedNodes.has(lines[i][1])) {
      let fromChildren = addedNodes.get(lines[i][0]);

      circle(
        fromChildren[fromChildren.length - 1].x,
        fromChildren[fromChildren.length - 1].y + 200,
        50
      );

      text(
        lines[i][1],
        fromChildren[fromChildren.length - 1].x,
        fromChildren[fromChildren.length - 1].y + 200
      );

      if (fromChildren[fromChildren.length - 1].x > farthestX) {
        farthestX = fromChildren[fromChildren.length - 1].x;
      }
      if (fromChildren[fromChildren.length - 1].y + 200 > farthestY) {
        farthestY = fromChildren[fromChildren.length - 1].y + 200;
      }

      locations.set(lines[i][1], [
        fromChildren[fromChildren.length - 1].x,
        fromChildren[fromChildren.length - 1].y + 200,
      ]);
      addedNodes.set(lines[i][1], [
        {
          x: locations.get(lines[i][1])[0] + 200,
          y: locations.get(lines[i][1])[1] - 200,
        },
      ]);
      nodes = addedNodes.get(lines[i][0]);
      newNode = {
        x: locations.get(lines[i][1])[0],
        y: locations.get(lines[i][1])[1],
      };
      nodes.push(newNode);
      addedNodes.set(lines[i][0], nodes);
    }

    if (lines[i][2]) {
      circToCircLine(
        locations.get(lines[i][0])[0],
        locations.get(lines[i][0])[1],
        locations.get(lines[i][1])[0],
        locations.get(lines[i][1])[1],
        lines[i][2]
      );
    }
  }

  if (!addedNodes.has(lines[1][2])) {
    circle(farthestX + 200, y, 50);
    text(lines[1][2], farthestX + 200, y);
    farthestX += 200;
    addedNodes.set(lines[1][2], [{ x: farthestX + 200, y: y - 400 }]);
    locations.set(lines[1][2], [farthestX, y]);
  }

  push();
  textAlign(CENTER, CENTER);
  textSize(20);
  strokeWeight(1);
  text("Path Start: " + lines[1][0], 100, 250 + blurbY);
  text("Path End: " + lines[1][2], 100, 300 + blurbY);
  text("Input Used: ", farthestX + 350, 300 + blurbY);

  for (let i = 0; i < lines.length; i++) {
    if (typeof lines[i][2] != "undefined")
      text(
        lines[i][0] + " " + lines[i][1] + " " + lines[i][2],
        farthestX + 400,
        325 + blurbY + i * 40
      );
  }
  pop();

  // TO-DO: Resize canvas dyamically to fit graph
}

function shadeEdgesShortest() {
  lines = shortestPath;

  if (typeof lines == "promise" || typeof lines == "undefined") {
    window.setTimeout(shadeEdgesShortest, 100);
  } else {
    for (let i = 0; i < lines.length; i++) {
      if (typeof lines[i] == "string") {
        lines[i] = lines[i].split(" ");
      }
      if (lines[i][0] != -1)
        circToCircLine(
          locations.get(lines[i][0])[0],
          locations.get(lines[i][0])[1],
          locations.get(lines[i][1])[0],
          locations.get(lines[i][1])[1],
          lines[i][2],
          4,
          "green"
        );
    }
  }
}

function shadeEdgesAlmost() {
  lines = almostShortest;

  if (typeof lines == "promise" || typeof lines == "undefined") {
    window.setTimeout(shadeEdgesAlmost, 100);
  } else {
    for (let i = 0; i < lines.length; i++) {
      if (typeof lines[i] == "string") {
        lines[i] = lines[i].split(" ");
      }
      if (lines[i][0] != -1)
        circToCircLine(
          locations.get(lines[i][0])[0],
          locations.get(lines[i][0])[1],
          locations.get(lines[i][1])[0],
          locations.get(lines[i][1])[1],
          lines[i][2],
          4,
          "orange"
        );
    }
  }
}

function circToCircLine(x1, y1, x2, y2, cost, weight = 1, color = "black") {
  push();
  stroke(color);
  strokeWeight(weight);
  let dx = x2 - x1;
  let dy = y2 - y1;
  let dist = Math.sqrt(dx * dx + dy * dy);

  let ux = dx / dist;
  let uy = dy / dist;

  line(x1 + ux * 50, y1 + uy * 50, x2 - ux * 25, y2 - uy * 25);
  triangle(
    x2 - ux * 25,
    y2 - uy * 25,
    x2 - ux * 45 - uy * 15,
    y2 - uy * 45 + ux * 15,
    x2 - ux * 45 + uy * 15,
    y2 - uy * 45 - ux * 15
  );
  pop();

  text(cost, x2 - ux * 37.5, y2 - uy * 37.5);
}

async function setShortestPath(lines) {
  lines = lines.split("\n");
  lines.pop();

  shortestPath = lines;
}
async function setAlmost(lines) {
  lines = lines.split("\n");
  lines.pop();

  almostShortest = lines;
}
