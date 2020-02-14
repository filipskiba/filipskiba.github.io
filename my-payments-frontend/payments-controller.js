$(document).ready(function () {
    var paymentsApi = 'https://pacific-castle-21497.herokuapp.com/api/payments';
    getAllPayments();
    function handleDatatableRender(paymentsData) {

        $('#payments-table-body').empty()
        paymentsData.forEach(function (payment) {
            var $datatableRowEl = createElement(payment);
            $datatableRowEl
                .appendTo($('#payments-table-body'));
        });
    }

    function createElement(data) {

        var $tr = $('<tr>').append(
            $('<td>').text(data.paymentId).hide(),
            $('<td>').text(data.contractorName),
            $('<td>').text(data.dateOfTransfer),
            $('<td>').text(data.amount),
            $('<td><button class="btn btn-danger" id="delete-payment-button">usuń</button>')
        );
        return $tr;
    }

    $('#payments-table-body').on("click", "#delete-payment-button", function (event) {
        var curentRow = $(this).closest('tr');
        var id_col = curentRow.find('td:eq(0)').text();
        deletePayment(id_col);
    });

    function getAllPayments() {
        $.ajax({
            url: paymentsApi,
            method: 'GET',
            success: handleDatatableRender
        });
    }

    function deletePayment(paymentId) {
        $.ajax({
            url: paymentsApi + '/' + paymentId,
            method: 'DELETE',
            success: function () {
                $('#rows').empty()
                getAllPayments()
            }
        })
    }

});