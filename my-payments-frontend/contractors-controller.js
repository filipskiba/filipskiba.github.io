$(document).ready(function () {
    var prod = 'https://pacific-castle-21497.herokuapp.com';
    var apiRoot = API_ENDPOINT + '/api/contractors';

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
            $('<td>').text(data.contractorId).hide(),
            $('<td>').text(data.contractorName),
            $('<td>').text(data.nipId),
            $('<td>').text(data.address),
            $('<td>').text(data.city),
            $('<td>').text(data.zipCode),
            $('<td>').text(data.contractorType),
            $('<td><button class="btn btn-success" id="edit-contractor-button">edytuj</button>'),
            $('<td><button class="btn btn-danger" id="delete-contractor-button">usuń</button>')
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
        var address = curentRow.find('td:eq(3)').text();
        var city = curentRow.find('td:eq(4)').text();
        var zipCode = curentRow.find('td:eq(5)').text();
        var contractorType = curentRow.find('td:eq(6)').text();

        $("#edit_id").val(contractorId);
        $("#edit_contractor_name").val(contractorName);
        $("#edit_contractor_nip").val(contractorNip);
        $("#edit_contractor_address").val(address);
        $("#edit_contractor_city").val(city);
        $("#edit_contractor_zip-code").val(zipCode);
        $("#edit_contractor_type").val(contractorType);

    });
    //*************************************TABLE***********************************************************************

    //************************************************CRUD**************************************************************

    function getAllContractors() {
        $.ajax({
            url: apiRoot,
            method: 'GET',
            success: handleDatatableRender,
            error: function () {
                alert('Nie można pobrać kontrahentów!')
            }

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
            },
            error: function () {
                alert('Nie udało się usunąć kontrahenta!');
            }
        })
    }

    function addContractor(event) {
        event.preventDefault();
        var contractorName = $(this).find('[name="contractorName"]').val();
        var contractorNip = $(this).find('[name="nipId"]').val();
        var contractorAddress = $(this).find('[name="address"]').val();
        var contractorCity = $(this).find('[name="city"]').val();
        var contractorZipCode = $(this).find('[name="zip-code"]').val();
        var selectedType = $("#contractor-type option:selected").val();
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
                nipId: contractorNip,
                address: contractorAddress,
                city: contractorCity,
                zipCode: contractorZipCode,
                contractorType: selectedType


            }),
            complete: function (data) {
                if (data.status === 200) {
                    getAllContractors();
                } else {
                    alert('Nie udało się zapisać kontrahenta!')
                }
            }
        });
    }

    function updateContractor() {

        var id = $("#edit_id").val();
        var contractorName = $("#edit_contractor_name").val();
        var contractorNip = $("#edit_contractor_nip").val();
        var contractorAddress = $("#edit_contractor_address").val();
        var contractorCity = $("#edit_contractor_city").val();
        var contractorZipCode = $("#edit_contractor_zip-code").val();
        var selectedType = $("#edit_contractor_type option:selected").val();
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
                nipId: contractorNip,
                address: contractorAddress,
                city: contractorCity,
                zipCode: contractorZipCode,
                contractorType: selectedType
            }),
            success: function (data) {
                getAllContractors();
                $('#myModal').modal('hide');
            },
            error: function () {
                alert('Nie udało się uaktualnić kontrahenta!')
            }
        });
    }

    //************************************************CRUD**************************************************************
});