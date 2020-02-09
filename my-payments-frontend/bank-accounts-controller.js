$(document).ready(function () {
    var contractorsApi = 'https://pacific-castle-21497.herokuapp.com/api/contractors';
    var contractorStatusApi = 'https://pacific-castle-21497.herokuapp.com/api/contractors/status';
    var bankAccountApi = 'https://pacific-castle-21497.herokuapp.com/api/bankAccounts';
    getAllContractors();

//*************************************BUTTONS*********************************************************************
    $('[data-bank-accounts-add-form]').on('submit', addBankAccount);
    $('#edit_bank_account').on("click", updateBankAccount);

//*************************************BUTTONS*********************************************************************


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

        getBankAccountsByContractorId(selectedId);
    });

    //*************************************TABLE***********************************************************************
    function handleDatatableRender(bankAccountData) {
        $('#bank-accounts-table-body').empty()
        bankAccountData.forEach(function (bankAccount) {
            var $datatableRowEl = createElement(bankAccount);
            $datatableRowEl
                .appendTo($('#bank-accounts-table-body'));
        });
    }

    function createElement(data) {

        var $tr = $('<tr>').append(
            $('<td>').text(data.bankAccountId).hide(),
            $('<td>').text(data.contractorId).hide(),
            $('<td>').text(data.bankAccountNumber),
            $('<td><button class="btn btn-success" id="edit-bank-account-button">edit</button>'),
            $('<td><button class="btn btn-danger" id="delete-bank-account-button">delete</button>')
        );
        return $tr;
    }

    $('#bank-accounts-table-body').on("click", "#delete-bank-account-button", function (event) {
        var curentRow = $(this).closest('tr');
        var id_col = curentRow.find('td:eq(0)').text();
        console.log(id_col);
        deleteBankAccount(id_col);
    });

    $('#bank-accounts-table-body').on("click", "#edit-bank-account-button", function (event) {
        event.preventDefault();
        $("#myModal").modal();

        var curentRow = $(this).closest('tr');
        var bankAccountId = curentRow.find('td:eq(0)').text();
        var bankAccountNumber = curentRow.find('td:eq(2)').text();

        $("#edit_id").val(bankAccountId);
        $("#edit_bank_account_number").val(bankAccountNumber);
    });
    //*************************************TABLE***********************************************************************

//************************************************CRUD**************************************************************
    function getBankAccountsByContractorId(contractorId) {
        $.ajax({
            url: bankAccountApi + "/" + contractorId,
            method: 'GET',
            success: handleDatatableRender

        });
    }

    function getAllContractors() {
        $.ajax({
            url: contractorsApi,
            method: 'GET',
            success: fillContractorsCombobox
        });
    }
    function getContractorStatus(contractorId) {
        $.ajax({
            url: contractorStatusApi+"/"+contractorId,
            method: 'GET',
            success: function (response) {
                if(response==1){
                    $("#snoAlertBoxTrue").fadeIn();
                    closeAlertTrue();
                }
                else{
                    $("#snoAlertBoxFalse").fadeIn();
                    closeAlertFalse();
                }
            },
            error: function(){
                $("#snoAlertBoxError").fadeIn();
                closeAlertError();
            }
        });
    }
    function closeAlertTrue(){
        window.setTimeout(function () {
            $("#snoAlertBoxTrue").fadeOut(300)
        }, 3000);
    }
    function closeAlertFalse(){
        window.setTimeout(function () {
            $("#snoAlertBoxFalse").fadeOut(300)
        }, 3000);
    }
    function closeAlertError(){
        window.setTimeout(function () {
            $("#snoAlertBoxError").fadeOut(300)
        }, 3000);
    }

    function deleteBankAccount(bankAccountId) {
        var selectedId = $("#contractors-combobox option:selected").val();
        $.ajax({
            url: bankAccountApi + '/' + bankAccountId,
            method: 'DELETE',
            success: function () {
                $('#rows').empty()
                getBankAccountsByContractorId(selectedId)
                // parentEl.slideUp(400, function() { parentEl.remove(); });
            }
        })
    }

    function addBankAccount(event) {
        event.preventDefault();
        var bankAccountNumber = $(this).find('[name="bankAccountNumber"]').val();
        var selectedId = $("#contractors-combobox option:selected").val();
        var requestUrl = bankAccountApi;
        $.ajax({
            url: requestUrl,
            method: 'POST',
            processData: false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({
                contractorId: selectedId,
                bankAccountNumber: bankAccountNumber
            }),
            complete: function (data) {
                if (data.status === 200) {
                    getBankAccountsByContractorId(selectedId);
                    getContractorStatus(selectedId)
                }
            }
        });
    }

    function updateBankAccount() {

        var bankAccountId = $("#edit_id").val();
        var bankAccountNumber = $("#edit_bank_account_number").val();
        var selectedId = $("#contractors-combobox option:selected").val();
        var requestUrl = bankAccountApi;

        $.ajax({
            url: requestUrl,
            method: "PUT",
            processData: false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({
                bankAccountId: bankAccountId,
                contractorId: selectedId,
                bankAccountNumber: bankAccountNumber

            }),
            success: function (data) {
                getBankAccountsByContractorId(selectedId)
                $('#myModal').modal('hide');
            }
        });
    }

//************************************************CRUD**************************************************************
});