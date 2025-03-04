-- 1) Add check constraint: dataFim > dataInicio
ALTER TABLE "campaigns"
ADD CONSTRAINT "chk_data_fim_gt_data_inicio"
CHECK ("dataFim" > "dataInicio");

-- 2) Create function and trigger to update status if dataFim < NOW()
CREATE OR REPLACE FUNCTION campaigns_expira_check()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."dataFim" < NOW() THEN
    NEW."status" := 'expirada';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_campaigns_expira_check
BEFORE INSERT OR UPDATE
ON "campaigns"
FOR EACH ROW
EXECUTE PROCEDURE campaigns_expira_check();