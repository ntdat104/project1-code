import Crypto from "crypto-js";

export function CREATE_SALT(length) {
    const BASE64 = [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"
    ];

    let salt = "";
    for (let i = 0; i < length; i++) {
        const RANDOM_INDEX = Math.floor(Math.random() * BASE64.length);
        salt += BASE64[RANDOM_INDEX];
    }

    return salt
}

export function HMAC_SHA256(PASSWORD, SALT) {
    const SECRET_KEY = "lhrYDV62";
    const CIPHER_TEXT = Crypto.HmacSHA256(PASSWORD + SALT, SECRET_KEY).toString();
    return CIPHER_TEXT
}