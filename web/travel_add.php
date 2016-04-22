<?php
$token = '';

$data = array(
    'start_dt' => array(
        'date' => '2016-05-01'
    ),
    'end_dt' => array(
        'date' => '2016-05-04'
    ),
    'description' => 'test',
    'destination' => 'test'
);

$URL = 'http://travel2.alex.dnet/api/trips';

$ch = curl_init($URL);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

curl_setopt($ch, CURLOPT_HTTPHEADER,
    array(
        'Authorization:Bearer '.$token
    )
);

$result = curl_exec($ch);
curl_close($ch);

var_dump(json_decode($result));