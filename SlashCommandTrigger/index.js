module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.res = {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            'response_type': 'ephemeral',
            'text': 'Voming...',
            'attachments': [
                { 'text': JSON.stringify(req.body) }
            ]
        }
    };
};
