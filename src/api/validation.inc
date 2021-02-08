<!DOCTYPE html>
<html>
    <head>
        <link rel="shortcut icon" type="image/png" href="/assets/favicon.png" >
        <style>
            <?php require 'assets/main.css' ?>
        </style>
        <style>
            <?php require 'assets/debug.css' ?>
        </style>
        <script >
            var Queue   = [],
                project = '<?= $this->workingDir ?>';
            
        </script>
    </head>
    <body class="<?= ($totalFiles === 0 ? 'no-errors-found' : '') ?>" >
        <main>
            <nav class="main-nav" >
                <div class="wrapper flex-space-between" >
                    <span class="flex-space-between" >
                        <a href="/" class="button-icon" >
                            <img src="/assets/favicon.png" height="30px" />
                        </a>
                        <span>&nbsp;&nbsp;&nbsp;</span>
                        <span class="button-group--toggle" data-button-toggle-set="all" >
                            <a href="?all=" class="button" data-parse-auto-get="name=all; toggle" >Unstaged</a>
                            <a href="?all=1" class="button" data-parse-auto-get="name=all; value=1; toggle" >Staged</a>
                            <a href="?all=3" class="button" data-parse-auto-get="name=all; value=3; toggle; remove=all" >Full scan</a>
                        </span>
                    </span>
                    
                    <span class="button-group--toggle" data-button-toggle-set="standard" >
                        <?php if (empty($custom) === false) : ?>
                        <a href="?standard=custom" class="button" data-parse-auto-get="name=standard; value=; toggle" >Custom</a>
                        <?php endif ?>
                        <a href="?standard=PSR2" class="button" data-parse-auto-get="name=standard; value=psr2; toggle" >PSR2</a>
                        <a href="?standard=" class="button" data-parse-auto-get="name=standard; value=; toggle" >PSR12</a>
                        <a href="?standard=Pear" class="button" data-parse-auto-get="name=standard; value=Pear; toggle" >Pear</a>
                        <a href="?standard=Zend" class="button" data-parse-auto-get="name=standard; value=Zend; toggle" >Zend</a>
                        <a href="?standard=Squiz" class="button" data-parse-auto-get="name=standard; value=Squiz; toggle" >Squiz</a>
                        <a href="?standard=MySource" class="button" data-parse-auto-get="name=standard; value=MySource; toggle" >MySource</a>
                    </span>
                </div>
            </nav>
            
            <?php if ($totalFiles > 0) : ?>
            <div class="panel__data" >
                <div class="sections flex--row-wrap justify align--space-between align--space-between" >
                    <section class="card-mini cbg--green" >
                        <span><img src="assets/files.png" alt="" height="58" ></span>
                        <div>
                            <div class="card-mini__label" ><?= $totalFiles ?></div>
                            <div>Total files</div>
                        </div>
                    </section>
                    <section class="card-mini cbg--orange" >
                        <span><img src="assets/code.png" alt="" height="48" ></span>
                        <div>
                            <div class="card-mini__label" ><small class="text--uppper" ><?= $totalWarnings ?></small></div>
                            <div>Warnings</div>
                        </div>
                    </section>
                    <section class="card-mini cbg--red" >
                        <span><img src="assets/errors.png" alt="" height="58" ></span>
                        <div>
                            <div class="card-mini__label" ><?= $totalErrors ?></div>
                            <div>Errors</div>
                        </div>
                    </section>
                </div>
                
                <div class="sections" >
                    <?php foreach ($json as $fileName => $errors) : ?>
                    <section class="card--flat list-errors" id="eEnvVars" data-file="<?= $fileName ?>" >
                        <h2 class="list-errors__file" >
                            <span><?= $fileName ?></span>
                        </h2>
                        <div class="content alternate-rows" >
                            <?php foreach ($errors as $error) : ?>
                            <div class="grids list-errors__line" data-source="column=<?= $error->column ?>; source=<?= $error->source ?>" >
                                <div class="col--line" ><?= $error->line ?></div>
                                <a class="col--info" data-actions="code-viewer-show" ><?= htmlentities($error->message) ?></a>
                            </div>
                            <?php endforeach ?>
                        </div>
                    </section>
                    <?php endforeach ?>
                </div>
            </div>
            <div class="code-viewer" >
                <div class="code-viewer__contents"></div>
                <a id="eButtonCloseCodeViewer" data-actions="code-viewer-close" ><img src="assets/close.png" alt="Closes the Code's viewer panel" ></a>
            </div>
            <?php else : ?>
            <div class="message__wrapper" >
                <img src="/assets/ok.png" alt="" width="272px" >
                <p class="message__p--large" >
                    Congratulations. No errors has been found using <?= $checkType ?> files.
                </p>
            </div>
            <?php endif ?>
        </main>
        <script src="assets/main.js" async defer></script>
        <script src="assets/actions.js" async defer></script>
    </body>
</html>
