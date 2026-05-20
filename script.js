const BRAND={name:"H ESSENTIALS",whatsapp:"584122687310"};

const productsData=[
 {
  id:1,
  name:"Essential Jacket",
  price:180,
  path:"img/camisa/",
  images:["01.png","02.png","03.png"],
  sizes:["S","M","L"]
 },
 {
  id:2,
  name:"Urban Sneakers",
  price:220,
  path:"img/shoes/",
  images:["01.png","02.png","03.png"],
  sizes:["40","41","42"]
 },
 {
  id:3,
  name:"Minimal Watch",
  price:95,
  path:"img/watch/",
  images:["01.png","02.png"],
  sizes:["Única"]
 }
];

/* VARIABLES */

let cart=JSON.parse(localStorage.getItem("cart"))||[];
let currentProduct=null;
let selectedSize=null;
let lastReceiptImage=null;
let lastSaleCode=null;
let purchaseHistory=JSON.parse(localStorage.getItem("purchaseHistory"))||[];

const productsBox=document.getElementById("products");

/* PRODUCTOS */
function renderProducts(){
 productsBox.innerHTML="";

 productsData.forEach(p=>{
  productsBox.innerHTML+=`
   <div class="card" onclick="openProduct(${p.id})">
    <img src="${p.path}01.png"
     onmouseover="this.src='${p.path}02.png'"
     onmouseout="this.src='${p.path}01.png'">
    <h4>${p.name}</h4>
    <p>$${p.price}</p>
   </div>
  `;
 });
}

renderProducts();

/* PRODUCTO */
function openProduct(id){

 currentProduct=productsData.find(p=>p.id===id);
 selectedSize=null;

 document.getElementById("pvName").innerText=currentProduct.name;
 document.getElementById("pvPrice").innerText=currentProduct.price;

 /* IMAGEN PRINCIPAL */
 const mainImg=document.getElementById("viewerImg");
 mainImg.src=currentProduct.path + currentProduct.images[0];

 /* THUMBS */
 const thumbs=document.getElementById("thumbs");
 thumbs.innerHTML="";

 currentProduct.images.forEach((img,i)=>{

  const image=document.createElement("img");
  image.src=currentProduct.path + img;

  if(i===0) image.classList.add("active");

  image.onclick=()=>{
   mainImg.style.opacity=0;

   setTimeout(()=>{
    mainImg.src=image.src;
    mainImg.style.opacity=1;
   },150);

   document.querySelectorAll(".thumbs img").forEach(i=>i.classList.remove("active"));
   image.classList.add("active");
  };

  thumbs.appendChild(image);
 });

 /* TALLAS */
 const sizeBox=document.getElementById("sizeOptions");
 sizeBox.innerHTML="";

 currentProduct.sizes.forEach(s=>{
  const b=document.createElement("button");
  b.innerText=s;

  b.onclick=()=>{
   selectedSize=s;
   document.querySelectorAll("#sizeOptions button").forEach(btn=>btn.classList.remove("active"));
   b.classList.add("active");
  };

  sizeBox.appendChild(b);
 });

 document.getElementById("productView").style.display="flex";
}

function closeProduct(){
 document.getElementById("productView").style.display="none";
}

/* VALIDACIÓN */
function addCurrentProduct(){
 if(!selectedSize){
  alert("Selecciona una talla obligatoriamente");
  return;
 }

 cart.push({
  name:currentProduct.name,
  size:selectedSize,
  price:currentProduct.price,
  img:`${currentProduct.path}01.png`
 });

 localStorage.setItem("cart",JSON.stringify(cart));
 updateCart();
 closeProduct();
}

/* CARRITO */
function updateCart(){
 document.getElementById("cartCount").innerText=cart.length;
 const cartCountMobile=document.getElementById("cartCountMobile");
 if(cartCountMobile) cartCountMobile.innerText=cart.length;
}

function toggleCart(){
 document.getElementById("cartDrawer").classList.toggle("open");
 renderCart();
}

function renderCart(){
 const box=document.getElementById("cartItems");
 box.innerHTML="";
 let total=0;

 cart.forEach(i=>{
  total+=i.price;

  box.innerHTML+=`
   <div class="cart-item">
    <img src="${i.img}">
    <div>
     <p>${i.name}</p>
     <small>Talla: ${i.size}</small><br>
     <small>$${i.price}</small>
    </div>
   </div>
  `;
 });

 document.getElementById("total").innerText=total;
}

/* LIMPIAR */
function clearCart(){
 // Guardar en historial si hay un código de venta
 if(lastSaleCode && cart.length>0){
  const total=cart.reduce((sum,item)=>sum+item.price,0);
  purchaseHistory.push({
   code:lastSaleCode,
   date:new Date().toISOString(),
   items:cart,
   total:total
  });
  localStorage.setItem("purchaseHistory",JSON.stringify(purchaseHistory));
 }
 
 cart=[];
 localStorage.removeItem("cart");
 updateCart();
 renderCart();
}

/* WHATSAPP + IMAGEN */
function sendWhatsApp(){
 if(cart.length===0){
  alert("El carrito está vacío");
  return;
 }
 showReceipt();
}

