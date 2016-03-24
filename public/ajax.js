var appURL = "http://52.33.199.213:3000";
document.addEventListener('DOMContentLoaded', bindButtons);
document.addEventListener('DOMContentLoaded', refreshTable);

function bindButtons(){
  document.getElementById('addExercise').addEventListener('click', function(event){
    var name = document.getElementById('name').value;
    var reps = document.getElementById('reps').value;
    var weight = document.getElementById('weight').value;
    var lbs = document.getElementById('lbs').value;
    var date = document.getElementById('date').value;

    var req = new XMLHttpRequest();
    req.open("GET", appURL + "/addExercise?name=" + name + "&reps=" + reps + "&weight=" + weight + "&lbs=" + lbs + "&date=" + date, true);
    req.addEventListener('load',function() {
      if(req.status >= 200 && req.status < 400){
        refreshTable();
      } else {
        console.log("Error in network request");
      }
    });
    req.send(null);
    event.preventDefault();
  });
}

function refreshTable() {
  // clear out old values
  var tableContent = document.getElementById("tableContent");
  while (tableContent.lastChild) {
    tableContent.removeChild(tableContent.lastChild);
  }

  // populate with new values from db
  var req = new XMLHttpRequest();
  req.open("GET", appURL + "/data", true);
  req.addEventListener('load',function() {
    if(req.status >= 200 && req.status < 400){
      var response = JSON.parse(req.responseText);
      // console.log(response);
      var responseLength = response.length;
      for (var i = 0; i < responseLength; i++) {
        var thisRow = document.createElement("tr");
        document.getElementById("tableContent").appendChild(thisRow);
        for (var value in response[i]) {
          if(value === "date") {
            var thisCell = document.createElement("td");
            var d = new Date(response[i][value]);
            thisCell.textContent = d.toDateString();
            thisRow.appendChild(thisCell);
          } else if (value === "weight") {
            var thisCell = document.createElement("td");
            if(response[i]["lbs"] === 1) {
              thisCell.textContent = response[i][value] + " lbs";
            } else {
              thisCell.textContent = response[i][value] + " kg";
            }
            thisRow.appendChild(thisCell);
          } else if (value === "lbs") { // do nothing
          } else if (value === "id") { // do nothing
          } else {
            var thisCell = document.createElement("td");
            thisCell.textContent = response[i][value];
            thisRow.appendChild(thisCell);
          }
        }
        makeButtons(thisRow, response[i].id);
      }
    } else {
      console.log("Error in network request");
    }
  });
  req.send(null);
  event.preventDefault();
}

function deleteExercise(id) {
  var req = new XMLHttpRequest();
  req.open("GET", appURL + "/deleteExercise?id=" + id, true);
  req.addEventListener('load',function() {
    if(req.status >= 200 && req.status < 400){
      refreshTable();
    } else {
      console.log("Error in network request");
    }
  });
  req.send(null);
  event.preventDefault();
}

function makeButtons(thisRow,id) {
  var cell1 = document.createElement("td");
  thisRow.appendChild(cell1);
  var button1 = document.createElement("button");
  button1.setAttribute("onclick", "deleteExercise(" + id + ")");
  button1.setAttribute("class", "pure-button");
  cell1.appendChild(button1);
  var icon1 = document.createElement("i");
  icon1.setAttribute("class", "fa fa-trash");
  button1.appendChild(icon1);

  //<input type="hidden" name="Language" value="English">
  var cell2 = document.createElement("td");
  thisRow.appendChild(cell2);
  var form2 = document.createElement("form");
  form2.setAttribute("action", "/edit");
  cell2.appendChild(form2);
  var hidden2 = document.createElement("input");
  hidden2.setAttribute("type","hidden");
  hidden2.setAttribute("name","id");
  hidden2.setAttribute("value",id);
  form2.appendChild(hidden2);
  var button2 = document.createElement("button");
  button2.setAttribute("class", "pure-button");
  form2.appendChild(button2);
  var icon2 = document.createElement("i");
  icon2.setAttribute("class", "fa fa-pencil");
  button2.appendChild(icon2);
}
