module.exports = function(data) {
    return {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: data,
    };
};
