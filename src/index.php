<?php
$standard = 'psr12';
$root     = realpath(dirname(__DIR__));
$custom   = '/var/www/html/phpcs.xml';
if (file_exists($custom) === false) {
    $custom = $standard;
}

$options = [];

if (empty($_GET['standard']) === false) {
    switch(strtolower($_GET['standard'])) {
    case 'custom':
        $standard = $custom;
    break;
    case 'mysource':
    case 'pear':
    case 'psr2':
    case 'psr12':
    case 'squiz':
    case 'zend':
        $standard = strtolower($_GET['standard']);
    break;
    default:
        $standard = 'psr12';
    break;
    }

    $options['standard'] = "--standard=$standard";
}

(function() use (&$options) {
    foreach(['all',] as $arg) {
        if (isset($_GET[$arg]) === true) {
            $options[$arg] = "--$arg";
        } else {
            $options[$arg] = '';
        }
    }
})();
$options = join(' ', $options);
$command = "/var/www/manager/super-giggle/bin/super-giggle $options --json --diff --repo=/var/www/html --phpcs=/var/www/manager/phpcs/bin/phpcs";
$result  = shell_exec($command);
$json    = (json_decode($result) ?? []);
?><!DOCTYPE html>
<html>
    <head>
        <style>
            <?php require 'assets/main.css' ?>
        </style>
        
        <script >
            var Queue = [];
        </script>
    </head>
    <body>
        <main>
            <nav>
                <div class="col" >
                    <span class="button-group--toggle margin-bottom--1em" data-button-toggle-set="all" >
                        <a href="?all=" class="button" data-parse-auto-get="name=all; toggle" >Last commit</a>
                        <a href="?all=1" class="button" data-parse-auto-get="name=all; value=1; toggle" >Whole file</a>
                    </span>
                </div>
                
                <div class="col" >
                    <span class="button-group--toggle" data-button-toggle-set="standard" >
                        <?php if (empty($custom) === false) : ?>
                        <a href="?standard=" class="button" data-parse-auto-get="name=standard; value=; toggle" >Custom</a>
                        <?php endif ?>
                        <a href="?standard=PSR2" class="button" data-parse-auto-get="name=standard; value=psr2; toggle" >PSR2</a>
                        <a href="?standard=PSR12" class="button" data-parse-auto-get="name=standard; value=PSR12; toggle" >PSR12</a>
                        <a href="?standard=Pear" class="button" data-parse-auto-get="name=standard; value=Pear; toggle" >Pear</a>
                        <a href="?standard=Zend" class="button" data-parse-auto-get="name=standard; value=Zend; toggle" >Zend</a>
                        <a href="?standard=Squiz" class="button" data-parse-auto-get="name=standard; value=Squiz; toggle" >Squiz</a>
                        <a href="?standard=MySource" class="button" data-parse-auto-get="name=standard; value=MySource; toggle" >MySource</a>
                    </span>
                </div>
            </nav>
            
            <div class="sections" >
                <?php foreach ($json as $fileName => $errors) : ?>
                <section class="card--flat" id="eEnvVars" >
                    <h2>
                        <span><?= $fileName ?></span>
                    </h2>
                    <div class="content alternate-rows" >
                        <?php foreach ($errors as $error) : ?>
                        <div class="grids" data-source="Column: <?= $error->column ?>; Source: <?= $error->source ?>" >
                            <div class="col--line" ><?= $error->line ?></div>
                            <div class="col--info" ><?= htmlentities($error->message) ?></div>
                        </div>
                        <?php endforeach ?>
                    </div>
                </section>
                <?php endforeach ?>
        </main>
        
        <script src="assets/main.js" async defer></script>
    </body>
</html>
