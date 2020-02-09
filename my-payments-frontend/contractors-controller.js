$(document).ready(function() {
    var apiRoot = 'https://pacific-castle-21497.herokuapp.com/api/contractors';

    getAllContractors();

    //*************************************BUTTONS*********************************************************************
    $('[data-contractor-add-form]').on('submit', addContractor);
    $('#edit_contractor').on("click", updateContractor);
    //*************************************BUTTONS*********************************************************************

    //*************************************TABLE***********************************************************************
    function handleDatatableRender(contractorData) {
        $('#contractors-table-body').empty()
        contractorData.forEach(function (contractor) {
            var $datatableRowEl = createElement(contractor);
            $datatableRowEl
                .appendTo($('#contractors-table-body'));
        });
    }
    function createElement(data) {

        var $tr = $('<tr>').append(
            $('<td>').text(data.contractorId),
            $('<td>').text(data.contractorName),
            $('<td>').text(data.nipId),
            $('<td><button class="btn btn-success" id="edit-contractor-button">edit</button>'),
            $('<td><button class="btn btn-danger" id="delete-contractor-button">delete</button>')

        );
        return $tr;
    }


    $('#contractors-table-body').on("click", "#delete-contractor-button", function (event) {
        var curentRow = $(this).closest('tr');
        var id_col = curentRow.find('td:eq(0)').text();
        console.log(id_col);
        deleteContractor(id_col);
    });

    $('#contractors-table-body').on("click", "#edit-contractor-button", function (event) {
        event.preventDefault();
        $("#myModal").modal();

        var curentRow = $(this).closest('tr');
        var contractorId = curentRow.find('td:eq(0)').text();
        var contractorName = curentRow.find('td:eq(1)').text();
        var contractorNip = curentRow.find('td:eq(2)').text();

        $("#edit_id").val(contractorId);
        $("#edit_contractor_name").val(contractorName);
        $("#edit_contractor_nip").val(contractorNip);

    });
    //*************************************TABLE***********************************************************************

    //************************************************CRUD**************************************************************

    function getAllContractors() {
        $.ajax({
            url: apiRoot,
            method: 'GET',
            success: handleDatatableRender

        });
    }

    function deleteContractor(contractorId) {

        $.ajax({
            url: apiRoot + '/' + contractorId,
            method: 'DELETE',
            success: function () {
                $('#rows').empty()
                getAllContractors();
                // parentEl.slideUp(400, function() { parentEl.remove(); });
            }
        })
    }

    function addContractor(event) {
        event.preventDefault();
        var contractorName = $(this).find('[name="contractorName"]').val();
        var contractorNip = $(this).find('[name="nipId"]').val();
        console.log(contractorName)
        var requestUrl = apiRoot;

        $.ajax({
            url: requestUrl,
            method: 'POST',
            processData: false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({
                contractorName: contractorName,
                nipId: contractorNip
            }),
            complete: function (data) {
                if (data.status === 200) {
                    getAllContractors();
                }
            }
        });
    }

    function updateContractor() {

        var id = $("#edit_id").val();
        var contractorName = $("#edit_contractor_name").val();
        var contractorNip = $("#edit_contractor_nip").val();

        var requestUrl = apiRoot;

        $.ajax({
            url: requestUrl,
            method: "PUT",
            processData: false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({
                contractorId: id,
                contractorName: contractorName,
                nipId: contractorNip
            }),
            success: function (data) {
                getAllContractors();
                $('#myModal').modal('hide');
            }
        });
    }
    //************************************************CRUD**************************************************************
});