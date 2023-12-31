function changePrice(priceOnElem) {
    priceOnElem.textContent = Intl.NumberFormat('us-US', {
        currency: 'usd',
        style: 'currency'
    }).format(+priceOnElem.textContent);
};

function changeDateFormat(dateInEachElem) {
    const temp= +dateInEachElem.textContent.trim();

    dateInEachElem.textContent = Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year:'2-digit',
        hour:'2-digit',
        minute:'2-digit',
        second: '2-digit'
    }).format(new Date(temp));
};

document.querySelectorAll('.card .card-content P.price, .price.big, .price-total').forEach(function (priceOnEachElem) {
    changePrice(priceOnEachElem);
});

document.querySelectorAll('.card .card-content .date').forEach(function (dateInEachElem) {
    changeDateFormat(dateInEachElem);
});

const cartCont = document.querySelector('.card-container');
cartCont && cartCont.addEventListener('click', function (event) {
    const decreaseBtn = event.target.closest('.js-remove');
    if (decreaseBtn) {
        const idRemoveProd = decreaseBtn.dataset.id;
        const csrf = decreaseBtn.dataset.csrf;

        fetch(`/card/${idRemoveProd}`, {
            method: 'DELETE',
            headers:{'x-xcsrf':csrf}
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

var instance = M.Tabs.init(document.querySelector('.tabs'),{duration:800});
/*
console.log('instance-',instance);*/
