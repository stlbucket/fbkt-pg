module.exports = {
    url:   '/FbktCore/FbktDbPatch',
    entityName: 'fbktDbPatch',
    entityType: 'table',
    tableName:  'fbkt_db_patch',
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