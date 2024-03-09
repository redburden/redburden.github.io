import define1 from "./4c7302af3b6a0b9b@192.js";

function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Tidy tree</h1><a href="https://d3js.org/">D3</a> › <a href="/@d3/gallery">Gallery</a></div>

# Karatsuba's Algorithm Tree

The data supplied to the tree comes from the Karatsuba Multiplication algorithm below. This project was created to help visualize the recursive divide-and-conquer strategy of the algorithm. An explanation of how the terms are used and how to control the input to the data is provided below the tree.

### Sources

The tree layout is from the [Tidy Tree D3 example](https://observablehq.com/@d3/tree/2) that is based off of the [Reingold–Tilford “tidy” algorithm](http://reingold.co/tidier-drawings.pdf). 

The tooltips implementation is from [Tooltip (D3 Convention)](https://observablehq.com/@clhenrick/tooltip-d3-convention) by Chris Henrick.

The Karatsuba implementation comes from the Copilot prompt: "generate an implementation for the karatsuba multiplication algorithm".

<br></br>
`
)}

function _num1(Inputs){return(
Inputs.text({label: "First Number",value: 1234})
)}

function _num2(Inputs){return(
Inputs.text({label: "Second Number",value: 5678})
)}

function _nodeText(Inputs){return(
Inputs.range([0, 3], {value: 1, step: 1, label: "Node Detail"})
)}

function _chart(d3,html,tooltipTemplate,data,tooltip)
{
  const width = 1000;

  const container = d3.select(
    html`<div style="position:relative;">${tooltipTemplate}</div>`
  );
  const tooltipDiv = container.select(".tooltip");

  // Compute the tree height; this approach will allow the height of the
  // SVG to scale according to the breadth (width) of the tree layout.
  const root = d3.hierarchy(data);
  const dx = 30;
  const dy = (width) / (root.height + 2);

  // Create a tree layout.
  const tree = d3.tree().nodeSize([dx, dy]);

  // Sort the tree and apply the layout.
  root.sort((a, b) => d3.ascending(a.data.name, b.data.name));
  tree(root);

  // Compute the extent of the tree. Note that x and y are swapped here
  // because in the tree layout, x is the breadth, but when displayed, the
  // tree extends right rather than down.
  let x0 = Infinity;
  let x1 = -x0;
  root.each(d => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });

  // Compute the adjusted height of the tree.
  const height = x1 - x0 + dx * 2.5;

  const svg = container.append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [width/-4, height/-1.8 - dx, width*1.2, height*1.2])
      .attr("style", "width:auto; height: 100%; font: 20px sans-serif;");

  const link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 2)
    .selectAll()
      .data(root.links())
      .join("path")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));
  
  const node = svg.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll()
      .data(root.descendants())
      .join("g")
      .attr("transform", d => `translate(${d.y},${d.x})`);

  node.append("circle")
      .attr("fill", d => d.children ? "#555" : "#999")
      .attr("r", 5)
      .call(tooltip, tooltipDiv);

  node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.children ? -6 : 6)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name)
      .clone(true).lower()
      .attr("stroke", "white")
      .call(tooltip, tooltipDiv);
  
  return container.node();
}


function _6(md){return(
md`#### Karatsuba Algorithm Terms
I am using "a,b,c,d" and "q0,q1,q2" to represent variables used at each step where: </br>
** a term - ** high subset of first number, x  </br>
&nbsp;&nbsp;&nbsp;*if x = 1234 </br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a <- 12* </br>
** b term - ** low subset of first number, x  </br>
&nbsp;&nbsp;&nbsp;*if x = 1234 </br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b <- 34*</br>
** c term - ** high subset of second number, y  </br>
&nbsp;&nbsp;&nbsp;*if y = 5678 </br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;y <- 56*</br>
** d term - ** low subset of second number, y  </br>
&nbsp;&nbsp;&nbsp;*if y = 5678 </br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a <- 78* </br>
** m term - ** the number of digits in each respective input number divided by 2  </br>
&nbsp;&nbsp;&nbsp;*if x = 1234 && y = 5678 </br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;m <- 2* </br>
** q0 = ** bd&nbsp;&nbsp;&nbsp;&nbsp;
** q1 = ** (a+b)(c+d)&nbsp;&nbsp;&nbsp;&nbsp; ** q2 = ** ac</br>
</br>
The final formula once finding the three components is:
`
)}

function _7(tex){return(
tex.block`
  q0+(q1-q2-q0)*10^m+q2*10^{2m}
`
)}

function _8(md){return(
md`## Instructions for Use

The tree will be generated based on the Karatsuba multiplication of the numbers provided in the input boxes. The darker nodes represent a step where the problem was divided into the three components: q0, q1, and q2 and processed further. The lighter colored nodes represent an end result where both numbers being multiplied were single digit.

Hover over the nodes for more information about the variables that were used in their formula. Use the Node Detail slider to adjust how much information is displayed in the text for each node. *Text may clip out of the viewbox with higher settings of Node Detail and large numbers.*`
)}

function _data(karatsuba,num1,num2,KarData){return(
karatsuba(num1,num2,new KarData(num1 +" * "+ num2 +" ="))
)}

function _karatsuba(nodeText,KarData){return(
function karatsuba(x, y, karTree) {
  //base case
  if (x < 10 && y < 10) {
    karTree.result = x * y;
    nodeText > 1 ? karTree.name += karTree.result : karTree.name = karTree.result;
    if (nodeText < 1) karTree.name = ""
    return karTree;
  }

  //calculate the size of the numbers
  const m = Math.max(x.toString().length, y.toString().length);
  const m2 = Math.floor(m / 2);
  karTree.m = m2;

  //split the digit sequences in the middle
  const a = Math.floor(x / Math.pow(10, m2));
  const b = x % Math.pow(10, m2);
  const c = Math.floor(y / Math.pow(10, m2));
  const d = y % Math.pow(10, m2);

  karTree.a = a;
  karTree.b = b;
  karTree.c = c;
  karTree.d = d;

  const digitsStr = "\n a: " + a + " b: " + b + "\n c: " + c + " d: " + d;

  let bdL1 = "bd = ";
  let bdL2 = "bd: " +  b + " * " + d + " = ";
  let abcdL1 = "(a+b)(c+d) = ";
  let abcdL2 = "(a+b)(c+d): " + a + b + " * " + (c + d) + " = ";
  let acL1 = "ac = ";
  let acL2 = "ac: " + a + " * " + c + " = "

  //3 calls made to numbers approximately half the size
  let thisData = nodeText > 2 ? new KarData(bdL2) : new KarData(bdL1);
  karTree.children.push(thisData);
  const z0 = karatsuba(b, d, thisData).result;
  karTree.q0 = z0;

  thisData = nodeText > 2 ? new KarData(abcdL2) : new KarData(abcdL1);
  karTree.children.push(thisData);
  const z1 = karatsuba(a + b, c + d, thisData).result;
  karTree.q1 = z1;

  thisData = nodeText > 2 ? new KarData(acL2) : new KarData(acL1);
  karTree.children.push(thisData);
  const z2 = karatsuba(a, c, thisData).result;
  karTree.q2 = z2;

  const result =
    z2 * Math.pow(10, 2 * m2) + (z1 - z2 - z0) * Math.pow(10, m2) + z0;
  karTree.result = result;
  nodeText > 1 ? karTree.name += " " + result : karTree.name = result;
  if (nodeText == 0) karTree.name = ""
  karTree.kar_formula = z2 + " * " + Math.pow(10, 2 * m2) + " + " + "(" + z1 + "-" + z2 + "-" + z0 + ") * " + Math.pow(10, m2) + " + " + z0;
  return karTree;
}
)}

function _KarData(){return(
class KarData {
  constructor(name) {
    this.name = name;
    this.children = [];
  }
  name;
  children;
  result;
  a;
  b;
  c;
  d;
  q0;
  q1;
  q2;
}
)}

function _tooltip(d3,setContents,setStyle,margin,resetStyle,MOUSE_POS_OFFSET,width){return(
(selectionGroup, tooltipDiv) => {
  selectionGroup.each(function () {
    d3.select(this)
      .on("mouseover.tooltip", handleMouseover)
      .on("mousemove.tooltip", handleMousemove)
      .on("mouseleave.tooltip", handleMouseleave);
  });

  function handleMouseover() {
    // show/reveal the tooltip, set its contents,
    // style the element being hovered on
    showTooltip();
    setContents(d3.select(this).datum().data, tooltipDiv);
    setStyle(d3.select(this));
  }

  function handleMousemove(event) {
    // update the tooltip's position
    const [mouseX, mouseY] = d3.pointer(event, this);
    // add the left & top margin values to account for the SVG g element transform
    setPosition(mouseX + margin.left, mouseY + margin.top);
  }

  function handleMouseleave() {
    // do things like hide the tooltip
    // reset the style of the element being hovered on
    hideTooltip();
    resetStyle(d3.select(this));
  }

  function showTooltip() {
    tooltipDiv.style("display", "block");
  }

  function hideTooltip() {
    tooltipDiv.style("display", "none");
  }

  function setPosition(mouseX, mouseY) {
    tooltipDiv
      .style(
        "top",
        mouseY < 400 / 2 ? `${mouseY + MOUSE_POS_OFFSET}px` : "initial"
      )
      .style(
        "right",
        mouseX > width / 2
          ? `${width - mouseX + MOUSE_POS_OFFSET}px`
          : "initial"
      )
      .style(
        "bottom",
        mouseY > 400 / 2
          ? `${400 - mouseY + MOUSE_POS_OFFSET}px`
          : "initial"
      )
      .style(
        "left",
        mouseX < width / 2 ? `${mouseX + MOUSE_POS_OFFSET}px` : "initial"
      );
  }
}
)}

function _setContents(){return(
function setContents(datum, tooltipDiv) {
  // customize this function to set the tooltip's contents however you see fit
  tooltipDiv
    .selectAll("p")
    .data(Object.entries(datum))
    .join("p")
    .filter(([key, value]) => value !== null && value !== undefined)
    .html(
      ([key, value]) =>
        `<strong>${key == "children" ? "" : key + ":"}</strong> ${
          typeof value === "object" ? "" : value
        }`
    );
}
)}

function _margin(){return(
{ top: 10, right: 10, bottom: 10, left: 10 }
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof num1")).define("viewof num1", ["Inputs"], _num1);
  main.variable(observer("num1")).define("num1", ["Generators", "viewof num1"], (G, _) => G.input(_));
  main.variable(observer("viewof num2")).define("viewof num2", ["Inputs"], _num2);
  main.variable(observer("num2")).define("num2", ["Generators", "viewof num2"], (G, _) => G.input(_));
  main.variable(observer("viewof nodeText")).define("viewof nodeText", ["Inputs"], _nodeText);
  main.variable(observer("nodeText")).define("nodeText", ["Generators", "viewof nodeText"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3","html","tooltipTemplate","data","tooltip"], _chart);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["tex"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer("data")).define("data", ["karatsuba","num1","num2","KarData"], _data);
  main.variable(observer("karatsuba")).define("karatsuba", ["nodeText","KarData"], _karatsuba);
  main.variable(observer("KarData")).define("KarData", _KarData);
  const child1 = runtime.module(define1);
  main.import("tooltipId", child1);
  const child2 = runtime.module(define1);
  main.import("tooltipTemplate", child2);
  main.variable(observer("tooltip")).define("tooltip", ["d3","setContents","setStyle","margin","resetStyle","MOUSE_POS_OFFSET","width"], _tooltip);
  main.variable(observer("setContents")).define("setContents", _setContents);
  const child3 = runtime.module(define1);
  main.import("resetStyle", child3);
  const child4 = runtime.module(define1);
  main.import("setStyle", child4);
  const child5 = runtime.module(define1);
  main.import("tooltipStyles", child5);
  const child6 = runtime.module(define1);
  main.import("MOUSE_POS_OFFSET", child6);
  main.variable(observer("margin")).define("margin", _margin);
  return main;
}
