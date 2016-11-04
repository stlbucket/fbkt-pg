module.exports = {
    url:   '/FbktCore/LogEntry',
    entityName: 'logEntry',
    entityType: 'table',
    tableName:  'log_entry',
    schemaName: 'fbkt_core_db',
    restEndpoints:  {
        getAll: {
            enabled:    false,
            auth:       'none'
        },
        getOne: {
            enabled:    false,
            auth:       'none'
        },
        post: {
            enabled:    false,
            auth:       'none'
        },
        put: {
            enabled:    false,
            auth:       'none'
        },
        delete: {
            enabled:    false,
            auth:       'none'
        }
    }
};