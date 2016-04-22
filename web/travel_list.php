<?php
$token = '';

$data = array(
    'length' => 20,
    'start' => 0,
    'start_dt_filter_check' => true,
    'start_dt_filter_cond' => '=',
    'start_dt_filter_value' => '2016-04-22'
);

$URL = 'http://travel2.alex.dnet/api/trips?'.http_build_query($data);

$ch = curl_init($URL);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");

curl_setopt($ch, CURLOPT_HTTPHEADER,
    array(
        'Authorization:Bearer '.$token
    )
);

$result = curl_exec($ch);
curl_close($ch);