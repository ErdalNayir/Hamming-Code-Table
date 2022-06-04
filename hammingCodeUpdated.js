var table = document.getElementById("tableBody");
var tablePosition = document.getElementById("tablePosition");
var tableData = document.getElementById("tableData");
var overlayBlur = document.getElementById("overlayBlur");
var tablePositionBits = document.getElementById("tablePositionBits");
var dataBitsInputArea = document.getElementById("dataBits");
var startingContainer = document.getElementById("startingContainer");
var mainContainer = document.getElementById("mainContainer");
var hidden = document.getElementById("hidden");
var hiddenSuccess = document.getElementById("hiddenSuccess");
var dataBitsInfo = document.getElementById("dataBitsInfo");
var controlBitsInfo = document.getElementById("controlBitsInfo");
var manipulationContainer = document.getElementById("manipulationContainer");
var hiddenWarning = document.getElementById("hiddenWarning");
var hiddenSuccessDetected = document.getElementById("hiddenSuccessDetected");

var databits = [];
var controlBitsText = "";
var dataBitsText = "";
var positionOfOnes = [];
var controlBits = [];
var cpyControlBits = [];
var cpyDataBits = [];
var K = 0;
var lenghtOfTable = 0;
var oneTimeManipulation = false;
var confirmation = false;
var gonnaBeChangedId = "";

function CreateHammingCode() {
  var InputText = dataBitsInputArea.value;
  var isAnyDigitsFlag = false;

  if (InputText.length < 4) {
    console.log("Boyut çok küçük");
    hidden.textContent = "Data bits' size is too small for program to handle!";
    hidden.style.display = "block";
    dataBitsInputArea.value = "";
  } else if (InputText.length > 16) {
    hidden.textContent = "Data bits' size is too big for program to handle!";
    hidden.style.display = "block";
    dataBitsInputArea.value = "";
  } else {
    if (isNaN(InputText)) {
      hidden.textContent = "Data bits' contains letter(s)!";
      hidden.style.display = "block";
      dataBitsInputArea.value = "";
    } else {
      for (let i = 0; i < InputText.length; i++) {
        if (InputText[i] != "0" && InputText[i] != 1) {
          hidden.textContent =
            "Data bits' contains other digits rather than 0 or 1 !";
          hidden.style.display = "block";
          dataBitsInputArea.value = "";
          isAnyDigitsFlag = true;
          break;
        }
      }
      if (isAnyDigitsFlag) {
      } else {
        for (let i = 0; i < InputText.length; i++) {
          var numForm = parseInt(InputText[i]);
          databits.push(numForm);
        }
        hiddenSuccess.style.display = "block";
        startingContainer.style.display = "none";
        mainContainer.style.display = "flex";
        copyData();
        findKValue();
        findLenghtOfTable();
        createTable();
        dataBitsInfo.textContent = "Original Data Bits: " + dataBitsText;
        controlBitsInfo.textContent =
          "Original Control Bits: " + controlBitsText;
        addInteractivity();
      }
    }
  }
}

//Creating Test Data
function copyData() {
  cpyDataBits = [...databits];
  cpyDataBits = cpyDataBits.reverse();
}

function colorTable() {
  for (let i = lenghtOfTable; i > 0; i--) {
    if ((i & (i - 1)) != 0) {
      var tableDataId = "tableItem" + i;
      var tableInx = "tablePosition" + i;
      var tablePositionBitsId = "tablePositionBits" + i;

      var tableDataDocument = document.getElementById(tableDataId);
      var tableInxDocument = document.getElementById(tableInx);
      var tablePositionBitsDocument =
        document.getElementById(tablePositionBitsId);

      if (tableDataDocument.textContent == "1") {
        tableDataDocument.style.backgroundColor = "#D5F0C0";
        tableInxDocument.style.backgroundColor = "#D5F0C0";
        tablePositionBitsDocument.style.backgroundColor = "#D5F0C0";
      } else {
        tableDataDocument.style.backgroundColor = "white";
        tableInxDocument.style.backgroundColor = "white";
        tablePositionBitsDocument.style.backgroundColor = "white";
      }
    }
  }
}

