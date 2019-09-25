let log = () => {};
const logger = (...args) => log(...args);
const set = implementation => {
    log = implementation;
};

module.exports = {
    logger,
    set,
};
