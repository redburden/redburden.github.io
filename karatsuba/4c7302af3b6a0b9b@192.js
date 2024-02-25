// https://observablehq.com/@clhenrick/tooltip-d3-convention@192
function _1(md){return(
md`# Tooltip (D3 Convention)

This version of a Tooltip uses the D3JS convention of [\`selection.call()\`](https://github.com/d3/d3-selection#selection_call) to register the Tooltip's behavior. This is an improvement on my original version of a [Tooltip Component](https://observablehq.com/@clhenrick/tooltip-component).
`
)}

function _demo(d3,html,tooltipTemplate,width,height,margin,data,tooltip)
{
  const container = d3.select(
    html`<div style="position:relative;">${tooltipTemplate}</div>`
  );

  const tooltipDiv = container.select(".tooltip");

  const svg = container.append("svg").attr("viewBox", `0 0 ${width} ${height}`);

  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", 5)
    .attr("fill", "#333")
    .call(tooltip, tooltipDiv);

  return container.node();
}


function _3(md){return(
md`## Implementation`
)}

function _tooltipId(DOM){return(
DOM.uid().id
)}

function _tooltipTemplate(html,tooltipId,tooltipStyles){return(
html`<div class="tooltip tooltip-${tooltipId}">
  ${tooltipStyles}
  <div class="tooltip-contents"></div>
</div>`
)}

function _tooltip(d3,setContents,setStyle,margin,resetStyle,height,MOUSE_POS_OFFSET,width){return(
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
    setContents(d3.select(this).datum(), tooltipDiv);
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
        mouseY < height / 2 ? `${mouseY + MOUSE_POS_OFFSET}px` : "initial"
      )
      .style(
        "right",
        mouseX > width / 2
          ? `${width - mouseX + MOUSE_POS_OFFSET}px`
          : "initial"
      )
      .style(
        "bottom",
        mouseY > height / 2
          ? `${height - mouseY + MOUSE_POS_OFFSET}px`
          : "initial"
      )
      .style(
        "left",
        mouseX < width / 2 ? `${mouseX + MOUSE_POS_OFFSET}px` : "initial"
      );
  }
}
)}

function _7(md){return(
md`Feel free to override these helper functions and constants to your liking.`
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
        `<strong>${key}</strong>: ${
          typeof value === "object" ? value.toLocaleString("en-US") : value
        }`
    );
}
)}

function _resetStyle(){return(
function resetStyle(selection) {
  selection.attr("fill", "#333");
}
)}

function _setStyle(){return(
function setStyle(selection) {
  selection.attr("fill", "magenta");
}
)}

function _tooltipStyles(htl,tooltipId){return(
htl.html`<style>
  /* modify these styles to however you see fit */
  div.tooltip-${tooltipId} {
    box-sizing: border-box;
    position: absolute;
    display: none;
    top: 0;
    left: -100000000px;
    padding: 8px 12px;
    font-family: sans-serif;
    font-size: 12px;
    color: #333;
    background-color: #fff;
    border: 1px solid #333;
    border-radius: 4px;
    pointer-events: none;
    z-index: 1;
  }
  div.tooltip-${tooltipId} p {
    margin: 0;
  }
</style>`
)}

function _MOUSE_POS_OFFSET(){return(
8
)}

function _13(md){return(
md`## Chart Helpers`
)}

function _height(){return(
400
)}

function _margin(){return(
{ top: 10, right: 10, bottom: 10, left: 10 }
)}

function _data(width,margin,height){return(
new Array(50).fill(undefined).map((d, i) => ({
  x: Math.floor(Math.random() * (width - margin.left - margin.right)),
  y: Math.floor(Math.random() * (height - margin.top - margin.bottom)),
  id: i
}))
)}

function _17(md){return(
md`## Dependencies`
)}

function _d3(require){return(
require("d3-selection@2")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("demo")).define("demo", ["d3","html","tooltipTemplate","width","height","margin","data","tooltip"], _demo);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("tooltipId")).define("tooltipId", ["DOM"], _tooltipId);
  main.variable(observer("tooltipTemplate")).define("tooltipTemplate", ["html","tooltipId","tooltipStyles"], _tooltipTemplate);
  main.variable(observer("tooltip")).define("tooltip", ["d3","setContents","setStyle","margin","resetStyle","height","MOUSE_POS_OFFSET","width"], _tooltip);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("setContents")).define("setContents", _setContents);
  main.variable(observer("resetStyle")).define("resetStyle", _resetStyle);
  main.variable(observer("setStyle")).define("setStyle", _setStyle);
  main.variable(observer("tooltipStyles")).define("tooltipStyles", ["htl","tooltipId"], _tooltipStyles);
  main.variable(observer("MOUSE_POS_OFFSET")).define("MOUSE_POS_OFFSET", _MOUSE_POS_OFFSET);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer("data")).define("data", ["width","margin","height"], _data);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