function findKValue() {
  while (true) {
    if (2 ** K - 1 >= databits.length + K) {
      break;
    }
    K += 1;
  }
  console.log("K: " + K);
}

//Creating Table
function findLenghtOfTable() {
  lenghtOfTable = K + databits.length;
  console.log("Lenght of Table: " + lenghtOfTable);
  console.log("DataBits: " + databits);
}

function createTable() {
  console.log("Lenght of Table in create Table: " + lenghtOfTable);
  for (let i = lenghtOfTable; i > 0; i--) {
    var binaryPosition = i.toString(2);

    if (lenghtOfTable > 15) {
      for (let j = binaryPosition.length; j < 5; j++) {
        binaryPosition = "0" + binaryPosition;
      }
    } else {
      for (let j = binaryPosition.length; j < 4; j++) {
        binaryPosition = "0" + binaryPosition;
      }
    }
    tablePositionBits.innerHTML +=
      "<td id='tablePositionBits" + i + "'>" + binaryPosition + "</td>";

    tablePosition.innerHTML +=
      "<td class='tableInx' id='tablePosition" +
      i +
      "'>P<sub>" +
      i +
      "</sub></td>";

    if ((i & (i - 1)) == 0 || i == 1) {
      tableData.innerHTML += "<td id='tableItem" + i + "'>" + " " + "</td>";
    } else {
      var dataTemp = cpyDataBits.pop();
      dataBitsText = dataBitsText + dataTemp;
      tableData.innerHTML +=
        "<td id='tableItem" + i + "'>" + dataTemp + "</td>";
    }
  }
  for (let i = lenghtOfTable; i > 0; i--) {
    var tableDataId = "tableItem" + i;
    var tableInx = "tablePosition" + i;
    var tablePositionBitsId = "tablePositionBits" + i;

    var tableDataDocument = document.getElementById(tableDataId);
    var tableInxDocument = document.getElementById(tableInx);
    var tablePositionBitsDocument =
      document.getElementById(tablePositionBitsId);

    if (tableDataDocument.textContent == "1") {
      tableDataDocument.style.backgroundColor = "#D5F0C0";
      tableInxDocument.style.backgroundColor = "#D5F0C0";
      tablePositionBitsDocument.style.backgroundColor = "#D5F0C0";
      positionOfOnes.push(tablePositionBitsDocument.textContent);
    }
  }
  if (databits.length >= 12) {
    if (positionOfOnes.length == 0) {
      for (let i = 0; i < 5; i++) {
        controlBits.push("0");
      }
    } else {
      for (let i = 0; i < 5; i++) {
        var x = "";
        for (let j = 0; j < positionOfOnes.length; j++) {
          x = x ^ positionOfOnes[j][i];
        }
        controlBits.push(x);
      }
    }
  } else if (databits.length == 4) {
    var p1 = databits[0] ^ databits[1] ^ databits[3];
    var p2 = databits[0] ^ databits[2] ^ databits[3];
    var p3 = databits[1] ^ databits[2] ^ databits[3];

    p1 = p1.toString();
    p2 = p2.toString();
    p3 = p3.toString();

    controlBits.push(p1);
    controlBits.push(p2);
    controlBits.push(p3);
  } else {
    if (positionOfOnes.length == 0) {
      for (let i = 0; i < 4; i++) {
        controlBits.push("0");
      }
    } else {
      for (let i = 0; i < 4; i++) {
        var x = "";
        for (let j = 0; j < positionOfOnes.length; j++) {
          x = x ^ positionOfOnes[j][i];
        }
        controlBits.push(x);
      }
    }
  }
  cpyControlBits = [...controlBits];
  cpyControlBits = cpyControlBits.reverse();
  console.log(controlBits);
  for (let i = lenghtOfTable; i > 0; i--) {
    if ((i & (i - 1)) == 0 || i == 1) {
      var tableDataId = "tableItem" + i;
      var tableInx = "tablePosition" + i;
      var tablePositionBitsId = "tablePositionBits" + i;

      var tableDataDocument = document.getElementById(tableDataId);
      var tableInxDocument = document.getElementById(tableInx);
      var tablePositionBitsDocument =
        document.getElementById(tablePositionBitsId);

      var temp = cpyControlBits.pop();
      controlBitsText = controlBitsText + temp;

      tableDataDocument.textContent = temp;
      tableDataDocument.style.fontWeight = "bolder";

      tableInxDocument.style.backgroundColor = "#ffebd4";
      tableDataDocument.style.backgroundColor = "#ffebd4";
      tablePositionBitsDocument.style.backgroundColor = "#ffebd4";
    }
  }
}

