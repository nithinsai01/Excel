let collectedSheetDB = [];
let sheetDB = [];

// for (let i = 0; i < rows; i++) {
//   let sheetRow = [];
//   for (let j = 0; j < cols; j++) {
//     let cellProp = {
//       bold: false,
//       italic: false,
//       underline: false,
//       alignment: "left",
//       fontFamily: "monospace",
//       fontSize: "14",
//       fontColor: "#000000",
//       BGcolor: "transparent", // just for identification purpose
//       value: "",
//       formula: "",
//       children: [],
//     };
//     sheetRow.push(cellProp);
//   }
//   sheetDB.push(sheetRow);
// }

{
  let addSheetBtn = document.querySelector(".sheet-add-icon");
  addSheetBtn.click();
}

// selectors for cell properties
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontFamily = document.querySelector(".font-family-prop");
let fontSize = document.querySelector(".font-size-prop");
let BGcolor = document.querySelector(".BGcolor-prop");
let fontColor = document.querySelector(".font-color-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

let activeColorProp = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";

// application of 2-way binding
// attach property listeners
bold.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = activeCell(address);

  cellProp.bold = !cellProp.bold; // data change
  cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; // ui change (1)
  bold.style.backgroundColor = cellProp.bold
    ? activeColorProp
    : inactiveColorProp; // ui change (2)
});

italic.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = activeCell(address);

  cellProp.italic = !cellProp.italic; // data change
  cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; // ui change (1)
  italic.style.backgroundColor = cellProp.italic
    ? activeColorProp
    : inactiveColorProp; // ui change (2)
});

underline.addEventListener("click", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = activeCell(address);

  cellProp.underline = !cellProp.underline; // data change
  cell.style.textDecoration = cellProp.underline ? "underline" : "none"; // ui change (1)
  underline.style.backgroundColor = cellProp.underline
    ? activeColorProp
    : inactiveColorProp; // ui change (2)
});

fontSize.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = activeCell(address);

  cellProp.fontSize = fontSize.value;
  cell.style.fontSize = cellProp.fontSize + "px";
});

fontFamily.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = activeCell(address);

  cellProp.fontFamily = fontFamily.value;
  cell.style.fontFamily = cellProp.fontFamily;
});

fontColor.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = activeCell(address);

  cellProp.fontColor = fontColor.value;
  cell.style.color = cellProp.fontColor;
});

BGcolor.addEventListener("change", (e) => {
  let address = addressBar.value;
  let [cell, cellProp] = activeCell(address);

  cellProp.BGcolor = BGcolor.value;
  cell.style.backgroundColor = cellProp.BGcolor;
});

alignment.forEach((alignEle) => {
  alignEle.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = activeCell(address);
    let alignValue = e.target.classList[0];
    cellProp.alignment = alignValue;
    cell.style.textAlign = cellProp.alignment;
    switch (alignValue) {
      case "left":
        leftAlign.style.backgroundColor = activeColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "center":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = activeColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "right":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = activeColorProp;
        break;
    }
  });
});

let allCells = document.querySelectorAll(".cell");
for (let i = 0; i < allCells.length; i++) {
  addListenerToAttachCellProperties(allCells[i]);
}

function addListenerToAttachCellProperties(cell) {
  cell.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [rid, cid] = decodeRIDCIDFromAddress(address);
    let cellProp = sheetDB[rid][cid];
    if (rid == 0 && cid == 0) {
      console.log(sheetDB)
      console.log(cellProp.BGcolor);
    }
    // apply cell properties
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";
    cell.style.fontSize = cellProp.fontSize + "px";
    cell.style.fontFamily = cellProp.fontFamily;
    cell.style.color = cellProp.fontColor;
    cell.style.backgroundColor = cellProp.BGcolor;
    cell.style.textAlign = cellProp.alignment;
    // apply UI to cell properties container
    bold.style.backgroundColor = cellProp.bold
      ? activeColorProp
      : inactiveColorProp;
    italic.style.backgroundColor = cellProp.italic
      ? activeColorProp
      : inactiveColorProp;
    underline.style.backgroundColor = cellProp.underline
      ? activeColorProp
      : inactiveColorProp;
    fontSize.value = cellProp.fontSize;
    fontFamily.value = cellProp.fontFamily;
    BGcolor.value = cellProp.BGcolor;
    fontColor.value = cellProp.fontColor;
    switch (cellProp.alignment) {
      case "left":
        leftAlign.style.backgroundColor = activeColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "center":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = activeColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "right":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = activeColorProp;
        break;
    }

    let formulaBar = document.querySelector(".formula-bar");
    formulaBar.value = cellProp.formula;
    cell.innerText = cellProp.value;
  });
}

function activeCell(address) {
  let [rid, cid] = decodeRIDCIDFromAddress(address);

  // access cell & storage object
  let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
  let cellProp = sheetDB[rid][cid];
  return [cell, cellProp];
}

function decodeRIDCIDFromAddress(address) {
  // address -> "A1"
  let rid = address.slice(1) - 1;
  let cid = address.charCodeAt(0) - 65;
  return [rid, cid];
}
