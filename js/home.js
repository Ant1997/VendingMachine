$(document).ready(function () {
    addedMoney = 0;
    selectedItemId = null;

    loadItems();
    $('#addDollar').on('click', function () {
            addedMoney += 1.000;
            messageBox("You added $1.00");
            updateMoney(addedMoney);
        });
        $('#addQuarter').on('click', function () {
            addedMoney += 0.250;
            messageBox("You added $0.25")
            updateMoney(addedMoney);
        });
        $('#addDime').on('click', function () {
            addedMoney += 0.100;
            messageBox("You added $0.10");
            updateMoney(addedMoney);
        });
        $('#addNickel').on('click', function () {
            addedMoney += 0.050;
            messageBox("You added a $0.05")
            updateMoney(addedMoney);
        });

    purchaseClicked();

});


function updateMoney(money) {
    money = parseFloat(money);
    $('#moneyInput').empty();
    $('#moneyInput').val(formatToCurrency(money));
    //addedMoney = $('#moneyInput').val();
}

function messageBox(messageResponse) {
    $('#messageOutput').empty();
    $('#messageOutput').val(messageResponse);
}

function changeBox(change) {
    $('#changeOutput').empty();
    $('#changeOutput').val(change);
}

function clearErrorMessage(){
    $('#errorMessages').empty();
    $('#errorMessagesEdit').empty();
    $('#errorMessagesAdd').empty();
}

const formatToCurrency = amount => {
  return "$" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

function clearItemsTable() {
    $('#gridContentCol1').empty();
    $('#gridContentCol2').empty();
    $('#gridContentCol3').empty();
}

function loadItems() {
    clearItemsTable();
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
                var price = parseFloat(item.price);
                var quantity = item.quantity;

                var card = '<div class="card" onclick="setId(' + id + ')">';
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

function setId(id){
    selectedItemId = id;
    //alert(selectedItemId);
    messageBox("Item ID " + selectedItemId + " selected");
    $('#itemChosen').empty();
    $('#itemChosen').val(selectedItemId);
}

function purchaseClicked(){
    $('#purchaseButton').on('click', function () {

        if(selectedItemId == null){
            messageBox("Please make a selection");
        }
        else{

            //alert(amount);
            $.ajax({
                    type: 'POST',
                    url: 'http://tsg-vending.herokuapp.com/money/'+ addedMoney.toFixed(2) +'/item/' + selectedItemId,
                    success: function(item) {

                       var quarters = item['quarters'];
                       var dimes = item['dimes'];
                       var nickels = item['nickels'];
                       var pennies = item['pennies'];
                       var money = parseFloat(0);

                       var changeText = "";

                       if (quarters > 0){
                            changeText += quarters + " Quarter ";
                            money += quarters * 0.25;
                       }
                       if (dimes > 0){
                            changeText += dimes + " Dime ";
                            money += dimes * 0.10;
                       }
                       if (nickels > 0){
                            changeText += nickels + " Nickel ";
                            money += nickels * 0.05;
                       }
                       if (pennies > 0){
                            changeText += pennies + " Penny ";
                            money += pennies * 0.01;
                       }
                       changeBox(changeText);

                       addedMoney = money;
                       money = parseFloat(money);
                       alert(money);
                       updateMoney(money);
                       loadItems();
                       messageBox("Thank you!!");
                       selectedItemId = null;
                       $('#itemChosen').empty();
                       //loadItems();
                       //subtract deposited money

                    },
                    error: function(xhr, status, error) {
                        messageBox(xhr.responseJSON['message']);
                    }
            });
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