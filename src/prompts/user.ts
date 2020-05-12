const { Input } = require('enquirer');

export const enquireUser = () => {
    return new Input({
        name: 'user',
        initial: process.env.USER || '',
        message: 'What is your AWS username?'
    }).run()
}