-- 1) Add check constraint: dataInicio >= now
ALTER TABLE "campaigns"
ADD CONSTRAINT "chk_data_inicio_gte_now"
CHECK ("dataInicio" >= NOW());

-- 2) Create function and trigger to fail insertion if dataInicio < NOW()
CREATE OR REPLACE FUNCTION campaigns_date_inicio_check()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."dataInicio" < NOW() THEN
    RAISE EXCEPTION 'Insertion failed: dataInicio (%), must be greater than or equal to now (%).', NEW."dataInicio", NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_campaigns_date_inicio_check
BEFORE INSERT
ON "campaigns"
FOR EACH ROW
EXECUTE PROCEDURE campaigns_date_inicio_check();