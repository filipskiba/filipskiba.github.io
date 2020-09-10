$(document).ready(function () {
    var prod = 'https://pacific-castle-21497.herokuapp.com';
    //  var test = 'http://localhost:8083'
    var contractorsApi = prod + '/api/contractors';
    var settlementsApi = prod + '/api/settlements';
    var paymentsApi = prod + '/api/payments';
    var bankAccountApi = prod + '/api/bankAccounts';

    getAllContractors();
    getAllSettlements();
    getAllOwners();


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

    function fillOwnersCombobox(owners) {
        //$('#contractors-combobox').empty()
        owners.forEach(function (owner) {

            var option = $("<option />");

            //Set Contractor Name in Text part.
            option.html(owner.contractorName);

            //Set Contractor contractorId in Value part.
            option.val(owner.contractorId);

            //Add the Option element to DropDownList.
            option.appendTo($('#owners-combobox'));

        });
    }

    function fillOwnerBankAccountCombobox(contractorId) {
        $('#OwnerBankAccountNumber-combobox').empty()
        $.ajax({
            url: bankAccountApi + '/' + contractorId,
            method: 'GET',
            success: function (data) {
                data.forEach(function (data) {

                    var option = $("<option />");

                    //Set Contractor Name in Text part.
                    option.html(data.bankAccountNumber);

                    //Set Contractor contractorId in Value part.
                    option.val(data.bankAccountNumber);

                    //Add the Option element to DropDownList.
                    option.appendTo($('#OwnerBankAccountNumber-combobox'));

                });
            }
        });
    }

    function fillBankAccountCombobox(contractorId) {
        $('#bankAccountNumber-combobox').empty()
        $.ajax({
            url: bankAccountApi + '/' + contractorId,
            method: 'GET',
            success: function (data) {
                data.forEach(function (data) {

                    var option = $("<option />");

                    //Set Contractor Name in Text part.
                    option.html(data.bankAccountNumber);

                    //Set Contractor contractorId in Value part.
                    option.val(data.bankAccountNumber);

                    //Add the Option element to DropDownList.
                    option.appendTo($('#bankAccountNumber-combobox'));

                });
            }
        });
    }

    function fillEditBankAccountCombobox(contractorId) {
        $('#edit-bankAccountNumber-combobox').empty();

        $.ajax({
            url: bankAccountApi + '/' + contractorId,
            method: 'GET',
            success: function (data) {
                data.forEach(function (data) {

                    var option = $("<option />");

                    //Set Contractor Name in Text part.
                    option.html(data.bankAccountNumber);

                    //Set Contractor contractorId in Value part.
                    option.val(data.bankAccountNumber);

                    //Add the Option element to DropDownList.
                    option.appendTo($('#edit-bankAccountNumber-combobox'));

                });
            }
        });
    }

    $("#contractors-combobox").change(function () {
        var selectedId = $(this).children("option:selected").val();
        fillBankAccountCombobox(selectedId);
    });
    $("#owners-combobox").change(function () {
        var selectedId = $(this).children("option:selected").val();
        fillOwnerBankAccountCombobox(selectedId);
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
            $('<td align="center">').text(data.bankAccountNumber),
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

    function fillEditForm(data) {
        $("#edit-id").val(data.settlementId);
        $("#contractor-id").val(data.contractorId);
        $("#edit-owner-id").val(data.ownerId);
        $("#edit-owner-bankAccount").val(data.ownerBankAccountNumber);
        $("#edit-document").val(data.document);
        $("#edit-date-of-issue").val(data.dateOfIssue);
        $("#edit-date-of-payment").val(data.dateOfPayment);
        $("#edit-amount").val(data.amount);
        fillEditBankAccountCombobox(data.contractorId);
    }

    function fillPaymentForm(data) {
        var date = new Date();
        var formattedDate = date.getFullYear() + "-" + appendLeadingZeroes(date.getMonth() + 1) + "-" + appendLeadingZeroes(date.getDate());
        $("#settlement-id").val(data.settlementId);
        $("#contractor-p-id").val(data.contractorId);
        $("#p-owner-id").val(data.ownerId);
        $("#p-owner-bankAccount").val(data.ownerBankAccountNumber);
        $("#p-document").val(data.document);
        $("#date-of-transfer").val(formattedDate);
        $("#p-amount").val(getAmountToPay(data.amount, data.paidAmount));
        $("#p-bankAccountNumber-combobox").val(data.bankAccountNumber);


    }

    $('#settlements-table-body').on("click", "#edit-settlement-button", function (event) {
        event.preventDefault();
        $("#myModal").modal();
        var currentRow = $(this).closest('tr');
        var id = currentRow.find('td:eq(0)').text();
        getSettlementForEdit(id);
    });

    $('#settlements-table-body').on("click", "#pay-settlement-button", function (event) {
        event.preventDefault();

        var curentRow = $(this).closest('tr');
        var id = curentRow.find('td:eq(0)').text();
        var paidAmount = curentRow.find('td:eq(7)').text();
        var amount = curentRow.find('td:eq(6)').text();


        if (getAmountToPay(amount, paidAmount) > 0) {
            $("#paymentsModal").modal();
            getSettlementForPayment(id)

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
            success: fillContractorsCombobox,
            error: function () {
                alert('Nie udało się pobrać kontrahentów!')
            }
        });
    }

    function getAllOwners() {
        $.ajax({
            url: contractorsApi + '/owners',
            method: 'GET',
            success: fillOwnersCombobox,
            error: function () {
                alert('Nie udało się pobrać listy właścicieli!')
            }
        });
    }

    function getSettlementForEdit(id) {
        $.ajax({
            url: settlementsApi + '/' + id,
            method: 'GET',
            success: function (data) {
                fillEditForm(data);
            },
            error: function () {
                alert('Nie udało się pobrać danych rozrachunku!')
            }
        });
    }

    function getSettlementForPayment(id) {
        $.ajax({
            url: settlementsApi + '/' + id,
            method: 'GET',
            success: function (data) {
                fillPaymentForm(data);
            },
            error: function () {
                alert('Nie udało się pobrać danych rozrachunku!')
            }
        });
    }


    function getAllSettlements() {
        $.ajax({
            url: settlementsApi,
            method: 'GET',
            success: handleDatatableRender,
            error: function () {
                alert('Nie udało się pobrać listy rozrachunków!')
            }
        });
    }


    function deleteSettlement(settlementId) {
        $.ajax({
            url: settlementsApi + '/' + settlementId,
            method: 'DELETE',
            success: function () {
                $('#rows').empty()
                getAllSettlements()
            },
            error: function () {
                alert('Nie udało się usunąć  rozrachunku!')
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
        var selectedBankAccount = $("#bankAccountNumber-combobox option:selected").val();
        var selectedOwner = $("#owners-combobox option:selected").val();
        var selectedOwnerBankAccount = $("#OwnerBankAccountNumber-combobox option:selected").val();
        var requestUrl = settlementsApi;

        $.ajax({
            url: requestUrl,
            method: 'POST',
            processData: false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({
                ownerId: selectedOwner,
                ownerBankAccountNumber: selectedOwnerBankAccount,
                contractorId: selectedId,
                document: settlementDocument,
                dateOfIssue: settlementDateOfIssue,
                dateOfPayment: settlementDateOfPayment,
                amount: settlementAmount,
                bankAccountNumber: selectedBankAccount
            }),
            complete: function (data) {
                if (data.status === 200) {
                    getAllSettlements();
                } else {
                    alert('Nie udało się dodać rozrachunku!')
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
        var document = $("#p-document").val();
        var selectedBankAccount = $("#p-bankAccountNumber-combobox").val();
        var selectedOwner = $("#p-owner-id").val();
        var selectedOwnerBankAccount = $("#p-owner-bankAccount").val();
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
                amount: settlementAmount,
                bankAccountNumber: selectedBankAccount,
                ownerId: selectedOwner,
                document: document,
                ownerBankAccountNumber: selectedOwnerBankAccount
            }),
            complete: function (data) {
                if (data.status === 200) {
                    getAllSettlements();
                    $('#paymentsModal').modal('hide');
                } else {
                    alert('Nie udało się dokonać płatności!')
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
        var selectedBankAccount = $("#edit-bankAccountNumber-combobox option:selected").val();
        var selectedOwner = $("#edit-owner-id").val();
        var selectedOwnerBankAccount = $("#edit-owner-bankAccount").val();
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
                ownerId: selectedOwner,
                ownerBankAccountNumber: selectedOwnerBankAccount,
                document: settlementDocument,
                dateOfIssue: settlementDateOfIssue,
                dateOfPayment: settlementDateOfPayment,
                amount: settlementAmount,
                bankAccountNumber: selectedBankAccount

            }),
            success: function (data) {
                getAllSettlements();
                $('#myModal').modal('hide');
            },
            error: function () {
                alert('Nie udało się uaktualnić rozrachunku!')
            }
        });
    }

    function closeAlert() {
        window.setTimeout(function () {
            $("#settled").fadeOut(300)
        }, 3000);
    }

});