function addInteractivity() {
  //Adding interactivity to table data Items
  for (let i = 1; i <= lenghtOfTable; i++) {
    if ((i & (i - 1)) != 0) {
      var tableData = "tableItem" + i;
      var tableDataDocument = document.getElementById(tableData);
      tableDataDocument.style.cursor = "pointer";

      tableDataDocument.addEventListener("click", Onclick);
    }
  }
}

function Onclick(event) {
  hidden.style.display = "none";
  if (oneTimeManipulation == true) {
    hiddenWarning.textContent =
      "There is a manipulated bit on the table. Please refresh the table!";
    hiddenWarning.style.display = "block";
  } else {
    gonnaBeChangedId = this.id;
    manipulationContainer.style.display = "flex";
  }
}

function ConfirmYes() {
  oneTimeManipulation = true;
  confirmation = true;
  manipulationContainer.style.display = "none";
  var gonnaBeManipulated = document.getElementById(gonnaBeChangedId);
  if (gonnaBeManipulated.textContent == "0") {
    gonnaBeManipulated.textContent = "1";
  } else {
    gonnaBeManipulated.textContent = "0";
  }
  colorTable();
}

function ConfirmNo() {
  manipulationContainer.style.display = "none";
  manipulationContainer.style.top = "55%";
  manipulationContainer.style.left = "50%";
}

