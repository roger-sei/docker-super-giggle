FROM php:8-apache-buster

EXPOSE 80 8120

COPY composer-setup.php /tmp/composer-setup.php
COPY src /var/www/html
COPY bin/check-changes /bin/check-changes
COPY bin/check-staged /bin/check-staged
COPY bin/fullscan /bin/fullscan
COPY bin/super-giggle /bin/super-giggle
COPY bin/super-giggle /bin/sg

RUN apt update \
    && apt install -y libzip-dev libcurl4-openssl-dev unzip git \
    && docker-php-ext-install zip \
    && mkdir /host \
    && php /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && rm /tmp/composer-setup.php \
    && composer global require roger-sei/super-giggle:1.0.3 \
    && mv /root/.composer/vendor/roger-sei/super-giggle /var/www/html/super-giggle \
    && mv /root/.composer/vendor/squizlabs/php_codesniffer /var/www/html/phpcs \
    && apt install apache2 \
    && mkdir -p /etc/apache2/sites-enabled/ \
    && mv /usr/local/etc/php/php.ini-development /usr/local/etc/php/php.ini \
    && echo 'memory_limit = 512M' >> /usr/local/etc/php/php.ini \
    && echo "<VirtualHost *:80>\n    ServerAdmin webmaster@localhost\n    DocumentRoot /var/www/html\n</VirtualHost>" > /etc/apache2/sites-enabled/000-default.conf \
    && unlink /var/log/apache2/access.log \
    && echo '' > /var/log/apache2/access.log \
    && unlink /var/log/apache2/error.log \
    && ln -s /dev/stdout /var/log/apache2/error.log

VOLUME /host

WORKDIR /host

#ENTRYPOINT ["/bin/super-giggle"]