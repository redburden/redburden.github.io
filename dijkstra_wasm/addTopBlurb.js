function addTopBlurb() {
  let blurb = createElement(
    "h1",
    "Finding Almost Shortest Path with Dijkstra's Algorithm"
  );
  blurb.class("text-xl text-center font-serif");
  blurb.position(50, 50);
  let blurbPar = createElement(
    "p",
    "This is an interactive visualization of solving the Almost Shortest Path problem using Dijkstra's algorithm. The problem is to find the shortest path between two nodes in a graph, but with the constraint that the almost shortest path cannot use edges that were used with any shortest path. In this visual, the shortest path(s) (if possible) is/are represented using green shading, while the almost shortest path(s) is/are represented with orange shading if they exist. The graph is represented as a set of nodes and edges, and the algorithm is implemented in C++ WebAssembly. The graph is drawn using p5.js."
  );
  blurbPar.class("text-lg text-left font-serif mr-5");
  blurbPar.position(50, 100);
  return blurbPar.height;
}
