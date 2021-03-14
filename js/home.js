$(document).ready(function () {
    addedMoney = 0;
    newMoney = 0;
    updateMoney(addedMoney);
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
    changeReturnClicked();
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
    changeBox("");
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
                            changeText += quarters + " Quarters";
                            money += quarters * 0.25;
                            if(dimes > 0 || nickels > 0 || pennies > 0){
                                changeText += ", ";
                            }
                       }
                       if (dimes > 0){
                            changeText += dimes + " Dimes ";
                            money += dimes * 0.10;
                            if(nickels > 0 || pennies > 0){
                                changeText += ", ";
                            }
                       }
                       if (nickels > 0){
                            changeText += nickels + " Nickels ";
                            money += nickels * 0.05;
                            if(pennies > 0){
                                changeText += ", ";
                            }
                       }
                       if (pennies > 0){
                            changeText += pennies + " Pennies ";
                            money += pennies * 0.01;
                       }
                       changeBox(changeText);

                       newMoney = money;
                       money = parseFloat(money);

                       //updateMoney(money);
                       loadItems();
                       messageBox("Thank you!!");
                       selectedItemId = null;
                       $('#itemChosen').empty();


                    },
                    error: function(xhr, status, error) {
                        messageBox(xhr.responseJSON['message']);
                    }
            });
        }
    });
}


function changeReturnClicked(){
    $('#changeReturnButton').on('click', function () {
        updateMoney(newMoney);
        addedMoney = newMoney;
    });
}
