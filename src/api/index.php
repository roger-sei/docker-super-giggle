<?php

$file = ($_GET['file'] ?? null);

if (empty($file) === true) {
    die('Missing "file" parameter!');
}

if (empty($_GET['project']) === false) {
    $fullpath = realpath("{$_GET['project']}/$file");
} else {
    $fullpath = realpath("/host/$file");
}

if (strpos($fullpath, '/host/') === false) {
    die("Invalid path!");
} elseif (file_exists($fullpath) === false) {
    die("File \"$file\" not found!");
} elseif (is_readable($fullpath) === false) {
    die("Cannot read file \"$file\"!");
}

$contents = file_get_contents($fullpath);
$lines    = explode(PHP_EOL, $contents);
$html     = [];

foreach ($lines as $number => $content) {
    $number++;
    $content = htmlspecialchars($content);
    $content = str_replace(
        [
            "\n"
        ],
        [
            '<span class=="span-tab"  >&nbsp;</span>'
        ],
        $content
    );
    $html[]  = "<div><span class='span-number'>$number.</span> $content</div>";
}

echo join(PHP_EOL, $html);
