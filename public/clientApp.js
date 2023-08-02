document.querySelectorAll('.card .card-content P.price, .price.big').forEach(function (priceOnEachElem) {
    priceOnEachElem.textContent = Intl.NumberFormat('us-US', {
        currency: 'usd',
        style: 'currency'
    }).format(+priceOnEachElem.textContent);
});

