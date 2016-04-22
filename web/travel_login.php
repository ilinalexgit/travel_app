<?php
$data = array(
    'username' => 'alex3',
    'password' => '12345'
);

$URL = 'http://travel2.alex.dnet/api/login_check';


$ch = curl_init($URL);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

curl_setopt($ch, CURLOPT_HTTPHEADER,
    array(
    )
);

$result = curl_exec($ch);
curl_close($ch);

var_dump(json_decode($result));