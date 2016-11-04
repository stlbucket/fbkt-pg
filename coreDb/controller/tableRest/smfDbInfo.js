module.exports = {
    url:   '/FbktCore/FbktDbInfo',
    entityName: 'fbktDbInfo',
    entityType: 'table',
    tableName:  'fbkt_db_info',
    schemaName: 'fbkt_core_db',
    restEndpoints:  {
        getAll: {
            enabled:    true,
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