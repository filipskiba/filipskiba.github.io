$(document).ready(function () {
    var contractorsApi = API_ENDPOINT + '/api/contractors';
    var settlementsApi = API_ENDPOINT + '/api/settlements';
    var paymentsApi = API_ENDPOINT + '/api/payments';
    var dispositionsApi = API_ENDPOINT + '/api/dispositions';
    var bankAccountApi = API_ENDPOINT + '/api/bankAccounts';

    getAllContractors();
    getAllSettlements();
    getAllOwners();
    $("#vat_amount_label").hide();
    $("#vat_amount").hide();
    $("#edit-vat-amount").hide();


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
    $('#open-dispositions-modal').click(function (event){
        $("#create-dispositions-modal").modal();
    });
    $('#create-dispositions-button').click(function (event){
        createDispositons(event);
    });


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
    $("#settlement-type").change(function () {
        var selectedId = $(this).children("option:selected").val();

        switch (selectedId) {
            case 'STANDARD_TRANSFER':
                $("#vat_amount").hide();
                $("#vat_amount_label").hide();

                $("#vat_amount").val(0);
                break;
            case 'SPLIT_PAYMENT_TRANSFER':
                $("#vat_amount").show();
                $("#vat_amount_label").show();
                break;
            default:
                console.log(`Sorry, we are out of ${expr}.`);
        }

    });

    function handleDatatableRender(settlementsData) {
        $('#settlements-table-body').empty()
        settlementsData.forEach(function (settlement) {
            var $datatableRowEl = createElement(settlement);
            $datatableRowEl.appendTo($('#settlements-table-body'));

        });

    }
    $("#show_paid").change(function() {
       if(this)
        $("#settlements-table tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    function createElement(data) {

        var dateOfIssue = new Date(data.dateOfIssue);
        var dateOfPayment = new Date(data.dateOfPayment);
        var formatted_dateOfIssue = dateOfIssue.getFullYear() + "-" + appendLeadingZeroes(dateOfIssue.getMonth() + 1) + "-" + appendLeadingZeroes(dateOfIssue.getDate())
        var formatted_dateOfPayment = dateOfPayment.getFullYear() + "-" + appendLeadingZeroes(dateOfPayment.getMonth() + 1) + "-" + appendLeadingZeroes(dateOfPayment.getDate())
        var $tr = $('<tr>').append(
            $('<td align="center">').append(isCheckboxEnable(data.dispositionDtoList.length)),
            $('<td>').text(data.settlementId).hide(),
            $('<td>').text(data.contractorId).hide(),
            $('<td>').text(data.contractorName),
            $('<td>').text(settlementTypeShourtcut(data.settlementTypeName)),
            $('<td align="center">').text(data.document),
            $('<td>').text(formatted_dateOfIssue),
            $('<td>').text(formatted_dateOfPayment),
            $('<td align="center">').text(data.amount),
            $('<td align="center">').text(data.paidAmount),
            $('<td align="center">').append(isDispositionChecked(data.dispositionDtoList.length)),
            $('<td align="center">').append(isChecked(data)),
            $('<td align="center"><button class="btn btn-success" id="edit-settlement-button">edytuj</button>'),
            $('<td align="center"><button class="btn btn-danger" id="delete-settlement-button">usuń</button>')
        );
        return $tr;

    }
    function settlementTypeShourtcut(settlementTypeName){
        if(settlementTypeName=='SPLIT_PAYMENT_TRANSFER')
            return 'Split payment';
        else if(settlementTypeName=='TAX_TRANSFER')
            return 'Podatkowy'
        else
            return 'Standard'
    }

    $('#settlements-table-body').on("click", "#delete-settlement-button", function (event) {
        var curentRow = $(this).closest('tr');
        var id_col = curentRow.find('td:eq(1)').text();
        deleteSettlement(id_col);
    });

    function fillEditForm(data) {
        if(data.settlementTypeName=='SPLIT_PAYMENT_TRANSFER'){
            $("#edit-vat-amount").show();
        }
        else {
            $("#edit-vat-amount").hide();
        }
        $("#edit-id").val(data.settlementId);
        $("#contractor-id").val(data.contractorId);
        $("#edit-owner-id").val(data.ownerId);
        $("#edit-owner-bankAccount").val(data.ownerBankAccountNumber);
        $("#edit-document").val(data.document);
        $("#edit-date-of-issue").val(data.dateOfIssue);
        $("#edit-date-of-payment").val(data.dateOfPayment);
        $("#edit-amount").val(data.amount);
        $("#edit-vat-amount").val(data.vatAmount);
        $("#edit-settlement-type").val(data.settlementTypeName);
        fillEditBankAccountCombobox(data.contractorId);
    }


    $('#settlements-table-body').on("click", "#edit-settlement-button", function (event) {
        event.preventDefault();
        $("#myModal").modal();
        var currentRow = $(this).closest('tr');
        var id = currentRow.find('td:eq(1)').text();
        getSettlementForEdit(id);
    });

    function isCheckboxEnable(data){
        if(hasDisposition(data)){
            return $('<input type="checkbox" disabled>')
                }
                else {
            return $('<input type="checkbox">')
        }

    }
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
    function isDispositionChecked(data){
        if (hasDisposition(data)) {
            return $('<i class="fas fa-check"></i>')
        } else {
            return $('<i class="far fa-times-circle"></i>')
        }
    }

    function hasDisposition(data) {
        if (data>0) {
            return true;
        } else return false;
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
        var selectedSettlementType = $("#settlement-type option:selected").val();
        var vatAmount = $("#vat_amount").val();
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
                bankAccountNumber: selectedBankAccount,
                settlementTypeName: selectedSettlementType,
                vatAmount: vatAmount

            }),
            complete: function (data) {
                if (data.status === 200) {
                    $("#vat_amount").val(0);
                    getAllSettlements();
                } else {
                    alert('Nie udało się dodać rozrachunku!')
                }
            }
        });
    }


    function createDispositons(event) {
        event.preventDefault();
        var idsList=[];
        var dateOfTransfer = $("#date-of-transfer").val();
        var requestUrl = dispositionsApi+"/list";

        var grid = document.getElementById("settlements-table");
        //Reference the CheckBoxes in Table.
        var checkBoxes = grid.getElementsByTagName("INPUT");
        //Loop through the CheckBoxes.
        for (var i = 0; i < checkBoxes.length; i++) {
            if (checkBoxes[i].checked) {
                var row = checkBoxes[i].parentNode.parentNode;

                idsList.push(row.cells[1].innerHTML);
            }

        }

        $.ajax({
            url: requestUrl,
            method: 'POST',
            processData: false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({
                dateOfExecution: dateOfTransfer,
                idsList: idsList
            }),
            complete: function (data) {
                if (data.status === 200) {
                    getAllSettlements();
                    $('#create-dispositions-modal').modal('hide');
                } else {
                    alert('Nie udało się utworzyć paczki dyspozycji!')
                }
            }
        });
        getAllSettlements();


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
        var vatAmount = $("#edit-vat-amount").val();
        var selectedSettlementType = $("#edit-settlement-type").val();

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
                bankAccountNumber: selectedBankAccount,
                vatAmount: vatAmount,
                settlementTypeName: selectedSettlementType,

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