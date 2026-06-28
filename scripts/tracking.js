import { orders } from "../data/orders.js";
import { getProduct,loadProductsFetch } from "../data/products.js";

loadProductsFetch().then(()=>{
const url=new URL(window.location.href);

const orderId=url.searchParams.get('orderId');
const productId=url.searchParams.get('productId');

let matchingOrder;
orders.forEach((order)=>{
if(order.id===orderId){
    matchingOrder=order;
}
});



let matchingProduct;

matchingOrder.products.forEach((orderProduct) => {
  if (orderProduct.productId === productId) {
    matchingProduct = orderProduct;
  }
});
const today = new Date();
const deliveryDate = new Date(matchingProduct.estimatedDeliveryTime);

const millisecondsPerDay = 1000 * 60 * 60 * 24;

const daysLeft = Math.ceil(
  (deliveryDate - today) / millisecondsPerDay
);

console.log(daysLeft);

const product=getProduct(productId);
console.log(product);
const progress = getProgress(
  matchingProduct.estimatedDeliveryTime
);

console.log(progress);

let preparingClass = '';
let shippedClass = '';
let deliveredClass = '';

if (daysLeft <= 0) {
  deliveredClass = 'current-status';
} else if (daysLeft <= 1) {
  shippedClass = 'current-status';
} else {
  preparingClass = 'current-status';
}

const trackingHTML=`
<a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date">
          Arriving on ${new Date(matchingProduct.estimatedDeliveryTime)
            .toLocaleDateString('en-US',{
                month:'long',
                day:'numeric'
            })
          }
        </div>

        <div class="product-info">
          ${product.name}
        </div>

        <div class="product-info">
          Quantity: ${matchingProduct.quantity}
        </div>

        <img class="product-image" src="${product.image}">

        <div class="progress-labels-container">
          <div class="progress-label ${preparingClass}">
            Preparing
          </div>
          <div class="progress-label ${shippedClass}">
            Shipped
          </div>
          <div class="progress-label ${deliveredClass}">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar" style="width:${progress}%"></div>
        </div>
`;

document.querySelector('.js-order-tracking').innerHTML=trackingHTML;
});

function getProgress(deliveryTime) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deliveryDate = new Date(deliveryTime);
  deliveryDate.setHours(0, 0, 0, 0);

  const daysLeft = Math.round(
    (deliveryDate - today) / millisecondsPerDay
  );

  if (daysLeft >= 5) {
    return 20;
  } else if (daysLeft === 4) {
    return 35;
  } else if (daysLeft === 3) {
    return 50;
  } else if (daysLeft === 2) {
    return 65;
  } else if (daysLeft === 1) {
    return 85;
  } else {
    return 100;
  }
}
