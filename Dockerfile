FROM php:8.0.1-apache-buster

EXPOSE 80 8110

COPY composer-setup.php /tmp/composer-setup.php
COPY src /var/www/manager/

RUN apt update \
    && apt install -y libzip-dev libcurl4-openssl-dev unzip git \
    && docker-php-ext-install curl zip \
    && mkdir -p /var/www/html \
    && mkdir -p /var/www/manager \
    && php /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && rm /tmp/composer-setup.php \
    && composer global require roger-sei/super-giggle:0.6.2 \
    && mv /root/.composer/vendor/roger-sei/super-giggle /var/www/manager/super-giggle \
    && mv /root/.composer/vendor/squizlabs/php_codesniffer /var/www/manager/phpcs \
    && apt install apache2 \
    && mkdir -p /etc/apache2/sites-enabled/ \
    && echo "<VirtualHost *:80>\n    ServerAdmin webmaster@localhost\n    DocumentRoot /var/www/manager\n</VirtualHost>" > /etc/apache2/sites-enabled/000-default.conf \
    && apachectl restart

VOLUME /var/www/html
