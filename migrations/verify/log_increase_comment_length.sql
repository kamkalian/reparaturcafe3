-- Verify reparaturcafe:log_increase_comment_length on mysql

SELECT 1
FROM information_schema.columns
WHERE table_schema = DATABASE()
  AND table_name = 'logs'
  AND column_name = 'comment'
  AND character_maximum_length = 1000;
