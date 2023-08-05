const path = require('path');
const fs = require('fs');
const filepath = path.join(path.dirname(process.mainModule.filename),
    'repositories',
    'card.json'
);

class Card {
    static async add(user) {
        const card = await this.fetsh()
        const idx = card?.users.findIndex(currentUser => {
            return currentUser.id === user.id
        });

        /*founded*/
        if (idx !== -1) {
            card.users[idx].count++
        } else {
            user.count = 1;
            card.users.push(user);
        }
        card.price += +user.price;

        return new Promise((resolve, reject) => {
            fs.writeFile(filepath,
                JSON.stringify(card),
                (err, content) => {
                    if (err) reject(err);
                    resolve(true)
                });
        });
    }

    static async deleteProduct(idProduct) {
        const card = await this.fetsh()
        let removedElFromEmptyArr;
        const idx = card?.users.findIndex(currentUser => {
            return currentUser.id === idProduct
        });
        console.log(idx,idx != -1,card.users[idx].count > 1);

        if ( idx != -1 && card?.users[idx].count > 1) {
            card.users[idx].count--
            card.price -= +card?.users[idx].price;
        } else {
            removedElFromEmptyArr = card.users.splice(idx, 1);
            card.price -= +removedElFromEmptyArr[0].price;
        }

        return new Promise((resolve, reject) => {
            fs.writeFile(filepath,
                JSON.stringify(card),
                (err, content) => {
                    if (err) reject(err);
                    resolve(card)
                });
        });
    }

    static async fetsh() {
        return new Promise((resolve, reject) => {
            fs.readFile(filepath,
                'utf-8',
                (err, content) => {
                    if (err) reject(err);
                    resolve(JSON.parse(content))
                });
        });
    };
};

module.exports = Card;