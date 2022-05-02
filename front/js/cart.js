// 1 --- Depuis la page Panier, récupérer le panier et ses éléments via localStorage
let produitDuPanier = JSON.parse(localStorage.getItem("panier"));

// 2 --- On vérifie s'il y a des articles dans le panier, si oui, on les affiche

// on cible l'emplacement
const cartItem = document.getElementById("cart__items");
//si le panier ne contient aucun article
if (produitDuPanier === null) {
  // indiquer que le panier est vide
  alert("Votre panier est vide, veuillez séléctionner au moins un article");
} else {
  //SINON
  //on définis les variables nécessaire au calcul du total
  let totalPrice = [];
  let totalQuantity = [];
  //on crée la boucle permettant d'afficher les produits du panier
  for (let i = 0; i < produitDuPanier.length; i++) {
    //On isole l'id du produit + couleur et qty
    let productId = produitDuPanier[i].id;
    let productColor = produitDuPanier[i].color;
    let productQuantity = produitDuPanier[i].quantity;

    // On utilise fetch pour récupérer et afficher les infos complètes de chaque article
    fetch(`http://localhost:3000/api/products/${productId}`)
      .then((response) => response.json())
      .then((product) => {
        cartItem.innerHTML += `               <article class="cart__item" data-id="${productId}" data-color="${productColor}">
        <div class="cart__item__img">
          <img src="${product.imageUrl}" alt="${product.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${product.name}</h2>
            <p>${productColor}</p>
            <p>${product.price}</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productQuantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`;

        // Calcul de la quantité et du prix total
        // quantity total
        totalQuantity.push(parseInt(productQuantity));

        // prix total
        let productPrice = product.price;
        let sousTotal = productPrice * productQuantity;
        totalPrice.push(sousTotal);

        // on fait le calul grace a la fonction reducer
        let reducer = (accumulator, currentValue) => accumulator + currentValue;
        let TotalQuantityPanier = totalQuantity.reduce(reducer, 0);
        let TotalPricePanier = totalPrice.reduce(reducer, 0);

        // on affiche le total et le nombre d'article
        let quantity = document.getElementById("totalQuantity");
        quantity.textContent = ` ${TotalQuantityPanier}`;
        let total = document.getElementById("totalPrice");
        total.textContent = `${TotalPricePanier}`;

        // Gestion de la suppression de produit et changement de quantité
        // Modification qté et mise à jour du total panier
        let itemQuantity = document.querySelectorAll(".itemQuantity");

        for (let i = 0; i < itemQuantity.length; i++) {
          itemQuantity[i].addEventListener("change", (e) => {
            let newQuantity = e.target.value;
            let articleToChangeId = e.target.closest("article").dataset.id;
            let articleToChangeColor =
              e.target.closest("article").dataset.color;

            let foundProduct = produitDuPanier.find(
              (p) =>
                p.id === articleToChangeId && p.color === articleToChangeColor
            );
            if (foundProduct != undefined) {
              foundProduct.quantity = newQuantity;
              localStorage.setItem("panier", JSON.stringify(produitDuPanier));
              window.location.reload();
            }
          });
        }
        //Suppresion d'un article
        let btnSupprimer = document.querySelectorAll(".deleteItem");
        for (let i = 0; i < btnSupprimer.length; i++) {
          btnSupprimer[i].addEventListener("click", (e) => {
            let articleToDeleteId = e.target.closest("article").dataset.id;
            let articleToDeleteColor =
              e.target.closest("article").dataset.color;
            let foundProduct = produitDuPanier.find(
              (p) =>
                p.id === articleToDeleteId && p.color === articleToDeleteColor
            );
            if (foundProduct != undefined) {
              produitDuPanier.splice(i, 1);
              localStorage.setItem("panier", JSON.stringify(produitDuPanier));
              window.location.reload();
            }
          });
        }
      });
  }
  // Lorsque tout les articles ont été supprimés du panier
  if (produitDuPanier.length === 0) {
    totalQuantity = document.getElementById("totalQuantity");
    totalQuantity.textContent = 0;
    totalPrice = document.getElementById("totalPrice");
    totalPrice.textContent = 0;
    alert("Le panier a été vidé, veuillez sélectionner au moins un article");
  }
}

// 3 --- Validation du FORMULAIRE

// On cible le btn de validation
let validation = document.getElementById("order");

//Vérification de la valididté de chaque champ

//pour valider le champ prénom
let prenom = document.getElementById("firstName");
let prenomErreur = document.getElementById("firstNameErrorMsg");
let prenomRegexp = /^(([A-Za-zÉÈÎÏéèêîïàç]+['.]?[ ]?|[a-zéèêîïàç]+['-]?)+)$/;
validation.addEventListener("click", validatePrenom);

function validatePrenom(e) {
  e.preventDefault();
  if (prenom.validity.valueMissing) {
    //si le champ de donnée n'est pas renseigné
    prenomErreur.textContent = "Veuillez indiquer votre prénom";
    prenomErreur.style.color = "red";
  }
}
prenom.onkeydown = function () {
  if (prenomRegexp.test(prenom.value) == true) {
    // si le champ est renseigné ET valide
    prenomErreur.textContent = "Format valide";
    prenomErreur.style.color = "lime";
  } else {
    // si le champ de donnée est incorrect
    prenomErreur.textContent =
      "Le format est incorrect (pas de chiffre ou caractères spéciaux)";
    prenomErreur.style.color = "orange";
  }
};

