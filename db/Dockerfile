FROM postgres:10.11
RUN apt-get update
RUN apt-get -y install curl ca-certificates gnupg
RUN curl -s https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN echo "deb http://apt.postgresql.org/pub/repos/apt stretch-pgdg main" > /etc/apt/sources.list.d/pgdg.list
RUN apt-get update
RUN apt-get -y install postgresql-10-postgis-2.4
RUN mkdir -p /data/flood_tables ; chown -R postgres:postgres /data/flood_tables
RUN mkdir -p /data/flood_indexes ; chown -R postgres:postgres /data/flood_indexes
