yarn add express
yarn add @types/express nodemon ts-node typescript --dev
yarn add webpack webpack-cli --dev



opkg install pgsql-server pgsql-cli pgsql-cli-extra
adduser postgres
mkdir -p /opt/var/pgsql/data
chown -R postgres:postgres /opt/var/pgsql
su - postgres -c 'pg_ctl initdb -D /opt/var/pgsql/data'

/opt/var/pgsql/data/postgresql.conf
    listen_addresses = '*'
/opt/var/pgsql/data/pg_hba.conf
    host all all 192.168.2.1/16 password

pg_ctl -D /opt/var/pgsql/data -l /opt/var/pgsql/pgsql.log start

su - postgres
psql
CREATE USER pgadmin WITH PASSWORD 'password';
CREATE DATABASE fin_rebalancer_db;
GRANT ALL PRIVILEGES ON DATABASE fin_rebalancer_db to pgadmin;



yarn add prisma --dev
yarn prisma
yarn prisma init
yarn prisma db pull

yarn add @prisma/client
yarn prisma generate