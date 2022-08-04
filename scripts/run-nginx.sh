#!/bin/sh
cp /usr/share/nginx/config/config.template.json /var/www/config.json
for var in $(printenv); do
    a=${var%%=*}
    b=${var##*=}
    sed -i "s|${a}|${b}|g" /var/www/config.json
done
nginx -g "daemon off;"
