SET search_path TO fbkt_core_db, public;

drop function if exists fn_sig_figs (result text, sigfigs integer) CASCADE;
--trims a number to the specified number of significant figures
create function fn_sig_figs (result text, sigfigs integer) 
returns text as $$

DECLARE val numeric;
declare sigResult text;  --converted result
declare n  integer;  --number of places

BEGIN
		if result = '0' then --can't calc log of zero(0) so assign zero in this case
			val = 0;
		else
			val = result::numeric;   --convert the input string to numeric
			val = round(val,sigfigs-1-floor(log(abs(val)))::integer);

		end if;
		
    RETURN val;
END;
$$
LANGUAGE 'plpgsql' IMMUTABLE;

--||--
SELECT 'SUCCESSFULLY CREATED fn_sig_figs' AS message;
