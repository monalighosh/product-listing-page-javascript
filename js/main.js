var cart = {
	"items":[],
	"subtotal": 0,
	"get15Dis": 0,
	"get10Dis": 0,
	"get5Dis": 0,
	"finalDis": 0,
	"ordertotal": 0
};

// HIDE SHOPPING CART // 

var shoppingSec = document.getElementById("shopping");
// Sets the display of the shopping section to none
shoppingSec.style.display = "none";
var buttShopCart = document.getElementById("viewShoppingCart");
buttShopCart.addEventListener("click", toggleButtShow);
// Sets the display of the toggle button to none
buttShopCart.style.display = "none";
// Toggle function
function toggleButtShow(){
	// Checks if the button's value is "View Shopping Cart", if yes, removes shopping cart's style attribute and changes the butt text to "Hide Shopping Cart"
	if(this.value === "View Shopping Cart"){
		shoppingSec.removeAttribute("style");
		this.value = "Hide Shopping Cart";
	  // Checks sets shopping cart's style attribute to display: none aand changes the butt text to "View Shopping Cart"
	} else{
		this.value = "View Shopping Cart";
		shoppingSec.style.display = "none";
	}
}


// ADD PRODUCTS // 

// Array to store all the "add to cart" buttons
var buttAddCart = document.querySelectorAll("input[id=addToCart]");
    for(var i = 0; i < buttAddCart.length; i++){
    	// Sets an event listener for each of these buttons
	    buttAddCart[i].addEventListener("click", addProToCart);
}

// Function to add products to a shopping cart
function addProToCart(){
	var product = this.parentNode;
	var productId = product.id;
	
	for(var j = 0; j < product.childNodes.length; j++){
		if(product.childNodes[j].id === "img-grow"){
			var productImage = product.childNodes[j].innerHTML;
		} else if(product.childNodes[j].id === "title"){
			var productTitle = product.childNodes[j].innerHTML;
		} else if(product.childNodes[j].id === "price"){
			var productPrice = Number(product.childNodes[j].innerHTML);
		}
	}

	// HTML shopping cart model
	var tableShopTbody = document.getElementById("shopCartTbody");
	// Adds a new row
    var newRow = document.createElement("tr");
    newRow.setAttribute("id", productId);
	tableShopTbody.appendChild(newRow);	
	// Adds six colums to a newly created row
	for(var k = 0; k < 7; k++){
		var newCol = document.createElement("td");
		newRow.appendChild(newCol);
	}

	// Sets the html content of the newly created columns
	newRow.childNodes[0].innerHTML = productImage;
	newRow.childNodes[1].innerHTML = productTitle;
	newRow.childNodes[2].innerHTML = "<input name='qty' id='qty' type='text' maxlength='3' size='3' placeholder='1' value='1'>";
	newRow.childNodes[2].setAttribute("id", "qty");
	newRow.childNodes[3].innerHTML = productPrice;
	newRow.childNodes[3].setAttribute("id", "productPrice");
	newRow.childNodes[4].innerHTML = productPrice;
	newRow.childNodes[4].setAttribute("id", "totalProductPrice");
	newRow.childNodes[5].innerHTML = "<input type='button' value='Update' id='update' onclick='updateProQty(this)'>";
	newRow.childNodes[6].innerHTML = "<i class='fa fa-times icon' id='deleteButt' onclick='deletePro(this)'></i>";

    // Pushes the product details to an object
	cart.items.push({
		"product": productId,
		"productImage": productImage,
		"productTitle": productTitle,
		"productPrice": productPrice,
		"productPrice": productPrice,
		"productUpdatedPrice": productPrice,
	});

	subtotal();
	ordertotal();

// Hides the shopping cart until at least one product has been added
var tbody = document.getElementById("shopCartTbody");
if(tbody.childNodes.length > 0){
	toggleButtShow();
	buttShopCart.style.display = "";
	shoppingSec.style.display = "";
}

}


// REMOVE PRODUCTS FROM THE SHOPPING CART //

function deletePro(ele){
	var parentRow = ele.parentNode.parentNode;
	var parentRowId = parentRow.id; 
	var parentTbody = parentRow.parentNode;
    parentTbody.removeChild(parentRow);
	
	for(var i = 0; i < cart.items.length; i++){
		if(cart.items[i].product === parentRowId){
			cart.items.splice(i, 1);
		}
	}
   
   // Removes the discount row from the order panel if any
   var subtotalRow = document.getElementById("subtotal");
	var subtotalRowParent = subtotalRow.parentNode;
	for(var j = 0; j < subtotalRowParent.childNodes.length; j++){
		if(subtotalRowParent.childNodes[j].id === "discountRow"){
		var disRow = document.getElementById("discountRow");
       subtotalRowParent.removeChild(disRow);
	}

	}
	// Sets the final discount amount back to 0
	cart.finalDis = 0;
	subtotal();
	ordertotal();

}



