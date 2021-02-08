## Visual wrapper for Super Giggle and PHPCS

![GitHub top language](https://img.shields.io/github/languages/top/roger-sei/docker-super-giggle?style=for-the-badge)
![GitHub](https://img.shields.io/github/license/roger-sei/docker-super-giggle?style=for-the-badge)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/roger-sei/docker-super-giggle?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/roger-sei/docker-super-giggle?style=for-the-badge)

Super-Giggle allows you to visualize code violations using modern code conventions.
Filter results checking only the last changes, unstaged files or a full scan in the project and choose **PSR12**, **Pear**, **Zend** among others popular code conventions.

![Super Giggle Demo](https://roger-sei.github.io/assets/visual-demo.gif)


### Instructions:

Run the following container inside your working project:

```
docker container run --rm --publish=8120:80 --volume=$(pwd):/var/www/html rogersei/super-giggle
```

Access your browser in the following address http://localhost:8120



### Warning
Be aware Super Giggle is a PHPCS wrapper, using JSON format, which requires the full report to be in memory. Full scan option requires a huge amount of memory available and may take a couple minutes to finish it.
