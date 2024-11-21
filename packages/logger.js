import axios from "axios";


export const log = (...args) => {
    console.log('\x1b[2m%s\x1b[0m', new Date().toISOString(), args)

    const data = {
        dt: new Date().toISOString().replace('T', ' ').replace('Z', ' UTC'),
        message: args,
    };

    axios.post('https://in.logs.betterstack.com', data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer CVefG9h9gDf4JwSfSp1J6JxX',
        },
    })


}