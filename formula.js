for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    cell.addEventListener("blur", (e) => {
      let address = addressBar.value;
      let [cell, cellProp] = activeCell(address);
      let enteredData = cell.innerText;
      if (enteredData === cellProp.value) return;
      cellProp.value = enteredData;
      // if data modifies remove P-C relation, formula empty, update children with new hardcode (modified) value
      removeChildFromParent(cellProp.formula);
      cellProp.formula = "";
      updateChildrenCells(address);
    });
  }
}

let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async (e) => {
  if (e.key == "Enter" && formulaBar.value) {
    let inputFormula = formulaBar.value;
    // if change in formula, break old P-C relation, evaluate new formula, add new P-C relation
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);
    if (cellProp.formula !== inputFormula) {
      removeChildFromParent(cellProp.formula);
    }

    addChildToGraphComponent(inputFormula, address);

    // Check formula is cyclic or not, then only evaluate
    let cycleResponse = isGraphCyclic(graphComponentMatrix);
    if (cycleResponse) {
      let response = confirm(
        "Your formula is cyclic. Do you want to trace your path?"
      );
      while (response === true) {
        // keep on tracking until the user is satisfied
        let val = await isGraphCyclicPathTrace(
          graphComponentMatrix,
          cycleResponse
        ); // I want to complete full iteration of color tracking, so i will attach wait here also.
        console.log(val);
        response = confirm(
          "Your formula is cyclic. Do you want to trace your path?"
        );
      }
      removeChildFromGraphComponent(inputFormula, address);
      return;
    }
    let evaluatedValue = evaluateFormula(inputFormula);

    // To Update UI and Cell Prop in DB
    setCellUIAndCellProp(evaluatedValue, inputFormula, address);
    addChildToParent(inputFormula);
    updateChildrenCells(address);
  }
});

function addChildToGraphComponent(formula, childAddress) {
  let [crid, ccid] = decodeRIDCIDFromAddress(childAddress);
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
      graphComponentMatrix[prid][pcid].push([crid, ccid]);
    }
  }
}

function removeChildFromGraphComponent(formula, childAddress) {
  let [crid, ccid] = decodeRIDCIDFromAddress(childAddress);
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
      graphComponentMatrix[prid][pcid].pop();
    }
  }
}

function updateChildrenCells(parentAddress) {
  let [parentCell, parentCellProp] = activeCell(parentAddress);
  let children = parentCellProp.children;
  for (let i = 0; i < children.length; i++) {
    let childAddress = children[i];
    let [childCell, childCellProp] = activeCell(childAddress);
    let childFormula = childCellProp.formula;
    let evaluatedValue = evaluateFormula(childFormula);
    setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
    updateChildrenCells(childAddress);
  }
}

function addChildToParent(formula) {
  let encodedFormula = formula.split(" ");
  let childAddress = addressBar.value;
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = activeCell(encodedFormula[i]);
      parentCellProp.children.push(childAddress);
    }
  }
}

function removeChildFromParent(formula) {
  let encodedFormula = formula.split(" ");
  let childAddress = addressBar.value;
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = activeCell(encodedFormula[i]);
      let idx = parentCellProp.children.indexOf(childAddress);
      parentCellProp.children.splice(idx, 1);
    }
  }
}

function evaluateFormula(formula) {
  let encodedFormula = formula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [cell, cellProp] = activeCell(encodedFormula[i]);
      encodedFormula[i] = cellProp.value;
    }
  }
  let decodedFormula = encodedFormula.join(" ");
  return eval(decodedFormula).toString();
}

function setCellUIAndCellProp(evaluatedValue, formula, address) {
  let [cell, cellProp] = activeCell(address);
  // UI Update
  cell.innerText = evaluatedValue;
  // DB Update
  cellProp.value = evaluatedValue;
  cellProp.formula = formula;
}
