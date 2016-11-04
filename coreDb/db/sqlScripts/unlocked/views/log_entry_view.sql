SET search_path TO fbkt_core_db, public;
--||--
DROP VIEW IF EXISTS log_entry_view CASCADE;
--||--
CREATE VIEW log_entry_view AS 
SELECT
	le.id
	,le.message
	,le.source
	,lc.name as log_category
	,ll.name as log_level
	,le.log_timestamp
	,le.attributes_json
	,lc.id as log_category_id
	,ll.id as log_level_id
FROM
	log_entry le
	JOIN log_category lc ON lc.id = le.log_category_id
	JOIN log_level ll ON ll.id = le.log_level_id;
	
SELECT 'SUCCESSFULLY CREATED log_entry_view' AS message;