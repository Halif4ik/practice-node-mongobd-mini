const users = [{title: 'tomato', 'id': 1}]
/*import { v4 as uuidv4 } from 'uuid';*/
const {v4: uuidv4} = require('uuid');
const path = require('path');
const fs = require('fs');

/*export const userRepository = {*/
const userRepository = {
    async createProduct(first_name, last_name, password, email) {
        const newUser = {
            firstName: first_name,
            lastName: last_name,
            email: email,
            password: password,
            id: uuidv4()
        }


        function getFromBd() {
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
        }

        const parseJsonData = await getFromBd();
        parseJsonData.push(newUser);
        console.log('parseJsonData-', parseJsonData);

        function writeToBd() {
            return new Promise(function (resolve, reject) {
                fs.writeFile(
                    path.join(__dirname, 'bd.json'),
                    JSON.stringify(parseJsonData),
                    (err, content) => {
                        if (err) reject(err);
                        else resolve(newUser);
                    }
                );
            })
        }

        return writeToBd();
    },

};
module.exports = userRepository;