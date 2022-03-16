// Load Sentry Loggin resources
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "https://d3e05c16f8f0450bb8f3cc3752b7c390@o1168407.ingest.sentry.io/6260330", tracesSampleRate: 1.0 });

module.exports = {
    name: 'error',
    async execute(error) {
        Sentry.withScope(function(scope) {
            scope.setTag('enviroment', 'prod');
            scope.setTag('bot_project', 'remtickethelper');
            scope.setTag('error_type', 'errorHandler');
            scope.setTag('file', 'error.js');
            scope.setLevel('error');
            Sentry.captureException(error);
        });
        console.error(error);
    }
}