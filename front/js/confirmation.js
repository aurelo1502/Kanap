function getOrderId() {
  //récupère le numéro de cde dans l'Url
  let str = window.location.href;
  let url = new URL(str);
  let recherche_param = new URLSearchParams(url.search);
  if (recherche_param.has("orderId")) {
    let orderId = recherche_param.get("orderId");
    //affiche message de confirmation avec Id de commande
    document.getElementById("orderId").innerHTML = orderId;
  }
}
getOrderId();
