import {cart, removeFromCart,updateDeliveryOption,updateCartQuantity} from "../../data/cart.js";
import {products} from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions,getDeliveryOption } from "../../data/delivery.js";
import { renderPaymentSummary } from "./paymentSummary.js";


export function renderOrderSummary()
{
let cartSummarHTML = '';
console.log(cart);
cart.forEach((cartItem)=>{
    const productId=cartItem.productId;
    let matchingProduct;

    products.forEach((product)=>{
    if(product.id===productId){
        matchingProduct=product;
    }
    });



const deliveryOptionId = cartItem.deliveryOptionId || '1';

let deliveryOption=getDeliveryOption(deliveryOptionId);
const today=dayjs();
const deliveryDate=today.add(deliveryOption.deliveryDays,'days');
const dateString=deliveryDate.format('dddd,MMMM D');



    cartSummarHTML += `
<div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
  <div class="delivery-date">
    Delivery date: ${dateString}
  </div>

  <div class="cart-item-details-grid">
    <img class="product-image"
      src="${matchingProduct.image}">

    <div class="cart-item-details">
      <div class="product-name">
        ${matchingProduct.name}
      </div>
      <div class="product-price">
        ${matchingProduct.getPrice()}
      </div>
      <div class="product-quantity js-product-quantity-${matchingProduct.id}">
        <span>
          Quantity: <span class="quantity-label">${cartItem.quantity}</span>
        </span>
        <span class="update-quantity-link link-primary js-update-link"
        data-product-id="${matchingProduct.id}">
          Update
        </span>
      
        <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}"
          data-product-id="${matchingProduct.id}">
          Delete
        </span>

        <div class="quantity-updated-message js-updated-message-${matchingProduct.id}">
            ✔Updated
        </div>
      </div>
    </div>

    <div class="delivery-options">
      <div class="delivery-options-title">
        Choose a delivery option:
      </div>
      ${deliveryOptionsHTML(matchingProduct,cartItem)}
    </div>

  </div>
</div>
`;
  });


    document.querySelector('.js-order-summary').innerHTML= cartSummarHTML;
    updateCheckoutHeader();
    
    document.querySelectorAll('.js-delete-link')
    .forEach((link)=>{
      link.addEventListener('click',()=>{
        const productId=link.dataset.productId;
        removeFromCart(productId);
        const container=document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove();
        updateCheckoutHeader();
        renderPaymentSummary();
      });
    });

    document.querySelectorAll('.js-update-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const newQuantity = prompt('Enter new quantity:');

      if (!newQuantity || isNaN(newQuantity) || newQuantity <= 0) {
        return;
      }
      updateCartQuantity(productId, Number(newQuantity));

      const message = document.querySelector(
        `.js-updated-message-${productId}`
      );

      message.classList.add('quantity-updated-message-visible');

      setTimeout(() => {
        
        renderOrderSummary();
        renderPaymentSummary();
      }, 2000);
      
    });
  });

  

  function deliveryOptionsHTML(matchingProduct,cartItem){
    let html='';
    deliveryOptions.forEach((deliveryOption)=>{
    
      const today=dayjs();
      const deliveryDate=today.add(deliveryOption.deliveryDays,'days');
      const dateString=deliveryDate.format('dddd,MMMM D');

      const priceString= deliveryOption.priceCents
      === 0
      ? 'FREE'

      : `$${formatCurrency(deliveryOption.priceCents)}`;

      const isChecked= deliveryOption.id=== cartItem.deliveryOptionId;

      html += 
      `
              <div class="delivery-option js-delivery-option"
              data-product-id="${matchingProduct.id}"
              data-delivery-option="${deliveryOption.id}">
                <input type="radio"
                ${isChecked ? 'checked' :''}
                  class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                <div>
                  <div class="delivery-option-date">
                    ${dateString}
                  </div>
                  <div class="delivery-option-price">
                    ${priceString}  Shipping
                  </div>
                </div>
              </div>
      `

    });
    return html;
  }
   
document.querySelectorAll('.js-delivery-option')
.forEach((element)=>{
element.addEventListener('click',()=>{
const productId=element.dataset.productId;
const deliveryOptionId=element.dataset.deliveryOption;
updateDeliveryOption(productId,deliveryOptionId);
renderOrderSummary();
renderPaymentSummary();

});
});

}

function updateCheckoutHeader() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  const checkoutItems = document.querySelector('.js-checkout-items');

  if (!checkoutItems) {
    return;
  }

  checkoutItems.textContent =
    cartQuantity === 1
      ? '1 item'
      : `${cartQuantity} items`;
}