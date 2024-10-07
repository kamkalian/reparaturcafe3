-- Verify reparaturcafe:oskar on mysql

BEGIN;

SELECT sqitch.checkit(COUNT(*), 'User "oskar" does not exists')
FROM mysql.user WHERE user = "oskar"
