function changePrice(priceOnElem) {
    priceOnElem.textContent = Intl.NumberFormat('us-US', {
        currency: 'usd',
        style: 'currency'
    }).format(+priceOnElem.textContent);
};

document.querySelectorAll('.card .card-content P.price, .price.big, .price-total').forEach(function (priceOnEachElem) {
    changePrice(priceOnEachElem);
});

const cartCont = document.querySelector('.card-container');
cartCont && cartCont.addEventListener('click', function (event) {
    const removeBtn = event.target.closest('.js-remove');
    if (removeBtn) {
        const idRemoveProd = removeBtn.dataset.id;
        fetch(`/card/${idRemoveProd}`, {
            method: 'DELETE'
        }).then(function (resp) {
            return resp.json();
        }).then(function (card) {
            if (card.users.length) {
                const arrayPartsHtml = card.users.map(curUser => {
                    return `<tr>
                    <td>${curUser.firstName} ${curUser.lastName}</td>
                    <td>${curUser.count}</td>
                    <td>${curUser.price}</td>
                    <td>
                        <button class="btn btm-small js-remove" data-id="${curUser.developerId}">Decrease</button>
                    </td>
                </tr>`
                });
                cartCont.querySelector('tbody').innerHTML = arrayPartsHtml.join('');

                const cartPriceEl = cartCont.querySelector('.price-total');
                cartPriceEl.textContent = card.totalPrice;
                changePrice(cartPriceEl);
            } else {
                cartCont.innerHTML = '<p>Temporary empty card</p>'
            }
        }).catch(function (err) {
            console.log(err)
        });

    }

});