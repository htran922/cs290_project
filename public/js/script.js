document.getElementById('addButton').addEventListener('click', (event) => {
    var form = document.getElementById("addForm");
    var req = new XMLHttpRequest;
    // create URL
    var url = "/insert?name=";
    var param = form.elements.name.value +
        "&reps=" + form.elements.reps.value +
        "&weight=" + form.elements.weight.value +
        "&date=" + form.elements.date.value;

    if (form.elements.unit.checked) {
        param += "&unit=1"; 
    } else {
        param += "&unit=0";
    }

    url += param;
    console.log(url);

    req.open("GET", url, true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    req.addEventListener('load', () => {
        if (req.status >= 200 && req.status < 400) {
            var response = JSON.parse(req.responseText);
            var id = response.inserted;
            var table = document.getElementById("outputTable");
            var tr = table.insertRow(-1);

            // name column
            var nameCol = document.createElement("td");
            var popErrorMsg = document.getElementById("errorMsg");
            
            nameCol.textContent = form.elements.name.value;
            tr.appendChild(nameCol);

            // reps column
            var repsCol = document.createElement("td");
            repsCol.textContent = form.elements.reps.value;
            tr.appendChild(repsCol);

            // weight column
            var weightCol = document.createElement("td");
            weightCol.textContent = form.elements.weight.value;
            tr.appendChild(weightCol);

            // date column
            var dateCol = document.createElement("td");
            dateCol.textContent = form.elements.date.value;
            tr.appendChild(dateCol);

            // unit column
            var unitCol = document.createElement("td");
            if (form.elements.unit.checked == 1) {
                unitCol.textContent = "lbs";
            } else {
                unitCol.textContent = "kg";
            }
            tr.appendChild(unitCol);

            // update column
            var updateCol = document.createElement("td");
            var updateBtn = document.createElement("input");
            updateBtn.type = "button";
            updateBtn.value = "Update";
            updateBtn.className = "btn btn-warning";
            var updateLink = document.createElement("a");
            updateLink.setAttribute('href', '/update?id=' + id);
            updateLink.appendChild(updateBtn);
            updateCol.appendChild(updateLink);
            tr.appendChild(updateCol);

            // delete column
            var deleteCol = document.createElement("td");
            var deleteInputHidden = document.createElement("input");
            deleteInputHidden.type = "hidden";
            deleteInputHidden.setAttribute("id", "delete" + id);
            var deleteBtn = document.createElement("input");
            deleteBtn.type = "button";
            deleteBtn.value = "Delete";
            deleteBtn.className = "btn btn-danger";
            deleteBtn.setAttribute("onclick", "deleteEntry(" + id + ")");
            deleteCol.appendChild(deleteBtn);
            deleteCol.appendChild(deleteInputHidden);
            tr.appendChild(deleteCol);

        } else {
            console.log(error);
        }
    });

    req.send(url);
    event.preventDefault();
});


function deleteEntry(id) {
    var table = document.getElementById("outputTable");
    var rowCount = table.rows.length;

    for (var i = 1; i < rowCount; i++) {
        var row = table.rows[i];
        var allRows = row.getElementsByTagName("td");
        var remove = allRows[allRows.length - 1];
        if (remove.children[1].id === ("delete" + id)) {
            table.deleteRow(i);
        }
    }

    var req = new XMLHttpRequest();

    req.open("GET", "/delete?id=" + id, true);

    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            console.log('Success');
        } else {
            console.log('Error');
        }
    });

    req.send("/delete?id=" + id); 
}
