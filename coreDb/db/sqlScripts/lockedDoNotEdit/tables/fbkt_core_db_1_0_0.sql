CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--||--
--drop schema if exists fbkt_core_db cascade;
--||--
CREATE SCHEMA IF NOT EXISTS fbkt_core_db;
--||--
SET search_path TO fbkt_core_db ,public;
--||--
CREATE TABLE IF NOT EXISTS fbkt_db_info
(
	id 			            serial NOT NULL,
	target			        text NOT NULL,
	last_patch_timestamp	timestamp NOT NULL DEFAULT now(),
	CONSTRAINT pk_fbkt_db_info PRIMARY KEY (id)
);
--||--
CREATE TABLE IF NOT EXISTS fbkt_db_patch
(
	id 				    serial NOT NULL,
	package_name		text NOT NULL,
	file_name 			text NOT NULL,
	repatchable			boolean NOT NULL default false,
	applied_timestamp 		timestamp NOT NULL DEFAULT now(),
	attributes_json			text NOT NULL DEFAULT '{}',
	CONSTRAINT pk_fbkt_db_patch PRIMARY KEY (id)
-- 	,
-- 	CONSTRAINT fbkt_db_patch_ukey UNIQUE (package_name, file_name)
);
--||--
CREATE TABLE IF NOT EXISTS ping_request
(
  id serial NOT NULL,
  uid uuid UNIQUE NOT NULL,
  request_timestamp TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT pk_ping_request_id PRIMARY KEY (id)
);
--||--
CREATE TABLE IF NOT EXISTS log_category
(
  id serial NOT NULL,
  name text NOT NULL,
  CONSTRAINT pk_log_category PRIMARY KEY (id)
);
--||--
CREATE TABLE IF NOT EXISTS log_level
(
  id serial NOT NULL,
  name text NOT NULL,
  CONSTRAINT pk_log_level PRIMARY KEY (id)
);
--||--
CREATE TABLE IF NOT EXISTS log_entry
(
  id serial NOT NULL,
  log_category_id integer NOT NULL,
  log_level_id integer NOT NULL,
  log_timestamp timestamp without time zone NOT NULL DEFAULT now(),
  source character varying(500),
  message text,
  attributes_json 		jsonb NOT NULL DEFAULT '{}',
  CONSTRAINT pk_log_entry PRIMARY KEY (id),
  CONSTRAINT fk_log_entry_level 
	  FOREIGN KEY ( log_level_id ) 
  	REFERENCES log_level( id ),
  CONSTRAINT fk_log_entry_category 
	  FOREIGN KEY ( log_category_id ) 
  	REFERENCES log_category( id )
);
--||--
CREATE TABLE IF NOT EXISTS fbkt_pipe
(
	id 									serial NOT NULL,
	name								text NOT NULL,
	uid 								uuid UNIQUE NOT NULL,
	workspace 					jsonb NOT NULL DEFAULT '{}',
	fbkt_pipe_status_id	integer NOT NULL,
	CONSTRAINT pk_fbkt_pipe PRIMARY KEY (id)
);
--||--
CREATE TABLE IF NOT EXISTS fbkt_pipe_status
(
	id 					serial NOT NULL,
	name				text NOT NULL,
	CONSTRAINT pk_fbkt_pipe_status PRIMARY KEY (id)
);
--||--
INSERT INTO fbkt_pipe_status(name) SELECT 'COMPLETE';
INSERT INTO fbkt_pipe_status(name) SELECT 'WAITING';
INSERT INTO fbkt_pipe_status(name) SELECT 'ERROR';
INSERT INTO fbkt_pipe_status(name) SELECT 'ABORTED';
--||--
CREATE TABLE IF NOT EXISTS event_listener
(
	id 												serial NOT NULL,
	event_name								text NOT NULL,
	fbkt_pipe_id								integer NOT NULL,
	created_timestamp					timestamp NOT NULL DEFAULT current_timestamp,
	expiration_timestamp			timestamp NOT NULL,
	event_timestamp						timestamp NULL,
	event_call_info 					jsonb NOT NULL DEFAULT '{}',
	CONSTRAINT pk_event_listener PRIMARY KEY (id)
);
--||--
ALTER TABLE fbkt_pipe ADD CONSTRAINT fk_fbkt_pipe_status FOREIGN KEY ( fbkt_pipe_status_id ) REFERENCES fbkt_pipe_status( id );
--||--
ALTER TABLE event_listener ADD CONSTRAINT fk_event_listener_fbkt_pipe FOREIGN KEY ( fbkt_pipe_id ) REFERENCES fbkt_pipe( id );
--||--
SELECT 'SUCCESSFULLY CONFIGURED fbkt_core_db SCHEMA' AS message;
