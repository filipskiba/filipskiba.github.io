$(document).ready(function () {
    var contractorsApi = 'https://pacific-castle-21497.herokuapp.com/api/contractors';
    var settlementsApi = 'https://pacific-castle-21497.herokuapp.com/api/settlements';

    getAllContractors();
    getAllSettlements();


    $.fn.datepicker.defaults.format = "yyyy-mm-dd";
    $("#datapicker").datepicker();
    $("#date-of-payment").datepicker();

    $('[data-settlements-add-form]').on('submit', addSettlement);
    $('#edit_settlement').on("click", updateSettlement);

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
        $('#settlements-table-body').empty()
        settlementsData.forEach(function (settlement) {
            var $datatableRowEl = createElement(settlement);
            $datatableRowEl
                .appendTo($('#settlements-table-body'));
        });
    }

    function createElement(data) {
        var dateOfIssue = new Date(data.dateOfIssue);
        var dateOfPayment = new Date(data.dateOfPayment);
        var formatted_dateOfIssue = dateOfIssue.getFullYear() + "-" + appendLeadingZeroes(dateOfIssue.getMonth() + 1) + "-" + appendLeadingZeroes(dateOfIssue.getDate())
        var formatted_dateOfPayment = dateOfPayment.getFullYear() + "-" + appendLeadingZeroes(dateOfPayment.getMonth() + 1) + "-" + appendLeadingZeroes(dateOfPayment.getDate())
        var $tr = $('<tr>').append(
            $('<td>').text(data.settlementId).hide(),
            $('<td>').text(data.contractorId).hide(),
            $('<td>').text(data.contractorName),
            $('<td>').text(data.document),
            $('<td>').text(formatted_dateOfIssue),
            $('<td>').text(formatted_dateOfPayment),
            $('<td>').text(data.amount),
            $('<td>').text(data.paidAmount),
            $('<td>').append(isChecked(data)),
            $('<td><button class="btn btn-success" id="edit-settlement-button">edytuj</button>'),
            $('<td><button class="btn btn-danger" id="delete-settlement-button">usuń</button>')
        );
        return $tr;
    }

    $('#settlements-table-body').on("click", "#delete-settlement-button", function (event) {
        var curentRow = $(this).closest('tr');
        var id_col = curentRow.find('td:eq(0)').text();
        deleteSettlement(id_col);
    });

    $('#settlements-table-body').on("click", "#edit-settlement-button", function (event) {
        event.preventDefault();
        $("#myModal").modal();

        var curentRow = $(this).closest('tr');
        var id = curentRow.find('td:eq(0)').text();
        var contractorId = curentRow.find('td:eq(1)').text();
        var document = curentRow.find('td:eq(3)').text();
        var dateOfIssue = curentRow.find('td:eq(4)').text();
        var dateOfPayment = curentRow.find('td:eq(5)').text();
        var amount = curentRow.find('td:eq(6)').text();


        $("#edit-id").val(id);
        $("#contractor-id").val(contractorId);
        $("#edit-document").val(document);
        $("#edit-date-of-issue").val(dateOfIssue);
        $("#edit-date-of-payment").val(dateOfPayment);
        $("#edit-amount").val(amount);


    });

    function isChecked(data) {
        if (data.isPaid == true) {
            return $('<input type="checkbox" checked disabled>')
        } else {
            return $('<input type="checkbox" disabled>')
        }

    }

    function appendLeadingZeroes(n) {
        if (n <= 9) {
            return "0" + n;
        }
        return n
    }

    function getAllContractors() {
        $.ajax({
            url: contractorsApi,
            method: 'GET',
            success: fillContractorsCombobox
        });
    }

    function getAllSettlements() {
        $.ajax({
            url: settlementsApi,
            method: 'GET',
            success: handleDatatableRender
        });
    }


    function deleteSettlement(settlementId) {
        var selectedId = $("#contractors-combobox option:selected").val();
        $.ajax({
            url: settlementsApi + '/' + settlementId,
            method: 'DELETE',
            success: function () {
                $('#rows').empty()
                getAllSettlements()
            }
        })
    }

    function addSettlement(event) {
        event.preventDefault();
        var settlementDocument = $(this).find('[name="document"]').val();
        var settlementDateOfIssue = $(this).find('[name="date-of-issue"]').val();
        var settlementDateOfPayment = $(this).find('[name="date-of-payment"]').val();
        var settlementAmount = $(this).find('[name="amount"]').val();
        var selectedId = $("#contractors-combobox option:selected").val();
        var requestUrl = settlementsApi;
        $.ajax({
            url: requestUrl,
            method: 'POST',
            processData: false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({
                contractorId: selectedId,
                document: settlementDocument,
                dateOfIssue: settlementDateOfIssue,
                dateOfPayment: settlementDateOfPayment,
                amount: settlementAmount
            }),
            complete: function (data) {
                if (data.status === 200) {
                    getAllSettlements();
                }
            }
        });
    }

    function updateSettlement() {

        var id = $("#edit-id").val();
        var contractorId = $("#contractor-id").val();
        var settlementDocument = $("#edit-document").val();
        var settlementDateOfIssue = $("#edit-date-of-issue").val();
        var settlementDateOfPayment = $("#edit-date-of-payment").val();
        var settlementAmount = $("#edit-amount").val();
        var requestUrl = settlementsApi;
        $.ajax({
            url: requestUrl,
            method: "PUT",
            processData: false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({
                settlementId: id,
                contractorId: contractorId,
                document: settlementDocument,
                dateOfIssue: settlementDateOfIssue,
                dateOfPayment: settlementDateOfPayment,
                amount: settlementAmount

            }),
            success: function (data) {
                getAllSettlements();
                $('#myModal').modal('hide');
            }
        });
    }


});