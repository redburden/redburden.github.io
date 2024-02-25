async function getShortest() {
  let dropdown = document.getElementById("dropdown");

  shortest = Module.cwrap("shortest", "string", ["number"]);
  console.log(shortest(0));

  await setShortestPath(shortest(dropdown.value)).then((_) => {
    jdraw();
  });
}
