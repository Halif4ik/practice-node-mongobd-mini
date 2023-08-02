const users = [{title: 'tomato', 'id': 1}]
/*import { v4 as uuidv4 } from 'uuid';*/
const {v4: uuidv4} = require('uuid');
const path = require('path');
const fs = require('fs');

/*export const userRepository = {*/
const userRepository = {
    newUser: {},
    async createProduct(first_name, last_name, price, email, img) {
        this.newUser = {
            firstName: first_name,
            lastName: last_name,
            email: email,
            price: price,
            img: img,
            id: uuidv4()
        }

        const parseJsonData = await this.getAllFromBd();
        parseJsonData.push(this.newUser);
        return this.writeToBd(parseJsonData);
    },

    async updateUser(first_name, last_name, price, email, img, userId) {
        const newUser = {
            firstName: first_name,
            lastName: last_name,
            email: email,
            price: price,
            img: img,
            id: userId
        }

        const allUsersJsonToArray = await this.getAllFromBd();
        const indexChangingUser = allUsersJsonToArray.findIndex(user => {
            return user.id === userId
        })
        allUsersJsonToArray[indexChangingUser] = newUser;

        return new Promise(function (resolve, reject) {
            fs.writeFile(
                path.join(__dirname, 'bd.json'),
                JSON.stringify(allUsersJsonToArray),
                (err, content) => {
                    if (err) reject(err);
                    else resolve(newUser);
                }
            );
        })
    },

    getAllFromBd() {
        return new Promise(function (resolve, reject) {
            fs.readFile(
                path.join(__dirname, 'bd.json'),
                'utf-8',
                (err, content) => {
                    if (err) reject(err);
                    else resolve(JSON.parse(content));
                }
            );
        })
    },

    async getFromBdByID(id) {
        const allUsers = await this.getAllFromBd();
        return allUsers.find(user => {
            return user.id === id
        })
    },

    writeToBd(parseJsonData) {
        return new Promise(function (resolve, reject) {
            fs.writeFile(
                path.join(__dirname, 'bd.json'),
                JSON.stringify(parseJsonData),
                (err, content) => {
                    if (err) reject(err);
                    else resolve(this.newUser);
                }
            );
        })
    },

};
module.exports = userRepository;