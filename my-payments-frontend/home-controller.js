$(document).ready(function () {
    var apiRoot = 'https://pacific-castle-21497.herokuapp.com/api/rates';
    getRates();

    function getRates() {
        $.ajax({
            url: apiRoot,
            method: 'GET',
            success: handleDatatableRender

        });
    }

    function handleDatatableRender(readerData) {
        $('#title-table-body').empty()
        readerData.forEach(function (reader) {
            var $datatableRowEl = createElement(reader);
            $datatableRowEl
                .appendTo($('#rates-table-body'));
        });
    }
    function createElement(data) {
        var $tr = $('<tr>').append(
            $('<td>').text(data.currency),
            $('<td>').text(data.code),
            $('<td>').text(data.mid)

        );
        return $tr;
    }


});