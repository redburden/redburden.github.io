let locations, addedNodes, shortestPath, graphs;

function preload() {
  graphs = loadStrings("graph1.txt");
}

function setup() {
  textAlign(CENTER, BASELINE);

  let dropdown = createSelect();
  dropdown.position(10, 10);
  dropdown.id("dropdown");
  getShortest();

  graphs = graphs.join("\n");

  graphs = graphs.split("\n**\n");
  for (let i = 0; i < graphs.length; i++) {
    dropdown.option(i);
  }
  lines = graphs[1].split("\n");
  dropdown.changed(() => {
    lines = graphs[dropdown.value()].split("\n");
    console.log(lines);
    getShortest();
  });
}

async function jdraw() {
  createCanvas(1200, 1600);
  textAlign(CENTER, CENTER);

  if (typeof lines == "undefined") {
    window.setTimeout(jdraw, 100);
  }

  let x = 50;
  let farthestX = 50;
  let y = 500;
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
  shadeEdges(shortestPath);
}

function shadeEdges(lines) {
  if (typeof lines == "undefined") {
    window.setTimeout(jdraw, 100);
  }

  for (let i = 0; i < lines.length; i++) {
    if (typeof lines[i] == "string") {
      lines[i] = lines[i].split(" ");
    }

    circToCircLine(
      locations.get(lines[i][0])[0],
      locations.get(lines[i][0])[1],
      locations.get(lines[i][1])[0],
      locations.get(lines[i][1])[1],
      lines[i][2],
      4
    );
  }
}

function circToCircLine(x1, y1, x2, y2, cost, weight = 1) {
  strokeWeight(weight);
  let dx = x2 - x1;
  let dy = y2 - y1;
  let dist = Math.sqrt(dx * dx + dy * dy);

  let ux = dx / dist;
  let uy = dy / dist;

  line(x1 + ux * 25, y1 + uy * 25, x2 - ux * 25, y2 - uy * 25);
  triangle(
    x2 - ux * 25,
    y2 - uy * 25,
    x2 - ux * 45 - uy * 15,
    y2 - uy * 45 + ux * 15,
    x2 - ux * 45 + uy * 15,
    y2 - uy * 45 - ux * 15
  );
  text(cost, x2 - ux * 37.5, y2 - uy * 37.5);
}

async function setShortestPath(lines) {
  lines = lines.split("\n");
  lines.pop();

  shortestPath = lines;
}
