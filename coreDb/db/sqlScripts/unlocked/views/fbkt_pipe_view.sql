SET search_path TO fbkt_core_db, public;
--||--
DROP VIEW IF EXISTS fbkt_pipe_view CASCADE;
--||--
CREATE VIEW fbkt_pipe_view AS 
SELECT
	p.id,
	ps.name AS status,
	p.name,
	p.uid,
	p.workspace
FROM
	fbkt_pipe p
	JOIN fbkt_pipe_status ps ON ps.id = p.fbkt_pipe_status_id;
	
SELECT 'SUCCESSFULLY CREATED fbkt_pipe_view' AS message;