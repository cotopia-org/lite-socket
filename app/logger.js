import Sentry from "./sentry.js";


export const log = (...args) => {
    console.log(args)
    // Sentry.captureMessage(args,);


}