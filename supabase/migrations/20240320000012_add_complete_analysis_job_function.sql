CREATE OR REPLACE FUNCTION complete_analysis_job(
  p_job_id UUID,
  p_user_id UUID,
  p_trading_account_id UUID,
  p_session_date DATE,
  p_analysis JSONB,
  p_model TEXT
) RETURNS void AS $$
BEGIN
  -- Start transaction
  BEGIN
    -- Insert analysis results
    INSERT INTO trade_analysis (
      user_id,
      trading_account_id,
      session_date,
      analysis,
      model,
      created_at
    ) VALUES (
      p_user_id,
      p_trading_account_id,
      p_session_date,
      p_analysis,
      p_model,
      NOW()
    );

    -- Update job status
    UPDATE analysis_jobs
    SET 
      status = 'completed',
      completed_at = NOW()
    WHERE 
      id = p_job_id AND
      status = 'processing';

    -- If no rows were updated, the job was already completed or failed
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Job % was not in processing state', p_job_id;
    END IF;

    -- Commit transaction
    COMMIT;
  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback transaction on error
      ROLLBACK;
      RAISE;
  END;
END;
$$ LANGUAGE plpgsql; 