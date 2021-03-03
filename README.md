## Visual wrapper for Super Giggle and PHPCS

![GitHub top language](https://img.shields.io/github/languages/top/roger-sei/docker-super-giggle?style=for-the-badge)
![GitHub](https://img.shields.io/github/license/roger-sei/docker-super-giggle?style=for-the-badge)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/roger-sei/docker-super-giggle?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/roger-sei/docker-super-giggle?style=for-the-badge)



Super-Giggle allows you to visualize code violations using modern code conventions.
Filter results checking only the last changes, unstaged files or a full scan in the project and choose **PSR12**, **Pear**, **Zend** among others popular code conventions.

![Super Giggle Demo](https://roger-sei.github.io/assets/visual-demo.gif)



## Usage

Run the following container inside your working project:

```
docker container run --rm -p8120:80 -v$(pwd):/host rogersei/super-giggle
```

Access your browser in the following address http://localhost:8120



### Check as bash command

Use check-changes to analyse the modified files in the working directory:
```
docker container run --rm -v$(pwd):/host rogersei/super-giggle check-changes
```

Or, to perform a pre-commit:
```
docker container run --rm -v$(pwd):/host rogersei/super-giggle check-staged
```

Even a fullscan:
```
docker container run --rm -v$(pwd):/host rogersei/super-giggle fullscan
```



### Using another standart, other than PSR12

```
docker container run --rm -v$(pwd):/host rogersei/super-giggle nn --standard=zend
docker container run --rm -v$(pwd):/host rogersei/super-giggle fullscan --standard=pear
```



### Warning
Super Giggle is a PHPCS wrapper, which uses JSON format and loads a report in memory. Full scan option, in a large project, requires a huge amount of memory and may take a couple minutes to complete.
