const { Input } = require('enquirer');

export const enquireMfaToken = () => {
    return new Input({
        name: 'token',
        message: 'What is the current MFA code?'
    }).run()
}