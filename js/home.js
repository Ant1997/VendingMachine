//Anthony-Tien Nhat Huynh

/**
* Function that run everything when html document is ready
*/
$(document).ready(function () {
    addedMoney = 0;
    newMoney = 0;

    quarters = 0;
    dimes = 0;
    nickels = 0;
    pennies = 0;
    changeText = "";

    updateMoney(addedMoney);
    selectedItemId = null;

    loadItems();
        $('#addDollar').on('click', function () {
            addedMoney += 1.000;
            messageBox("You added $1.00");
            updateMoney(addedMoney);
            ('#changeOutput').val("");
        });
        $('#addQuarter').on('click', function () {
            addedMoney += 0.250;
            messageBox("You added $0.25")
            updateMoney(addedMoney);
            ('#changeOutput').val("");
        });
        $('#addDime').on('click', function () {
            addedMoney += 0.100;
            messageBox("You added $0.10");
            updateMoney(addedMoney);
            ('#changeOutput').val("");
        });
        $('#addNickel').on('click', function () {
            addedMoney += 0.050;
            messageBox("You added $0.05")
            updateMoney(addedMoney);
            ('#changeOutput').val("");
        });

    purchaseClicked();
    changeReturnClicked();


});

/**
* Function that is used for messageBox effect. Change the color of the messageBox's background to blue
like the buttons for a split second then goes back to white.
*/
var flash = function(elements) {
var opacity = 100;
var color = "23, 162, 184" // has to be in this format since we use rgba
var interval = setInterval(function() {
    opacity -= 3;
    if (opacity <= 0) clearInterval(interval);
    $(elements).css({background: "rgba("+color+", "+opacity/100+")"});
  }, 1)
};

/**
* Function that update the moneyInput element.
* @param    {decimal} money    The value of money
*/
function updateMoney(money) {
    money = parseFloat(money);
    $('#moneyInput').empty();
    $('#moneyInput').val(formatToCurrency(money));
    //addedMoney = $('#moneyInput').val();
}

/**
* Function that update the messageOutput.
* @param    {String} messageResponse    The message that is to be displayed
*/
function messageBox(messageResponse) {
    $('#messageOutput').empty();
    $('#messageOutput').val(messageResponse);

    //$('#messageOutput').fadeOut(5).fadeIn(5).fadeOut(5).fadeIn(5);

    //calls flash function to have an effect.
    flash($('#messageOutput'))
}

/**
* Function that update the changeOutput's text.
* @param    {String} change    The value of money in Quarters, Dimes, Nickels, and Pennies
*/
function changeBox(change) {
    $('#changeOutput').empty();
    $('#changeOutput').val(change);
}


/**
* Function that clears all of the output elements that is on the right.
*/
function clearOutput(){
    //$('#changeOutput').val("");
    $('#messageOutput').val("");
    $('#itemChosen').val("");
}

/**
* Function that display decimals to fixed decimal point like money. Also prepend $ to indicate it is USD.
* @param    {Decimal} amount    The decimal that needs to be converted to currency
*/
const formatToCurrency = amount => {
  return "$" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};


/**
* Function that wipe the left side of the html document clean and prepares the grid for updated cards.
*/
function clearItemsTable() {
    $('#gridContentCol1').empty();
    $('#gridContentCol2').empty();
    $('#gridContentCol3').empty();
}

/**
* Function uses the GET API to retrieve all items. It then displays it in a grid and in cards.
Each cards has a click-on function which updates the output text boxes.
*/
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

/**
* Function that is solely used when a card/item is clicked. It updates the output boxes.
* @param    {int} id Takes in the item's id and displays it in itemChosen and messageBox/messageOutput element.
*/
function setId(id){
    selectedItemId = id;
    //alert(selectedItemId);
    messageBox("Item ID " + selectedItemId + " selected");
    $('#itemChosen').empty();
    $('#itemChosen').val(selectedItemId);
    changeBox("");
}

/**
* Function that allows user to POST and purchase items.
It displays in the output boxes accordingly and provide error messages if necessary.
*/
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

                       quarters = item['quarters'];
                       dimes = item['dimes'];
                       nickels = item['nickels'];
                       pennies = item['pennies'];
                       var money = parseFloat(0);

                       changeText = "";

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
                       //changeBox(changeText);

                       newMoney = money;
                       money = parseFloat(money);
                       addedMoney = money;

                       updateMoney(money);
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

const generateCoinChange = cents => {
    money = addedMoney;
    money = money * 100;
    quarters = Math.floor(money/25);
    money -= 25*quarters
    dimes = Math.floor(money/10);
    money -= 10*dimes
    nickels = Math.floor(money/5);
    money -= 5*nickels
    pennies = Math.floor(money/1);
};

/**
* Function that update the Total $ In box and clears output.
*/
function changeReturnClicked(){
    $('#changeReturnButton').on('click', function () {
        //updateMoney(newMoney);
        //addedMoney = newMoney;
       generateCoinChange();
       changeText = '';
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
        addedMoney = 0.00;
        updateMoney(addedMoney);
        clearOutput();
    });
}
