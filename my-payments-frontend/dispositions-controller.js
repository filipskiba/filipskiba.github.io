$(document).ready(function () {
    var prod = 'https://pacific-castle-21497.herokuapp.com';
  //  var test = 'http://localhost:8083';
    var dispositionsApi = prod + '/api/dispositions';

    getAllDispositions();

    function handleDatatableRender(dispositions) {

        $('#payments-table-body').empty()
        dispositions.forEach(function (disposition) {
            var $datatableRowEl = createElement(disposition);
            $datatableRowEl
                .appendTo($('#dispositions-table-body'));
        });
    }

    $('#get-selected').click(function () {
        sendCheckedDispositions();
    });

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=windows-1250,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }


    function sendCheckedDispositions() {
        //Reference the Table.
        var grid = document.getElementById("dispositions-table");

        //Reference the CheckBoxes in Table.
        var checkBoxes = grid.getElementsByTagName("INPUT");
        var message = dispositionsApi + "/download?";
        //Loop through the CheckBoxes.
        for (var i = 0; i < checkBoxes.length; i++) {
            if (checkBoxes[i].checked) {
                var row = checkBoxes[i].parentNode.parentNode;
                message += "id="
                message += row.cells[0].innerHTML + "&";
            }

        }
        if (message.charAt(message.length - 1) == "&") {
            message = message.substring(0, message.length - 1);
        }
        $.ajax({
            url: message,
            method: 'GET',
            success: function (data) {
                download("dispositions.txt", data)
            }
        });

        //Display selected Row data in Alert Box.
        // alert(message);
    }


    function createElement(data) {

        var $tr = $('<tr>').append(
            $('<td>').text(data.dispositionId),
            $('<td>').text(data.contractorName),
            $('<td>').text(data.dateOfExecution),
            $('<td>').text(data.amount),
            $('<td align="center">').append(isChecked(data)),
            $('<td align="center"><input type="checkbox">'),
            $('<td><button class="btn btn-danger" id="delete-payment-button">usuń</button>')
        );
        return $tr;
    }

    function getAllDispositions() {
        $.ajax({
            url: dispositionsApi,
            method: 'GET',
            success: handleDatatableRender
        });
    }

    function isChecked(data) {
        if (isDispositionExecuted(data)) {
            return $('<i class="fas fa-check"></i>')
        } else {
            return $('<i class="far fa-times-circle"></i>')
        }

    }

    function isDispositionExecuted(data) {
        if (data.isExecuted == true) {
            return true;
        } else return false;
    }
});