function searchProducts(){

 const value = document.getElementById("searchInput")?.value.toLowerCase() ||
               document.querySelector("#mobileSearch input")?.value.toLowerCase();

 const filtered = productsData.filter(p =>
  p.name.toLowerCase().includes(value)
 );

 renderFilteredProducts(filtered);
}

/* RENDER FILTRADO */
function renderFilteredProducts(list){

 productsBox.innerHTML="";

 list.forEach(p=>{
  productsBox.innerHTML+=`
   <div class="card" onclick="openProduct(${p.id})">
    <img src="${p.path}01.png"
         onmouseover="this.src='${p.path}02.png'"
         onmouseout="this.src='${p.path}01.png'">
    <h4>${p.name}</h4>
    <p>$${p.price}</p>
   </div>
  `;
 });
}

function toggleSearch(){
 const box=document.getElementById("mobileSearch");

 box.style.display = box.style.display === "block" ? "none" : "block";
}

/* ========== GENERADOR DE RECIBO ========== */

function generateSaleCode(){
 const timestamp=Date.now().toString();
 const random=Math.random().toString(36).substring(2,6).toUpperCase();
 return `${random}${timestamp.slice(-6)}`;
}

function generateReceiptHTML(){
 const total=cart.reduce((sum,item)=>sum+item.price,0);
 lastSaleCode=generateSaleCode();
 const date=new Date().toLocaleString('es-ES');

 let items='';
 cart.forEach((item,index)=>{
  items+=`
   <div class="receipt-item">
    <img src="${item.img}" alt="${item.name}">
    <div class="item-info">
     <h4>${item.name}</h4>
     <p>Talla: ${item.size}</p>
     <p class="price">$${item.price}</p>
    </div>
   </div>
  `;
 });

 return `
  <div class="receipt-inner">
   <div class="receipt-header">
    <h1>${BRAND.name}</h1>
    <p class="receipt-code">Código: ${lastSaleCode}</p>
    <p class="receipt-date">${date}</p>
   </div>

   <div class="receipt-items">
    ${items}
   </div>

   <div class="receipt-total">
    <h3>Total: $${total}</h3>
   </div>

   <div class="receipt-note">
    <p><strong>Importante:</strong></p>
    <p>Descarga esta imagen y envíala por WhatsApp para completar tu compra</p>
   </div>

   <div class="receipt-footer">
    <p>${BRAND.name}</p>
   </div>
  </div>
 `;
}

function showReceipt(){
 if(cart.length===0){
  alert("El carrito está vacío");
  return;
 }

 const receiptContent=document.getElementById("receiptContent");
 receiptContent.innerHTML=generateReceiptHTML();
 document.getElementById("receiptModal").style.display="flex";
 
 // Scroll al inicio del recibo
 setTimeout(()=>{
  document.querySelector(".receipt-container").scrollTop=0;
 },50);
}

function closeReceipt(){
 document.getElementById("receiptModal").style.display="none";
}

function downloadReceipt(){
 generateReceiptImage((imageData)=>{
  const link=document.createElement("a");
  link.href=imageData;
  link.download=`recibo_${lastSaleCode}.jpg`;
  link.click();
 });
}

function generateReceiptImage(callback){
 const receiptElement=document.getElementById("receiptContent").querySelector(".receipt-inner");
 
 if(!receiptElement){
  console.error("Elemento de recibo no encontrado");
  return;
 }
 
 html2canvas(receiptElement,{
  backgroundColor:"#1a1a1a",
  scale:1,
  useCORS:true,
  logging:false,
  allowTaint:true
 }).then(canvas=>{
  const imageData=canvas.toDataURL("image/jpeg", 0.8);
  lastReceiptImage=imageData;
  callback(imageData);
 }).catch(err=>{
  console.error("Error generando imagen:", err);
  alert("Error al generar la imagen del recibo");
 });
}

function sendReceiptWhatsApp(){
 if(cart.length===0){
  alert("El carrito está vacío");
  return;
 }

 generateReceiptImage((imageData)=>{
  // 1. Descargar automáticamente PRIMERO
  const link=document.createElement("a");
  link.href=imageData;
  link.download=`recibo_${lastSaleCode}.jpg`;
  link.click();
  
  // 2. Esperar a que se descargue completamente (2000ms)
  setTimeout(()=>{
   // Construir mensaje WhatsApp
   const total=cart.reduce((sum,item)=>sum+item.price,0);
   let msg=`Hola! 👋 Quiero confirmar mi pedido en *${BRAND.name}*%0A%0A`;
   msg+=`🎟️ *Código:* ${lastSaleCode}%0A`;
   
   msg+=`%0A💰 *Total:* $${total}%0A%0A`;
   msg+=`NOTA: debes abjuntar la imagen descargada📷 %0A`;
   msg+=`Si estas de acuerdo con tu pedido enviame la palabra "CONFIRMO"`;

   // 3. Abrir WhatsApp DESPUÉS de descargar
   window.open(`https://wa.me/${BRAND.whatsapp}?text=${msg}`);
   
   // 4. Limpiar después
   setTimeout(()=>{
    clearCart();
    closeReceipt();
   },800);
  },2000);
 });
}