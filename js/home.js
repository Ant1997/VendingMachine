$(document).ready(function () {
    var addedMoney = 0;
    loadItems();
    $('#addDollar').on('click', function () {
            addedMoney += 1;
            messageBox("You added $1.00");
            updateMoney(addedMoney);
        });
        $('#addQuarter').on('click', function () {
            addedMoney += .25;
            messageBox("You added $0.25")
            updateMoney(addedMoney);
        });
        $('#addDime').on('click', function () {
            addedMoney += .10;
            messageBox("You added $0.10");
            updateMoney(addedMoney);
        });
        $('#addNickel').on('click', function () {
            addedMoney += .05;
            messageBox("You added a $0.05")
            updateMoney(addedMoney);
        });

});


function updateMoney(money) {
    $('#moneyInput').empty();
    $('#moneyInput').val(money.toFixed(2));
}

function messageBox(messageResponse) {
    $('#messageOutput').empty();
    $('#messageOutput').val(messageResponse);
}

function clearErrorMessage(){
    $('#errorMessages').empty();
    $('#errorMessagesEdit').empty();
    $('#errorMessagesAdd').empty();
}

const formatToCurrency = amount => {
  return "$" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

function loadItems() {
    //clearItemsTable();
    var grid1 = $('#gridContentCol1');
    var grid2 = $('#gridContentCol2');
    var grid3 = $('#gridContentCol3');

    $.ajax({
        type: 'GET',
        url: 'http://tsg-vending.herokuapp.com/items',
        success: function(itemArray) {
            $.each(itemArray, function(index, item){
                var id = item.id;
                var name = item.name;
                var price = item.price;
                var quantity = item.quantity;

                var card = '<div class="card">';
                    card += '<div class="card-body" style="height:283px">';
                    card += '<p style="font-weight:900">' + id + '</p>';
                    card += '<p style="text-align:center; font-weight:900">' + name + '</p>';
                    card += '<br>';
                    card += '<p style="text-align:center; font-weight:600">'+ formatToCurrency(price); + '</p>';
                    card += '<br>';
                    card += '<br>';
                    card += '<br>';
                    card += '<p style="text-align:center; font-weight:500">Quantity Left: ' + quantity + '</p>';
                    card += '</div>';
                    card += '</div>';
                    card += '<br>';

                if(index % 3 == 0){
                    grid1.append(card);
                }
                else if(index % 3 == 1){
                    grid2.append(card);
                }
                else if(index % 3 == 2){
                    grid3.append(card);
                }

            })
        },
        error: function() {
            messageBox("Invalid item selected");
        }
    });
}

function checkAndDisplayValidationErrors(input) {
    clearErrorMessage();

    var errorMessages = [];

    input.each(function() {
        if (!this.validity.valid) {
            var errorField = $('label[for=' + this.id + ']').text();
            errorMessages.push(errorField + ' ' + this.validationMessage);
        }
    });

    if (errorMessages.length > 0){
        $.each(errorMessages,function(index,message) {
            $('#errorMessages').append($('<li>').attr({class: 'list-group-item list-group-item-danger'}).text(message));
            $('#errorMessagesAdd').append($('<li>').attr({class: 'list-group-item list-group-item-danger'}).text(message));
            $('#errorMessagesEdit').append($('<li>').attr({class: 'list-group-item list-group-item-danger'}).text(message));
        });
        // return true, indicating that there were errors
        return true;
    } else {
        // return false, indicating that there were no errors
        return false;
    }
}