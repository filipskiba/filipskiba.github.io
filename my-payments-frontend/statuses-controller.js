$(document).ready(function () {
    var contractorsApi = 'https://pacific-castle-21497.herokuapp.com/api/contractors';
    var statusesApi = 'https://pacific-castle-21497.herokuapp.com/api/statuses';
    getAllContractors();
    getAllStatuses();

    $('[data-status-add-form]').on('submit', createStatusForContractor);
    $("#add_all_statuses").on('click', createStatusForAllContractors);

    function fillContractorsCombobox(contractors) {
        //$('#contractors-combobox').empty()
        contractors.forEach(function (contractor) {

            var option = $("<option />");

            //Set Contractor Name in Text part.
            option.html(contractor.contractorName);

            //Set Contractor contractorId in Value part.
            option.val(contractor.contractorId);

            //Add the Option element to DropDownList.
            option.appendTo($('#contractors-combobox'));

        });
    }

    $("#contractors-combobox").change(function () {
        var selectedId = $(this).children("option:selected").val();
    });

    function handleDatatableRender(settlementsData) {
        $('#statuses-table-body').empty()
        settlementsData.forEach(function (settlement) {
            var $datatableRowEl = createElement(settlement);
            $datatableRowEl
                .appendTo($('#statuses-table-body'));
        });
    }

    function createElement(data) {
        var statusDate = new Date(data.statusDate);
        var formatted_statusDate = statusDate.getFullYear() + "-" + appendLeadingZeroes(statusDate.getMonth() + 1) + "-" + appendLeadingZeroes(statusDate.getDate());
        var $tr = $('<tr>').append(
            $('<td>').text(data.statusId).hide(),
            $('<td>').text(data.contractorName),
            $('<td>').text(formatted_statusDate),
            $('<td align="center">').append(isChecked(data.isContractorOnWL)),
            $('<td align="center"><button class="btn btn-danger" id="delete-settlement-button">usuń</button>')
        );
        return $tr;
    }

    $('#statuses-table-body').on("click", "#delete-settlement-button", function (event) {
        var curentRow = $(this).closest('tr');
        var id_col = curentRow.find('td:eq(0)').text();
        deleteStatus(id_col);
    });

    function appendLeadingZeroes(n) {
        if (n <= 9) {
            return "0" + n;
        }
        return n
    }

    function isChecked(data) {
        if (data == true) {
            return $('<i class="fas fa-check"></i>')
        } else {
            return $('<i class="far fa-times-circle"></i>')
        }

    }

    function createStatusForContractor(event) {
        event.preventDefault();

        var selectedId = $("#contractors-combobox option:selected").val();
        var requestUrl = statusesApi+"/"+selectedId;
        $.ajax({
            url: requestUrl,
            method: 'POST',
            processData: false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({
                contractorId: selectedId,
            }),
            complete: function (data) {
                if (data.status === 200) {
                    getAllStatuses();
                }
                else {
                    console.log('Bad nip or id '+ data.status)
                }
            }
        });
    }
    function createStatusForAllContractors() {
        $.ajax({
            url: statusesApi+"/"+"all",
            method: 'GET',
            success: function () {
                $('#rows').empty()
                getAllStatuses()
            }
        });
    }

    function deleteStatus(statusId) {
        $.ajax({
            url: statusesApi + '/' + statusId,
            method: 'DELETE',
            success: function () {
                $('#rows').empty()
                getAllStatuses()
            }
        })
    }

    function getAllContractors() {
        $.ajax({
            url: contractorsApi,
            method: 'GET',
            success: fillContractorsCombobox
        });
    }

    function getAllStatuses() {
        $.ajax({
            url: statusesApi,
            method: 'GET',
            success: handleDatatableRender
        });
    }
});