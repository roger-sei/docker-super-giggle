<!DOCTYPE html>
<html>
    <head>
        <link rel="shortcut icon" type="image/png" href="/assets/favicon.png" >
        <style>
            <?php require 'assets/main.css' ?>
        </style>
        <style>
            body {
                background: #2f404e;
            }
            .card {
                background: #fff;
                box-sizing: border-box;
                color: #464646;
                flex: 0 0 calc(33% - 2em);
                margin: 1em;
                overflow: hidden;
                padding: .75em;
                transition: all 0.2s ease 0s;
            }
                .card strong {
                    font-size: 1.2em;
                    letter-spacing: 1px;
                    margin-bottom: .25em;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-transform: uppercase;
                    white-space: nowrap;
                }
                .card:hover {
                    background: #4288ce;
                    color: #fff;
                    text-decoration: none;
                }
            .card__col-name {
                font-weight: bold;
                margin-right: 1em;
                width: 60px;
            }
            .card__col-value {
                
            }
            .card__row {
                display: flex;
            }
            .card__wrapper {
                border: 1px solid #b5b5b5;
                box-sizing: border-box;
                display: flex;
                flex: 0 1;
                flex-flow: column;
                overflow: hidden;
                padding: .75em;
            }
                .card:hover .card__wrapper {
                    border-color: #bcf2bc;
                }
            h1 {
                color: #fff;
            }
        </style>
        <script >
            var Queue = [];
        </script>
    </head>
    <body>
        <main>
            <div class="wrapper" >
                <h1>
                    <span>Projects</span>
                </h1>
                <nav class="sections flex--row-wrap" >
                    <?php foreach ($projects as $project): ?>
                    <a class="card" href="?project=<?= urlencode($project['relative']) ?>" >
                        <span class="card__wrapper" >
                            <strong><?= $project['name'] ?></strong>
                            <span class="card__row" >
                                <span class="card__col-name" >Path</span>
                                <span class="card__col-value" ><?= $project['relative'] ?></span>
                            </span>
                            <span class="card__row" >
                                <span class="card__col-name" >Files</span>
                                <span class="card__col-value" ><?= $project['total']['files'] ?></span>
                            </span>
                            <span class="card__row" >
                                <span class="card__col-name" >PHP</span>
                                <span class="card__col-value" ><?= $project['total']['php'] ?></span>
                            </span>
                            <span class="card__row" >
                                <span class="card__col-name" >JS</span>
                                <span class="card__col-value" ><?= $project['total']['js'] ?></span>
                            </span>
                            <span class="card__row" >
                                <span class="card__col-name" >CSS</span>
                                <span class="card__col-value" ><?= $project['total']['css'] ?></span>
                            </span>
                            <span class="card__row" >
                                <span class="card__col-name" >HTML</span>
                                <span class="card__col-value" ><?= $project['total']['html'] ?></span>
                            </span>
                        </span>
                    </a>
                    <?php endforeach ?>
                </nav>
            </div>
        </main>
        <script src="assets/main.js" async defer></script>
        <script src="assets/actions.js" async defer></script>
    </body>
</html>
