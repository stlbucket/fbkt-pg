set search_path to fbkt_core_db, public;

select * from fbkt_pipe;

select * from ping_request;


select
(select count(*) from fbkt_pipe)  as pipes,
(select count(*) from ping_request)  as ping_requests
;
