$(document).ready(function(){
  $('.sidenav').sidenav();
  $('.parallax').parallax();
  $('.carousel').carousel();
  $('.tooltipped').tooltip();
  $('.materialboxed').materialbox();
  $('select').formSelect();
  $('.datepicker').datepicker();
  $('.timepicker').timepicker();
  $('input#input_text, textarea#textarea2').characterCounter();
  $('.tabs').tabs();
});
$('.carousel').carousel();
setInterval(()=>{
  $('.carousel').carousel('next');
},2000);



let result=document.querySelector('.result');
setTimeout(()=>{  
    result.remove();
}, 4000);


let preloader=document.getElementById("loading");
function homepage(){
  setTimeout(()=>{
    preloader.remove()
  },2000);
}


let infinite = new Waypoint.Infinite({
  element: $('.infinite-container')[0]
})




 



function fetchPrice(){
 let menu=document.getElementsByClassName('menu-card');
 for(let i=0;i<menu.length;i++){
  let menuPrice=menu[i].querySelectorAll('.menu-price').item(menu[i].textContent);
  let totalPrice=menu[i].querySelectorAll('.total-price').item(menu[i].textContent);
  let menuQty=menu[i].querySelectorAll('.menu-quantity').item(menu[i]);

  menuPrice=totalPrice;
} 
  totalPrice();
  inputElement()
}
fetchPrice();



function inputElement(){
  let quantityInputs=document.querySelectorAll('.menu-quantity');
  for(let i=0;i<quantityInputs.length;i++){
    let input=quantityInputs[i]
    input.addEventListener('change',quantityChanged);
  }
}

function quantityChanged(event){
  let input=event.target;
  if(isNaN(input.value) || input.value <=0){
    input.value=1
  }
  totalPrice();
}

 function totalPrice(){
  let oneProduct=document.querySelectorAll('.menu-card')
  // let totPayment=document.querySelector('#total-payment');
  for(let i=0;i<oneProduct.length;i++){
    
    let cardProduct=oneProduct[i];
    let one=cardProduct.querySelectorAll('.menu-quantity').item(cardProduct).value
    let oneMenu=cardProduct.querySelectorAll('.menu-price').item(cardProduct).textContent * one
    let totalProduct=cardProduct.querySelectorAll('.total-price').item(cardProduct)
    totalProduct.textContent= oneMenu
    
  }
 
}



