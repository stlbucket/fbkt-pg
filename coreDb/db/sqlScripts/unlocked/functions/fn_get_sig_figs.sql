SET search_path TO fbkt_core_db, public;
-- Function: fn_get_sig_figs(text)

DROP FUNCTION IF EXISTS fn_get_sig_figs(text) CASCADE;

CREATE FUNCTION fn_get_sig_figs(val text)
  RETURNS integer AS
$BODY$

DECLARE sigfigs integer;
declare pos integer;
declare s text;
declare negflag boolean;


BEGIN
		s = val;
		 if left(val,1) = '-' then --if there's a neg sign then remove it
			 s = right(val,length(val)-1);
			 negflag = true;  --don't need this flag but might be handy later
			else
			 negflag = false;
			end if;

     pos = position('.' in val); --check if there's a decimal
     if pos = 0 then  --if there's no decimal then...
				while right(s,1) = '0' loop  --and there's trailing zeros
					s = left(s,length(s) -1);   --remove the trailing zeros until you hit another digit
				end loop;
				sigfigs = length(s);  -- the count of the remaining digits is the num of sig figs
		 end if;
		 if pos > 0 and left(s,1) = '0' then
			sigfigs = length(s)-2;  -- if there is a decimal and the number is < 1 then count the number of characters and subtract 2 to account for the decimal and the leading zero.
		 end if;
		 if pos > 0 and left(s,1) <> '0' then  --if there's a decimal and the number >1 the count the nubmer of characters and subtract 1 to account for the decimal
			sigfigs = length(s)-1;
		 end if;
		
    RETURN sigfigs;
END;
$BODY$
  LANGUAGE plpgsql IMMUTABLE
  COST 100;
--||--
SELECT 'SUCCESSFULLY CREATED fn_get_sig_figs' AS message;
