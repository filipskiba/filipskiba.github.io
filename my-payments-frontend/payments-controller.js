$(document).ready(function () {
    var prod = 'https://pacific-castle-21497.herokuapp.com';
    var paymentsApi = prod+'/api/payments';

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
            $('<td>').text(data.dispositionId),
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
            success: handleDatatableRender,
            error: function () {
                alert('Nie udało się pobrać płatności!')
            }
        });
    }

    function deletePayment(paymentId) {
        $.ajax({
            url: paymentsApi + '/' + paymentId,
            method: 'DELETE',
            success: function () {
                $('#rows').empty()
                getAllPayments()
            },
            error: function () {
                alert('Nie udało się usunąć płatności!')
            }
        })
    }

});