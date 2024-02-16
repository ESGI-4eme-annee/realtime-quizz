module.exports = function generateToken(length) {
    return [...Array(length)].map(() => Math.random().toString(36)[2]).join('');
}