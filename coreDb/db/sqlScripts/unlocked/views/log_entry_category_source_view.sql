SET search_path TO fbkt_core_db, public;
--||--
DROP VIEW IF EXISTS log_entry_category_source_view CASCADE;
--||--
CREATE VIEW log_entry_category_source_view AS 
SELECT DISTINCT
	lc.name AS log_category
	,le.source
	,ll.name as log_level
	,COUNT(*) AS log_category_source_count
	,lc.id as log_category_id
	,ll.id as log_level_id
FROM
	log_entry le
	JOIN log_category lc ON lc.id = le.log_category_id
	JOIN log_level ll ON ll.id = le.log_level_id
GROUP BY
	lc.name
	,le.source
	,ll.name
	,lc.id
	,ll.id
ORDER BY
	lc.name
	,le.source
	,ll.name
;

--||--	
SELECT 'SUCCESSFULLY CREATED log_entry_category_source_view' AS message;
