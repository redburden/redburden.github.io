function preload() {
  lines = loadStrings("graph1.txt");
}

function setup() {
  textAlign(CENTER, BASELINE);
}

function draw() {
  noLoop();
  createCanvas(1200, 1600);
  textAlign(CENTER, CENTER);
  let x = 50;
  let farthestX = 50;
  let y = 500;
  let addedNodes = new Map();
  let locations = new Map();

  circle(x, y, 50);
  text(lines[1][0], x, y);
  addedNodes.set(lines[1][0], [{ x: x + 200, y: y - 400 }]);
  locations.set(lines[1][0], [x, y]);

  for (let i = 2; i < lines.length; i++) {
    if (!addedNodes.has(lines[i][0])) {
      circle(farthestX + 200, y, 50);
      text(lines[i][0], farthestX + 200, y);
      farthestX += 200;
      addedNodes.set(lines[i][0], [{ x: farthestX + 200, y: y - 400 }]);
      locations.set(lines[i][0], [farthestX, y]);
    }

    if (!addedNodes.has(lines[i][2])) {
      let fromChildren = addedNodes.get(lines[i][0]);
      console.log(lines[i][0] + " " + lines[i][2] + " " + fromChildren.length);
      circle(
        fromChildren[fromChildren.length - 1].x,
        fromChildren[fromChildren.length - 1].y + 200,
        50
      );

      text(
        lines[i][2],
        fromChildren[fromChildren.length - 1].x,
        fromChildren[fromChildren.length - 1].y + 200
      );

      locations.set(lines[i][2], [
        fromChildren[fromChildren.length - 1].x,
        fromChildren[fromChildren.length - 1].y + 200,
      ]);
      addedNodes.set(lines[i][2], [
        {
          x: locations.get(lines[i][2])[0] + 200,
          y: locations.get(lines[i][2])[1] - 200,
        },
      ]);
      nodes = addedNodes.get(lines[i][0]);
      newNode = {
        x: locations.get(lines[i][2])[0],
        y: locations.get(lines[i][2])[1],
      };
      nodes.push(newNode);
      addedNodes.set(lines[i][0], nodes);
    }

    circToCircLine(
      locations.get(lines[i][0])[0],
      locations.get(lines[i][0])[1],
      locations.get(lines[i][2])[0],
      locations.get(lines[i][2])[1],
      lines[i][4]
    );
  }
}

function circToCircLine(x1, y1, x2, y2, cost) {
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
