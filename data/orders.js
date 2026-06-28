import { getProduct, loadProductsFetch } from '../data/products.js';
import {formatCurrency} from '../scripts/utils/money.js';
import { cart,addToCart } from '../data/cart.js';

const addedMessageTimeouts={};

export const orders=JSON.parse(localStorage.getItem('orders')) || [];

export function  addOrder(order){
    orders.unshift(order);
    saveToStorage();
}

function saveToStorage(){
    localStorage.setItem('orders',JSON.stringify(orders));
}

const ordersGrid=document.querySelector('.js-orders-grid');

if(ordersGrid){
  loadProductsFetch().then(()=>{
    updateCartQuantity();
    renderOrderPage();
  });
}

function renderOrderPage(){
    let ordersHTML='';
    orders.forEach((order)=>{
        let productsHTML='';
        order.products.forEach((orderProduct)=>{
            const product=getProduct(orderProduct.productId);
           productsHTML+=` 
           <div class="product-image-container">
              <img src="${product.image}">
            </div>
          
            <div class="product-details">
              <div class="product-name">
                ${product.name}
              </div>
              <div class="product-delivery-date">
                Arriving on: ${formatOrderDate(orderProduct.estimatedDeliveryTime)}
              </div>
              <div class="product-quantity">
                Quantity: ${orderProduct.quantity}
              </div>
              <button class="buy-again-button button-primary
              js-buy-again"
              data-product-id="${product.id}">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              </button>
              <div class="added-to-cart js-added-to-cart-${product.id}">
                ✔ Added
              </div>
            </div>
            <div class="product-actions">
              <a href="tracking.html?orderId=${order.id}&productId=${orderProduct.productId}">
                  <button class="track-package-button button-secondary">
                    Track package
                  </button>
              </a>
            </div>
            
            `;
        });
        ordersHTML +=`
        <div class="order-container">
          
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${formatOrderDate(order.orderTime)}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${formatCurrency(order.totalCostCents)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>

          <div class="order-details-grid">
          ${productsHTML}
          </div>
        </div>
        `;
    });
    ordersGrid.innerHTML=ordersHTML;

    document.querySelectorAll('.js-buy-again')
    .forEach((button)=>{
      button.addEventListener('click',()=>{
        const productId=button.dataset.productId;
        addToCart(productId);
        updateCartQuantity();

        const message = document.querySelector(
        `.js-added-to-cart-${productId}`
      );

      message.classList.add('added-to-cart-visible');

      clearTimeout(addedMessageTimeouts[productId]);

      addedMessageTimeouts[productId] = setTimeout(() => {
        message.classList.remove('added-to-cart-visible');
      }, 2000);

      });
    });
    
}
function formatOrderDate(dateString){
        const date=new Date(dateString);
        return date.toLocaleDateString('en-US',{
            month:'long',
            day:'numeric'
        });
}

function updateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}