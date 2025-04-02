let outsideScop = [];
function colorPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

async function isGraphCyclicPathTrace(graphComponentMatrix, cycleResponse) {
  let [srcr, srcc] = cycleResponse;
  let visited = []; // node visit trace
  let dfsVisited = []; // stack visit trace
  for (let i = 0; i < rows; i++) {
    let visitedRow = [];
    let dfsVisitedRow = [];
    for (let j = 0; j < cols; j++) {
      visitedRow.push(false);
      dfsVisitedRow.push(false);
    }
    visited.push(visitedRow);
    dfsVisited.push(dfsVisitedRow);
  }

  let response = await dfsCycleDetectionPathTrace(
    graphComponentMatrix,
    srcr,
    srcc,
    visited,
    dfsVisited
  );

  if (response === true) return true;
  return false;
}

// Coloring cell for tracking
async function dfsCycleDetectionPathTrace(
  graphComponentMatrix,
  srcr,
  srcc,
  visited,
  dfsVisited
) {
  visited[srcr][srcc] = true;
  dfsVisited[srcr][srcc] = true;

  let cell = document.querySelector(`.cell[rid="${srcr}"][cid="${srcc}"]`);
  cell.style.backgroundColor = "lightblue";
  await colorPromise(); // 1 sec finished

  for (
    let children = 0;
    children < graphComponentMatrix[srcr][srcc].length;
    children++
  ) {
    let [crid, ccid] = graphComponentMatrix[srcr][srcc][children];
    if (visited[crid][ccid] == false) {
      let response = await dfsCycleDetectionPathTrace(
        graphComponentMatrix,
        crid,
        ccid,
        visited,
        dfsVisited
      );
      if (response == true) {
        cell.style.backgroundColor = "transparent";
        await colorPromise();
        return true;
      }
    } else if (dfsVisited[crid][ccid] == true) {
      let cyclicCell = document.querySelector(
        `.cell[rid="${crid}"][cid="${ccid}"]`
      );
      cyclicCell.style.backgroundColor = "lightSalmon";
      await colorPromise();
      cyclicCell.style.backgroundColor = "transparent";
      await colorPromise();
      cell.style.backgroundColor = "transparent";
      await colorPromise();
      return true;
    }
  }
  dfsVisited[srcr][srcc] = false;
  return false;
}
