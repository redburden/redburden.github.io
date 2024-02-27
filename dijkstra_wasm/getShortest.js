async function getShortest() {
  let dropdown = document.getElementById("dropdown");

  createMyModule().then((Module) => {
    shortest = Module.cwrap("shortest", "string", ["number"]);
    almostShortest = Module.cwrap("almostShortest", "string", ["number"]);

    setShortestPath(shortest(dropdown.value - 1));
    shadeEdgesShortest();

    setAlmost(almostShortest(dropdown.value - 1));
    shadeEdgesAlmost();
  });
}
