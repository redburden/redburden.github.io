async function getShortest() {
  let dropdown = document.getElementById("dropdown");

  shortest = Module.cwrap("shortest", "string", ["number"]);
  almostShortest = Module.cwrap("almostShortest", "string", ["number"]);

  await setShortestPath(shortest(dropdown.value - 1)).then((_) => {
    console.log(shortest(dropdown.value - 1));
    shadeEdgesShortest();
  });

  await setAlmost(almostShortest(dropdown.value - 1)).then((_) => {
    shadeEdgesAlmost();
  });
}
