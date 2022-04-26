// On récupère l'orderId dans l'URL, puis on l'affiche

let orderId = new URLSearchParams(document.location.search).get("orderId");
document.getElementById("orderId").textContent = orderId;
