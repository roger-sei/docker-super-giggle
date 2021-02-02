# README

Super-Giggle allows you to visualize code violations using modern code conventions.
You can filter the results checking only the last changes or the whole project and choose **PSR12**, **Pear**, **Zend** and others code conventions.



### Instructions:

Run the following container inside your working project:

```
docker container run --rm --name rogersei/super-giggle --publish=8120:80 --volume=$(pwd):/var/www/html img-teste
```


Access your browser in the following address http://localhost:8120