// UPDATE PRODUCT QUANTITY //

function updateProQty(ele){
	var parentRow1 = ele.parentNode.parentNode;
	var parentRowId = parentRow1.id;
	// Loops through all the other columns of the same product
	for(var i = 0; i < parentRow1.childNodes.length; i++){
		if(parentRow1.childNodes[i].id === "qty"){
			var inputQty = parentRow1.childNodes[i].firstChild;
		} else if(parentRow1.childNodes[i].id === "productPrice"){
			var productPrice = Number(parentRow1.childNodes[i].innerHTML);
		} else if(parentRow1.childNodes[i].id === "totalProductPrice"){
			var updatedPrice = parentRow1.childNodes[i];
			var totalPrice = Number(parentRow1.childNodes[i].innerHTML);
		}
	}
	// Gets the quanity input value
	var inputQtyVal = Math.floor(inputQty.value);
	// Throws an error if value is not a number
	if(isNaN(inputQtyVal)){
    	alert("Quantity must consists only of numbers (0-9).");
      // Removes the product if a value is 0	
    } else if(inputQtyVal === 0){
        deletePro(ele);
	} 

    // Sets the new total price
	totalPrice = inputQty.value * productPrice;
	updatedPrice.innerHTML = totalPrice;
	
	for(var j =0; j < cart.items.length; j++){
		if(cart.items[j].product === parentRowId){
			cart.items[j].productUpdatedPrice = totalPrice;
		}
	}

	subtotal();
	ordertotal();
}

// APPLY COUPON //

function applyCoupon(ele){
	var inputCoupon = document.getElementById("coupon");
	// Checks if an input value is GET15, if yes,
	if(inputCoupon.value === "GET15"){
		for(var i = 0; i < cart.items.length; i++){
	        var price = 0;
	        // Checks if the product in the cart has an id that includes VMIW characters, if yes,
	        if(cart.items[i].product.includes("VMIW")){
	        	// 15% discount is applied to that product
		        price += cart.items[i].productPrice;
		        var pro15Dis = (price * 15) / 100;
		        // Updates the discount amount
		        cart.get15Dis = pro15Dis;
		        cart.finalDis = cart.get15Dis.toFixed(2);
		        addDiscountAmt();
		        // Disables the Apply Code buttton
		        ele.disabled = true;
	        } 
        }	
    }
    // Checks if an input value is GET10, if yes,
    else if(inputCoupon.value === "GET10"){
    	// Stores the first prodcut in a cart
    	var firstPro = cart.items[0];
    	// 10% discount is applied to that product
    	var firstProDis = (firstPro.productPrice * 10) / 100;
    	// Updates the discount amount
    	cart.get10Dis = firstProDis;	
    	cart.finalDis = cart.get10Dis.toFixed(2);
    	addDiscountAmt();
    	// Disables the Apply Code buttton
    	ele.disabled = true;
    }
    // Checks if an input value is GET5, if yes,
    else if(inputCoupon.value === "GET5"){
    	// 5% discount is applied to the subtotal
    	var subtotalDis = (cart.subtotal * 5) / 100;
    	// Updates the discount amount
    	cart.get5Dis = subtotalDis;	
    	cart.finalDis = cart.get5Dis.toFixed(2);
    	addDiscountAmt();
    	// Disables the Apply Code buttton
    	ele.disabled = true;
    }
    // Throws an arror if an input value is blank
    else if(inputCoupon.value === ""){
        alert("Please enter a coupon code!");
    } 
    else {
	alert("Invalid discount code!");
    }
    
    // Function to create row that displays a discount amount in an html page
    function addDiscountAmt(){
    var orderTotalRow = document.getElementById("orderTotal");
    var orderTotalRowParent = orderTotalRow.parentNode; 
    var newRow = document.createElement("tr");
	orderTotalRowParent.insertBefore(newRow, orderTotalRow); 
	newRow.setAttribute("id", "discountRow");
	for(var j = 0; j < 2; j++){ 
		var newTd = document.createElement("td"); 
		newRow.appendChild(newTd);
	}
	newRow.childNodes[0].innerHTML = "Discount";
	newRow.childNodes[1].innerHTML = cart.finalDis;
	newRow.childNodes[1].setAttribute("id", "discountAmt");
	}
	
	subtotal();
	ordertotal();
}


// SUBTOTAL //

function subtotal(){
	var subTotal = document.getElementById("subtotalAmt");
	cart.subtotal = 0;
	for(var i = 0; i < cart.items.length; i++){
		cart.subtotal += cart.items[i].productUpdatedPrice;
	}
	subTotal.innerHTML = cart.subtotal.toFixed(2);
}


// ORDERTOTAL //

function ordertotal(){
	var orderTotal = document.getElementById("orderTotalAmt");
	cart.ordertotal = 0;
	cart.ordertotal += (cart.subtotal - cart.finalDis);
	orderTotal.innerHTML = cart.ordertotal.toFixed(2);
}