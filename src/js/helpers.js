import { TIMEOUT_SEC } from './config.js';
import { async } from 'regenerator-runtime';

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

export const getJSON = async function (URL) {
    try {
        const res = await Promise.race([fetch(URL), timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message}, status: ${res.status}`);
        return data;
    } catch (err) {
        throw err
    }
}

export const sendJSON = async function (URL, uploadData) {
    try {
        const res = await Promise.race([fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(uploadData),
        }), timeout(TIMEOUT_SEC)]);
        const data = await res.json();

        if (!res.ok) throw new Error(`${data.message}, status: ${res.status}`);
        return data;
    } catch (err) {
        throw err
    }
}