FROM php:8.0.3-fpm-alpine3.13

EXPOSE 8120

COPY composer-setup.php /tmp/composer-setup.php
COPY src /var/www/html
COPY bin/check-changes /bin/check-changes
COPY bin/check-staged /bin/check-staged
COPY bin/fullscan /bin/fullscan
COPY bin/super-giggle /bin/super-giggle
COPY bin/sg /bin/sg

RUN apk add git \
    && mkdir /host \
    && php /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && rm /tmp/composer-setup.php \
    && composer global require roger-sei/super-giggle:1.0.3 \
    && mv /root/.composer/vendor/roger-sei/super-giggle /var/www/html/super-giggle \
    && mv /root/.composer/vendor/squizlabs/php_codesniffer /var/www/html/phpcs \
    && echo 'memory_limit = 512M' >> /usr/local/etc/php/php.ini

ENTRYPOINT ["php", "-S", "0.0.0.0:8120", "-t", "/var/www/html"]
