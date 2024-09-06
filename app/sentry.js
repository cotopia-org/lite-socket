import * as Sentry from "@sentry/node";
import {nodeProfilingIntegration} from '@sentry/profiling-node';

// Ensure to call this before requiring any other modules!
Sentry.init({
    dsn: "https://c2ec201402cc42b8f0c17efa9465e5f2@o4507877961629696.ingest.de.sentry.io/4507877965496400",
    integrations: [
        Sentry.captureConsoleIntegration()],
    debug: true,


});

export default Sentry