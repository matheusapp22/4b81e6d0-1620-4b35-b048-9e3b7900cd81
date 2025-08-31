-- Check for views with SECURITY DEFINER and drop them if they exist
DO $$
DECLARE
    view_record RECORD;
BEGIN
    -- Check for any SECURITY DEFINER views that might exist
    FOR view_record IN 
        SELECT schemaname, viewname
        FROM pg_views 
        WHERE schemaname = 'public'
        AND definition ILIKE '%SECURITY DEFINER%'
    LOOP
        EXECUTE format('DROP VIEW IF EXISTS %I.%I CASCADE', view_record.schemaname, view_record.viewname);
        RAISE NOTICE 'Dropped security definer view: %.%', view_record.schemaname, view_record.viewname;
    END LOOP;
END $$;