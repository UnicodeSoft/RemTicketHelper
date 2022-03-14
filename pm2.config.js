module.exports = {
    apps : [{
        name   : "RemTicketHelper",
        script : "./index.js",

        watch : true,
        ignore_watch : [
            './data/db.sqlite'
        ],

        autorestart  : true,
        max_restarts : 10,
        cron_restart : '0 0 * * *',

        log_date_format : 'YYYY-MM-DD HH:mm',
        error_file : './logs/errors.log',
        out_file   : './logs/out.log',
    }]
}