function DetectManipulated() {
  var bitsForOnlyFour = [];
  if (oneTimeManipulation == false) {
    hidden.textContent =
      "All bits are fine. There is no manipulated bit on the table!";
    hidden.style.display = "block";
  } else {
    hiddenWarning.style.display = "none";
    var listToDetectManipulatedPosition = [];
    var CheckBits = controlBitsText;
    var detectedPosition = "";
    listToDetectManipulatedPosition.push(CheckBits);

    for (let i = lenghtOfTable; i > 0; i--) {
      if ((i & (i - 1)) != 0) {
        var tableDataId = "tableItem" + i;
        var tableInx = "tablePosition" + i;
        var tablePositionBitsId = "tablePositionBits" + i;

        var tableDataDocument = document.getElementById(tableDataId);
        var tableInxDocument = document.getElementById(tableInx);
        var tablePositionBitsDocument =
          document.getElementById(tablePositionBitsId);
        bitsForOnlyFour.push(tableDataDocument.textContent);

        if (tableDataDocument.textContent == "1") {
          listToDetectManipulatedPosition.push(
            tablePositionBitsDocument.textContent
          );
        }
      }
    }
    if (CheckBits.length == 5) {
      for (let i = 0; i < 5; i++) {
        var x = "";
        for (let j = 0; j < listToDetectManipulatedPosition.length; j++) {
          x = x ^ listToDetectManipulatedPosition[j][i];
        }
        detectedPosition = detectedPosition + x;
      }
      hiddenSuccessDetected.textContent =
        "Manipulated bit has been detected successfully. Sendrome code is " +
        detectedPosition;
      hiddenSuccessDetected.style.display = "block";
    } else if (CheckBits.length == 3) {
      var condition1 = false;
      var condition2 = false;
      var condition3 = false;

      var p1 = controlBits[0];
      var p2 = controlBits[1];
      var p3 = controlBits[2];

      var d1 = bitsForOnlyFour[0];
      var d2 = bitsForOnlyFour[1];
      var d3 = bitsForOnlyFour[2];
      var d4 = bitsForOnlyFour[3];

      if (p1 ^ d1 ^ d2 ^ (d4 == "1")) {
        condition1 = true;
      }
      if (p2 ^ d1 ^ d3 ^ (d4 == "1")) {
        condition2 = true;
      }
      if (p3 ^ d2 ^ d3 ^ (d4 == "1")) {
        condition3 = true;
      }
      console.log(condition1, condition2, condition3);

      if (condition1 == true && condition2 == true && condition3 == false) {
        detectedPosition = "0111";
      } else if (
        condition1 == true &&
        condition2 == false &&
        condition3 == true
      ) {
        detectedPosition = "0110";
      } else if (
        condition1 == false &&
        condition2 == true &&
        condition3 == true
      ) {
        detectedPosition = "0101";
      } else if (
        condition1 == true &&
        condition2 == true &&
        condition3 == true
      ) {
        detectedPosition = "0011";
      }
      hiddenSuccessDetected.textContent =
        "Manipulated bit has been detected successfully. Sendrome code is " +
        detectedPosition;
      hiddenSuccessDetected.style.display = "block";
    } else {
      for (let i = 0; i < 4; i++) {
        var x = "";
        for (let j = 0; j < listToDetectManipulatedPosition.length; j++) {
          x = x ^ listToDetectManipulatedPosition[j][i];
        }
        detectedPosition = detectedPosition + x;
      }
      hiddenSuccessDetected.textContent =
        "Manipulated bit has been detected successfully. Sendrome code is " +
        detectedPosition;
      hiddenSuccessDetected.style.display = "block";
    }

    for (let i = lenghtOfTable; i > 0; i--) {
      if ((i & (i - 1)) != 0) {
        var tableDataId = "tableItem" + i;
        var tableInx = "tablePosition" + i;
        var tablePositionBitsId = "tablePositionBits" + i;

        var tableDataDocument = document.getElementById(tableDataId);
        var tableInxDocument = document.getElementById(tableInx);
        var tablePositionBitsDocument =
          document.getElementById(tablePositionBitsId);

        if (tablePositionBitsDocument.textContent == detectedPosition) {
          tableDataDocument.style.backgroundColor = "#F8D7DA";
          tableInxDocument.style.backgroundColor = "#F8D7DA";
          tablePositionBitsDocument.style.backgroundColor = "#F8D7DA";
        }
      }
    }
  }
}

manipulationContainer.addEventListener("mousedown", mouseDown, false);
window.addEventListener("mouseup", mouseUp, false);

function mouseUp() {
  window.removeEventListener("mousemove", move, true);
}

function mouseDown(e) {
  window.addEventListener("mousemove", move, true);
}

function move(e) {
  manipulationContainer.style.top = e.clientY + "px";
  manipulationContainer.style.left = e.clientX + "px";
}

function Refresh() {
  hidden.style.display = "none";
  if (gonnaBeChangedId != "" && oneTimeManipulation == true) {
    hiddenWarning.style.display = "none";
    hiddenSuccessDetected.style.display = "none";
    confirmation = false;
    oneTimeManipulation = false;
    var gonnaBeChangedDocument = document.getElementById(gonnaBeChangedId);

    if (gonnaBeChangedDocument.textContent == "0") {
      gonnaBeChangedDocument.textContent = "1";
    } else {
      gonnaBeChangedDocument.textContent = "0";
    }
    colorTable();
    gonnaBeChangedId = "";
  }
}
