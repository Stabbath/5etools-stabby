# Switch to lighter base image (code only) to prevent server overload
# We will copy the local images instead
FROM ghcr.io/5etools-mirror-3/5etools:latest

COPY . /var/www/localhost/htdocs/
