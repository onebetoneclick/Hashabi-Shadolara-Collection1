let productTotal = 0;
let cartContent = "";

/* PAYSTACK KEY */

const PAYSTACK_PUBLIC_KEY =
"pk_test_3c6749696834a73e309d35b2fe573f450cbe7bdf";

/* DELIVERY FEES */

const deliveryFees = {
    Ogun: 1000,
    Lagos: 1500,
    Oyo: 2000
};

/* STATES & LGAs */

const stateData = {

    Ogun: [
        "Ijebu Ode",
        "Abeokuta North",
        "Abeokuta South",
        "Ifo",
        "Ado-Odo/Ota"
    ],

    Lagos: [
        "Ikeja",
        "Eti-Osa",
        "Surulere",
        "Kosofe",
        "Alimosho"
    ],

    Oyo: [
        "Ibadan North",
        "Ibadan South West",
        "Ogbomoso North",
        "Oyo East",
        "Iseyin"
    ]

};

/* LOAD STATES */

window.onload = function(){

    const state =
    document.getElementById("state");

    for(let item in stateData){

        state.innerHTML +=
        `<option value="${item}">
        ${item}
        </option>`;
    }

};

/* STATE CHANGE */

document.addEventListener(
"change",
function(e){

if(e.target.id === "state"){

const selected =
e.target.value;

const lga =
document.getElementById("lga");

lga.innerHTML =
'<option value="">Select LGA</option>';

if(stateData[selected]){

stateData[selected]
.forEach(item=>{

lga.innerHTML +=
`<option value="${item}">
${item}
</option>`;

});

}

updateTotals();

}

});

/* OPEN POPUP */

function openCheckout(){

document.getElementById(
"checkoutModal"
).style.display = "flex";

}

/* CLOSE POPUP */

function closeCheckout(){

document.getElementById(
"checkoutModal"
).style.display = "none";

}

/* ADD TO CART */

function addToCart(
name,
price,
image,
qtyId
){

let qty =
parseInt(
document.getElementById(qtyId).value
);

if(!qty || qty < 1){

qty = 1;

}

let total =
qty * price;

productTotal += total;

document.getElementById(
"cartItems"
).innerHTML +=

`
<div class="cart-item">

<img src="${image}">

<div>

<b>${name}</b><br>

Quantity:
${qty}<br>

₦${total.toLocaleString()}

</div>

</div>
`;

cartContent +=

`${name}
Quantity: ${qty}
Price: ₦${total.toLocaleString()}

`;

updateTotals();

}

/* TOTALS */

function updateTotals(){

let state =
document.getElementById(
"state"
).value;

let delivery =
deliveryFees[state] || 0;

document.getElementById(
"productTotal"
).innerText =
productTotal.toLocaleString();

document.getElementById(
"deliveryFee"
).innerText =
delivery.toLocaleString();

document.getElementById(
"grandTotal"
).innerText =
(productTotal + delivery)
.toLocaleString();

}

/* PAY NOW */

function payNow(){

let fullname =
document.getElementById(
"fullname"
).value;

let phone =
document.getElementById(
"phone"
).value;

let email =
document.getElementById(
"email"
).value;

if(
!fullname ||
!phone ||
!email
){

alert(
"Please fill all details."
);

return;

}

let state =
document.getElementById(
"state"
).value;

let delivery =
deliveryFees[state] || 0;

let grandTotal =
productTotal + delivery;

if(grandTotal <= 0){

alert(
"Add products first."
);

return;

}

let handler =
PaystackPop.setup({

key:
PAYSTACK_PUBLIC_KEY,

email:
email,

amount:
grandTotal * 100,

currency:
"NGN",

callback: function(response){

alert("Payment Successful!");

generateReceipt();

/* wait 2 seconds then open WhatsApp */

setTimeout(function(){

sendWhatsApp();

}, 2000);

},

onClose:
function(){

alert(
"Payment Cancelled"
);

}

});

handler.openIframe();

}

/* RECEIPT */

function generateReceipt(){

let delivery =
deliveryFees[
document.getElementById(
"state"
).value
] || 0;

let grand =
productTotal + delivery;

let receipt =

`HASHABI SHADOLAR STORE

CUSTOMER DETAILS

Name:
${document.getElementById("fullname").value}

Phone:
${document.getElementById("phone").value}

Email:
${document.getElementById("email").value}

State:
${document.getElementById("state").value}

LGA:
${document.getElementById("lga").value}

Address:
${document.getElementById("address").value}

--------------------

ORDER ITEMS

${cartContent}

--------------------

Products:
₦${productTotal.toLocaleString()}

Delivery:
₦${delivery.toLocaleString()}

Grand Total:
₦${grand.toLocaleString()}

`;

let receiptWindow =
window.open(
"",
"_blank"
);

receiptWindow.document.write(

`<html>

<head>

<title>Receipt</title>

<style>

body{
font-family:Arial;
padding:20px;
}

pre{
white-space:pre-wrap;
font-size:16px;
}

</style>

</head>

<body>

<h2>
HASHABI SHADOLAR STORE
</h2>

<pre>
${receipt}
</pre>

</body>

</html>`

);

receiptWindow.document.close();

}

/* WHATSAPP */

function sendWhatsApp(){

const message =

`NEW ORDER

Name: ${document.getElementById("fullname").value}

Phone: ${document.getElementById("phone").value}

Email: ${document.getElementById("email").value}

State: ${document.getElementById("state").value}

LGA: ${document.getElementById("lga").value}

Address: ${document.getElementById("address").value}

${cartContent}

Products Total: ₦${productTotal.toLocaleString()}
`;

const whatsappURL =
`https://wa.me/2348115654773?text=${encodeURIComponent(message)}`;

window.location.href = whatsappURL;

}