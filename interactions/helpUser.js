const JsonResult = require('../utils/JsonResult');

const helpText = [
    'Vom must be connected to your account. Use `/vom connect` to get started.',
    'To vom reactions at someone, use `/vom @user`.',
    'To limit the amount of reactions, use `/vom @user 10`',
].join('\n');

module.exports = function() {
    return JsonResult({
        text: 'How to use /vom',
        attachments: [
            {
                text: helpText,
            }
        ]
    })
};
