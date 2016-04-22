travel
======

1) Set up virtual host

<VirtualHost *:80>
    ServerAdmin webmaster@dummy-host.example.com
    DocumentRoot "/samsung1/apache/deehost.dnet/htdocs/toptal_test/web"
    ServerName travel.deehost.dnet
    ServerAlias travel.deehost.dnet
    ErrorLog "/samsung1/apache/deehost.dnet/logs/travel_error_log"
    CustomLog "/samsung1/apache/deehost.dnet/logs/travel_access_log" common

    <Directory "/samsung1/apache/deehost.dnet/htdocs/toptal_test/web">
        AllowOverride All
        DirectoryIndex index.php index.html
        Options Indexes FollowSymLinks
        Require all granted

  <IfModule mod_rewrite.c>
      Options -MultiViews
      RewriteEngine On
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteRule ^(.*)$ app.php [QSA,L]
      #RewriteRule ^(.*)$ app_dev.php [QSA,L]
  </IfModule>

    </Directory>
</VirtualHost>

2) Checkout from git ssh://git@adevukr.dnet/toptal_test.git

3) Run $./composer.phar install

4) Create DB and run - $php bin/console doctrine:schema:update --force

5) Change dir to web/app - $cd web/app
   Run - $bower install

