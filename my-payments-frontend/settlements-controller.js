$(document).ready(function () {
    var contractorsApi = 'https://pacific-castle-21497.herokuapp.com/api/contractors';
    var settlementsApi = 'https://pacific-castle-21497.herokuapp.com/api/settlements';
    var paymentsApi = 'https://pacific-castle-21497.herokuapp.com/api/payments';

    getAllContractors();
    getAllSettlements();


    $.fn.datepicker.defaults.format = "yyyy-mm-dd";
    $.fn.datepicker.defaults.autoclose = true;
    $.fn.datepicker.dates['pl'] = {
        days: ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"],
        daysShort: ["Pn", "Wt", "Śr", "Czw", "Pt", "Sb", "Nd"],
        daysMin: ["Pn", "Wt", "Śr", "Czw", "Pt", "Sb", "Nd"],
        months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
        monthsShort: ["St", "Lut", "Marz", "Kw", "Maj", "Czer", "Lip", "Sier", "Wrz", "Paź", "List", "Grudz"],
        today: "Dzisiaj",
        clear: "Wyczyść",
        format: "yyyy-mm-dd",
        titleFormat: "MM yyyy", /* Leverages same syntax as 'format' */
        weekStart: 0
    };
    $.fn.datepicker.defaults.language = 'pl';

    $("#datapicker").datepicker();
    $("#date-of-payment").datepicker();

    $('[data-settlements-add-form]').on('submit', addSettlement);
    $('#edit_settlement').on("click", updateSettlement);
    $('[data-payments-add-form]').on('submit', addPayment);

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
            $('<td align="center">').text(data.document),
            $('<td>').text(formatted_dateOfIssue),
            $('<td>').text(formatted_dateOfPayment),
            $('<td align="center">').text(data.amount),
            $('<td align="center">').text(data.paidAmount),
            $('<td align="center">').append(isChecked(data)),
            $('<td align="center"><button class="btn btn-success" id="pay-settlement-button">zapłać</button>'),
            $('<td align="center"><button class="btn btn-success" id="edit-settlement-button">edytuj</button>'),
            $('<td align="center"><button class="btn btn-danger" id="delete-settlement-button">usuń</button>')
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

    $('#settlements-table-body').on("click", "#pay-settlement-button", function (event) {
        event.preventDefault();
        var date = new Date();
        var formattedDate = date.getFullYear() + "-" + appendLeadingZeroes(date.getMonth() + 1) + "-" + appendLeadingZeroes(date.getDate());

        var curentRow = $(this).closest('tr');
        var id = curentRow.find('td:eq(0)').text();
        var contractorId = curentRow.find('td:eq(1)').text();
        var amount = curentRow.find('td:eq(6)').text();
        var paidAmount = curentRow.find('td:eq(7)').text();

        if (getAmountToPay(amount, paidAmount) > 0) {
            $("#paymentsModal").modal();
            $("#settlement-id").val(id);
            $("#date-of-transfer").val(formattedDate);
            $("#contractor-p-id").val(contractorId);
            $("#p-amount").val(getAmountToPay(amount, paidAmount)).prop('max',getAmountToPay(amount,paidAmount));

        } else {
            $("#settled").fadeIn();
            closeAlert();
        }


    });

    function getAmountToPay(amount, paidAmount) {
        var val = parseFloat(amount);
        var val2 = parseFloat(paidAmount);

        return val - val2;
    }

    function isChecked(data) {
        if (isSettlementPaid(data)) {
            return $('<i class="fas fa-check"></i>')
        } else {
            return $('<i class="far fa-times-circle"></i>')
        }

    }

    function isSettlementPaid(data) {
        if (data.isPaid == true) {
            return true;
        } else return false;
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

    function addPayment(event) {
        event.preventDefault();
        var settlementDateOfTransfer = $("#date-of-transfer").val();
        var settlementAmount = $("#p-amount").val();
        var contractor = $("#contractor-p-id").val();
        var settlement = $("#settlement-id").val();
        var requestUrl = paymentsApi;
        $.ajax({
            url: requestUrl,
            method: 'POST',
            processData: false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({
                settlementId: settlement,
                contractorId: contractor,
                dateOfTransfer: settlementDateOfTransfer,
                amount: settlementAmount
            }),
            complete: function (data) {
                if (data.status === 200) {
                    getAllSettlements();
                    $('#paymentsModal').modal('hide');
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

    function closeAlert(){
        window.setTimeout(function () {
            $("#settled").fadeOut(300)
        }, 3000);
    }
});