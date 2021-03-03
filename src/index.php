<?php

error_reporting(E_ALL);
ini_set('display_errors', 'on');
define('ROOT', dirname(__DIR__));

$instance = new class
{

    /**
     * Diretório de projeto.
     *
     * @var string.
     */
    private $workingDir = '/host';


    /**
     * Verifica as rotas.
     */
    public function __construct()
    {
        $this->systemCheckup();

        if (isset($_GET['project']) === true) {
            $this->workingDir = $this->workingDir . '/' . urldecode($_GET['project']);
            $this->processValidationPage();
        } else {
            $this->processProjectsPage();
        }
    }


    /**
     * Caso o assert seja TRUE, a página de erro será exibida.
     *
     * @param boolean $assert  Validação true ou false.
     * @param string  $message Mensagem de exibição, em caso de erro.
     *
     * @return void.
     */
    private function dieIfFail(bool $assert, string $message): void
    {
        if ($assert === true) {
            include 'api/error.inc';
            exit;
        }
    }


    /**
     * Controla a página de erros.
     *
     * @return void.
     */
    private function processValidationPage(): void
    {
        $standard  = 'psr12';
        $root      = realpath(dirname(__DIR__));
        $hasCustom = (file_exists("{$this->workingDir}/phpcs.xml") === false);
        $options   = [];

        if (empty($_GET['standard']) === false) {
            switch (strtolower($_GET['standard'])) {
                case 'custom':
                    $options['standard'] = '';
                    break;
                case 'mysource':
                case 'pear':
                case 'psr2':
                case 'psr12':
                case 'squiz':
                case 'zend':
                    $options['standard'] = '--standard=' . $_GET['standard'];
                    break;
                default:
                    $options['standard'] = '--standard=psr12';
                    break;
            }
        }

        $checkType = '';
        if (isset($_GET['all']) === false) {
            $options['all'] = '';
            $checkType = 'unstaged';
        } elseif ($_GET['all'] === '3') {
            $options['all'] = '--fullscan';
            $checkType = 'fullscan';
        } elseif ($_GET['all'] === '2') {
            $options['all'] = '--diff-cached';
            $checkType = 'staged';
        } elseif ($_GET['all'] === '1') {
            $options['all'] = '--all';
            $checkType = 'staged';
        }

        if (isset($_GET['diff-cached']) === true) {
            $options['diff-cached'] = '--diff-cached';
        }

        $options       = join(' ', $options);
        $command       = "/var/www/html/super-giggle/bin/super-giggle --warning-severity=5 $options --json --diff --repo={$this->workingDir} --phpcs=/var/www/html/phpcs/bin/phpcs";
        $result        = shell_exec($command);
        $json          = (json_decode($result) ?? []);
        $totalWarnings = 0;
        $totalErrors   = 0;
        $totalFiles    = 0;
        foreach ($json as $fileName => $occurrences) {
            foreach ($occurrences as $occurrence) {
                if ($occurrence->type === 'ERROR') {
                    $totalErrors++;
                } else {
                    $totalWarnings++;
                }
            }

            $totalFiles++;
        }

        include 'api/validation.inc';
    }


    /**
     * Processa a página de exibição dos projetos.
     *
     * @return void.
     */
    private function processProjectsPage(): void
    {
        $projects = $this->searchProjects();
        include 'api/projects.inc';
    }


    /**
     * Vasculha todo o diretório $workingDir em busca de projetos git.
     *
     * @return array.
     */
    private function searchProjects(): array
    {
        $files    = [];
        $root     = $this->workingDir;
        $projects = new \RegexIterator(
            new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator("$root/"),
                null,
                \RecursiveIteratorIterator::CATCH_GET_CHILD
            ),
            '/\.git\/\.$/i'
        );
        $json     = [];
        foreach ($projects as $path) {
            if (empty($path) === true) {
                continue;
            }

            $name     = substr($path, strlen($root) + strpos("/$path", '/') + 1, -7);
            $dir      = substr($path, 0, -7);
            $relative = substr($dir, strlen($root) + 1);
            preg_match("/(.*)\/\.git$/", $name, $match);

            $total = [
                'files' => 0,
                'php'   => 0,
                'js'    => 0,
                'css'   => 0,
                'html'  => 0,
            ];
            foreach ((new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator("$dir"))) as $pointer) {
                if ($pointer->isDir() === true) {
                    continue;
                }

                $total['files']++;
                if (str_ends_with($pointer->getFilename(), '.php') === true) {
                    $total['php']++;
                } elseif (str_ends_with($pointer->getFilename(), '.js') === true) {
                    $total['js']++;
                } elseif (str_ends_with($pointer->getFilename(), '.css') === true) {
                    $total['css']++;
                } elseif (str_ends_with($pointer->getFilename(), '.html') === true || str_ends_with($pointer->getFilename(), '.htm') === true) {
                    $total['html']++;
                }
            }

            // Single project.
            if (empty($name) === true) {
                $name     = 'Home';
                $relative = './';
            }

            $json[$dir] = [
                'name'     => $name,
                'dir'      => $dir,
                'relative' => $relative,
                'total'    => [
                    'files' => $total['files'],
                    'php'   => $total['php'],
                    'js'    => $total['js'],
                    'css'   => $total['css'],
                    'html'  => $total['html'],
                ]
            ];
        }

        return $json;
    }


    /**
     * Valida as condições do sistema. Em caso de erro, um warning será exibido na tela.
     *
     * @return void.
     */
    private function systemCheckup(): void
    {
        $this->dieIfFail(is_readable($this->workingDir) === false, 'Working dir is unreadable! Please, give proper permissions to read the working project.');
    }
};
