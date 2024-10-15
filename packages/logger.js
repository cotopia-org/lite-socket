

export const log = (...args) => {
    console.log('\x1b[2m%s\x1b[0m', new Date().toISOString(), args)


}