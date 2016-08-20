var cart = {
	"items":[],
	"subtotal": 0,
	"discount15": 0,
	"discount10": 0,
	"discount5": 0,
	"discountAmt": 0,
	"ordertotal": 0
};

/*=======================================================*/
 //Hide shopping cart
/*=======================================================*/

//Variable to store a button element to toggle the shopping cart
//var shoppingSec = document.getElementById("shopping");
//shoppingSec.style.display = "none";

/*=======================================================*/
 //Toggle shopping cart
/*=======================================================*/

// Variable to store a button element to toggle the shopping cart
var buttShopCart = document.getElementById("viewShoppingCart");
buttShopCart.addEventListener("click", toggleButtShow);
// Function to toggle the shopping cart button
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


/*=======================================================*/
 //Add product
/*=======================================================*/

// Variable to store all the add to cart buttons
var buttAddCart = document.querySelectorAll("input[id=addToCart]");
// Loops through the button list and adds the event handler to each element
    for(var i = 0; i < buttAddCart.length; i++){
	    buttAddCart[i].addEventListener("click", addProToCart);
}


// Function to add products to the shopping cart
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


	//Shopping cart model
	var tableShopTbody = document.getElementById("shopCartTbody");
    var newRow = document.createElement("tr");
    newRow.setAttribute("id", productId);
	tableShopTbody.appendChild(newRow);	
	for(var k = 0; k < 7; k++){
		var newCol = document.createElement("td");
		newRow.appendChild(newCol);
	}





	newRow.childNodes[0].innerHTML = productImage;
	newRow.childNodes[1].innerHTML = productTitle;
	newRow.childNodes[2].innerHTML = "<input name='qty' id='qty' type='text' maxlength='3' size='3' placeholder='1' value='1'>";
	newRow.childNodes[2].setAttribute("id", "qty");
	newRow.childNodes[3].innerHTML = productPrice;
	newRow.childNodes[3].setAttribute("id", "productPrice");
	newRow.childNodes[4].innerHTML = productPrice;
	newRow.childNodes[4].setAttribute("id", "totalProductPrice");
	newRow.childNodes[5].innerHTML = "<input type='button' value='Update' id='update' onclick='updateProductQty()'>";
	newRow.childNodes[6].innerHTML = "<a href='#''><i class='fa fa-times icon' id='deleteButt' onclick='deleteProduct()'></i></a>";

	


	cart.items.push({
		"product": productId,
		"productImage": productImage,
		"productTitle": productTitle,
		"productPrice": productPrice,
	});
	
	var prices = 0;
	for(var m = 0; m < cart.items.length; m++){
	  for(var n in cart.items[m]){
	  	if(n === "productPrice"){
	  		prices += cart.items[m][n];
	  	 }
	  }
    }
    var subTotal = document.getElementById("subtotalAmt");
    subTotal.innerHTML = prices.toFixed(2);
    cart.subtotal = prices;

    var orderTotalAmt = document.getElementById("orderTotalAmt");

    cart.ordertotal = cart.discountAmt + cart.subtotal;
    orderTotalAmt.innerHTML = cart.ordertotal.toFixed(2);
}

/*=======================================================*/
 //Coupon codes
/*=======================================================*/
var buttApplyCode = document.getElementById("applyCode"); 
buttApplyCode.addEventListener("click", applyCoupon); 


// Function to apply coupon code
function applyCoupon(){
for(var i = 0; i < cart.items.length; i++){
	var price = 0;
	if(cart.items[i].product.includes("VMIW")){
		price += cart.items[i].productPrice;
		var specificProDiscount = (price * 15) / 100;
		cart.discount15 = specificProDiscount.toFixed(2);
	}
} 
	var firstProduct = cart.items[0];
	var firstProductDiscount = (firstProduct.productPrice * 10) / 100;
	cart.discount10 = firstProductDiscount.toFixed(2);	
	var subtotalDiscount = (cart.subtotal * 5) / 100;
	cart.discount5 = subtotalDiscount.toFixed(2);	
	cart.discountAmt = Math.max(cart.discount15, cart.discount5, cart.discount10);
cart.ordertotal = cart.discountAmt + cart.subtotal;
    orderTotalAmt.innerHTML = cart.ordertotal.toFixed(2);
	addDiscountAmt();
	this.disabled = true;



    

function addDiscountAmt(){
    var orderTotalRow = document.getElementById("orderTotal");
    var orderTotalRowParent = orderTotalRow.parentNode; 
    var newRow = document.createElement("tr");
	orderTotalRowParent.insertBefore(newRow, orderTotalRow); 
	for(var j = 0; j < 2; j++){ 
		var newTd = document.createElement("td"); 
		newRow.appendChild(newTd);
	}
	newRow.childNodes[0].innerHTML = "Discount";
	newRow.childNodes[1].innerHTML = cart.discountAmt;
	newRow.childNodes[1].setAttribute("id", "discountAmt");
	}

	
	
}



/*=======================================================*/
 //Update Product quantity
/*=======================================================*/
function updateProductQty(){
	var updateButt = document.getElementById("update");
	var updateButtParentRow = updateButt.parentNode.parentNode;
	for(var i = 0; i < updateButtParentRow.childNodes.length; i++){
		if(updateButtParentRow.childNodes[i].id === "qty"){
			var inputQty = updateButtParentRow.childNodes[i].firstChild;
		} else if(updateButtParentRow.childNodes[i].id === "productPrice"){
			var productPrice = Number(updateButtParentRow.childNodes[i].innerHTML);
		} else if(updateButtParentRow.childNodes[i].id === "totalProductPrice"){
			var totalPrice = Number(updateButtParentRow.childNodes[i].innerHTML);
		}
	}
    var inputQtyVal = Math.floor(inputQty.value);
    if(isNaN(inputQtyVal)){
    	alert("Quantity must consists only of numbers (0-9).");
    } else if(inputQtyVal === 0){
        var parentRow = inputQty.parentNode.parentNode;
        var parentTable = parentRow.parentNode;
        parentTable.removeChild(parentRow);
	} 

	
	totalPrice = inputQty.value * productPrice;
	console.log(inputQty.value, productPrice, totalPrice);
	
    }

/*=======================================================*/
 //Delete product
/*=======================================================*/

// Function to delete the product from the shopping cart
function deleteProduct(){
	var deleteButt = document.getElementById("deleteButt");
	var parentRow = deleteButt.parentNode.parentNode.parentNode;
	var parentRowId = parentRow.id;
	for(var i = 0; i < cart.items.length; i++){
		if(cart.items[i].product === parentRowId){
			var x = cart.subtotal - cart.items[i].productPrice;
			console.log(x);
			delete cart.items[i];
			cart.subtotal = x;
			var subTotal = document.getElementById("subtotalAmt");
			subTotal.innerHTML = cart.subtotal.toFixed(2);
			var orderTotalAmt = document.getElementById("orderTotalAmt");

    cart.ordertotal = cart.discountAmt + cart.subtotal;
    orderTotalAmt.innerHTML = cart.ordertotal.toFixed(2);

		}
	}
	console.log(cart.items);
    var parentTbody = parentRow.parentNode;
    parentTbody.removeChild(parentRow);
}




