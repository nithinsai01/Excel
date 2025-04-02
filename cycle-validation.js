// Storage
let collectedGraphComponent = [];
let graphComponentMatrix = [];

// for (let i = 0; i < rows; i++) {
//   let row = [];
//   for (let j = 0; j < cols; j++) {
//     // why array -> more than 1 child dependency
//     row.push([]);
//   }
//   graphComponentMatrix.push(row);
// }

// True - Cycle , False - No Cycle
function isGraphCyclic(graphComponentMatrix) {
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

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (visited[i][j] == false) {
        let response = dfsCycleDetection(
          graphComponentMatrix,
          i,
          j,
          visited,
          dfsVisited
        );
        if (response == true) return [i, j];
      }
    }
  }
  return null;
}

// Start -> vis(TRUE) dfsVis(TRUE)
// End -> dfsVis(FALSE)
// if(vis[i][j] == true) -> already explored path, go back
// Cycle detection condition -> if(vis[i][j] == true && dfsVis[i][j] == true) -> cycle
// RETURN -> TRUE/FALSE
function dfsCycleDetection(
  graphComponentMatrix,
  srcr,
  srcc,
  visited,
  dfsVisited
) {
  visited[srcr][srcc] = true;
  dfsVisited[srcr][srcc] = true;

  // A1 -> [[0,1], [1,0], [5,10], .... ]
  for (
    let children = 0;
    children < graphComponentMatrix[srcr][srcc].length;
    children++
  ) {
    let [crid, ccid] = graphComponentMatrix[srcr][srcc][children];
    if (visited[crid][ccid] == false) {
      let response = dfsCycleDetection(
        graphComponentMatrix,
        crid,
        ccid,
        visited,
        dfsVisited
      );
      if (response == true) return true; // found cycle so return immediately
    } else if (dfsVisited[crid][ccid] == true) return true;
  }
  dfsVisited[srcr][srcc] = false;
  return false;
}
