// récupérer orderId et l'afficher

let orderId = new URLSearchParams(document.location.search).get("orderId");

document.getElementById("orderId").textContent = orderId;