// pour valider le champ nom
let nom = document.getElementById("lastName");
let nomErreur = document.getElementById("lastNameErrorMsg");
let nomRegexp = /^(([A-Za-zÉÈÎÏéèêîïàç]+['.]?[ ]?|[a-zéèêîïàç]+['-]?)+)$/;
validation.addEventListener("click", validateNom);

function validateNom(e) {
  e.preventDefault();
  if (nom.validity.valueMissing) {
    nomErreur.textContent = "Veuillez indiquer votre nom";
    nomErreur.style.color = "red";
  }
}
nom.onkeydown = function () {
  if (nomRegexp.test(nom.value) == true) {
    nomErreur.textContent = "Format valide";
    nomErreur.style.color = "lime";
  } else {
    nomErreur.textContent =
      "Le format est incorrect (pas de chiffre ou caractères spéciaux)";
    nomErreur.style.color = "orange";
  }
};
// pour valider le champ adresse
let adresse = document.getElementById("address");
let adresseErreur = document.getElementById("addressErrorMsg");
let adresseRegexp = /([0-9]{0,5})([A-ZÀ-Ÿa-z-, ']{4,60})$/;
validation.addEventListener("click", validateAdresse);

function validateAdresse(e) {
  e.preventDefault();
  if (adresse.validity.valueMissing) {
    adresseErreur.textContent = "Veuillez indiquer votre adresse";
    adresseErreur.style.color = "red";
  }
}
adresse.onkeydown = function () {
  if (adresseRegexp.test(adresse.value) == true) {
    adresseErreur.textContent = "Format valide";
    adresseErreur.style.color = "lime";
  } else {
    adresseErreur.textContent = "Veuillez vérifier le format de l'adresse";
    adresseErreur.style.color = "orange";
  }
};
// pour valider le champ ville
let ville = document.getElementById("city");
let villeErreur = document.getElementById("cityErrorMsg");
let villeRegexp = /([0-9]{0,5})([A-ZÀ-Ÿa-z-, ']{4,60})$/;
validation.addEventListener("click", validateVille);

function validateVille(e) {
  e.preventDefault();
  if (ville.validity.valueMissing) {
    villeErreur.textContent = "Veuillez indiquer votre ville";
    villeErreur.style.color = "red";
  }
}
ville.onkeydown = function () {
  if (villeRegexp.test(ville.value) == true) {
    villeErreur.textContent = "Format valide";
    villeErreur.style.color = "lime";
  } else {
    villeErreur.textContent = "Veuillez vérifier le format de la ville";
    villeErreur.style.color = "orange";
  }
};
// pour valider le champ email
let email = document.getElementById("email");
let emailErreur = document.getElementById("emailErrorMsg");
let emailRegexp = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
validation.addEventListener("click", validateEmail);

function validateEmail(e) {
  e.preventDefault();
  if (email.validity.valueMissing) {
    emailErreur.textContent = "Veuillez indiquer votre adresse email";
    emailErreur.style.color = "red";
  }
}
email.onkeydown = function () {
  if (emailRegexp.test(email.value) == true) {
    emailErreur.textContent = "L'adresse email est valide";
    emailErreur.style.color = "lime";
  } else {
    emailErreur.textContent = "L'adresse email n'est pas valide";
    emailErreur.style.color = "orange";
  }
};

// 4 ---- Validation de la commade

validation.addEventListener("click", (e) => {
  e.preventDefault();

  // recupération d'un tableau des id produit du localstorage
  let idArray = [];
  for (let i = 0; i < produitDuPanier.length; i++) {
    idArray.push(produitDuPanier[i].id);
  }

  //Rassembler les données à envoyer à l'API
  let commandeFinal = {
    // récupération des valeurs du formulaire dans l'objet contact
    contact: {
      firstName: prenom.value,
      lastName: nom.value,
      address: adresse.value,
      city: ville.value,
      email: email.value,
    },
    // et du tableau d'id
    products: idArray,
  };

  //SI, l'ensemble des champs du formulaire est valide
  if (
    prenomRegexp.test(prenom.value) == true &&
    nomRegexp.test(nom.value) == true &&
    emailRegexp.test(email.value) == true &&
    villeRegexp.test(ville.value) == true &&
    adresseRegexp.test(adresse.value) == true
  ) {
    //On envoie la commande au LS
    localStorage.setItem("commandefinal", JSON.stringify(commandeFinal));
    // on utilise post fetch pour envoyer la commande au serveur (API)
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(commandeFinal),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.clear();
        document.location.href = "confirmation.html?orderId=" + data.orderId;
      })
      .catch((err) => console.log(err.message));
  } else {
    //...SINON
    return alert(
      "Merci de vérifier l'exactitude des renseignements du formulaire"
    );
  }
});
