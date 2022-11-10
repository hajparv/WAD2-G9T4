<?php
function callAPI($method, $url, $data)
{
    $curl = curl_init();
    switch ($method) {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);
            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
        default:
            if ($data)
                $url = sprintf("%s?%s", $url, http_build_query($data));
    }
    // OPTIONS:
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
        'accountkey: 3+qMwmsMR1+Y4uxlex3DvA==',
        'Content-Type: application/json',
    ));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    // EXECUTE:
    $result = curl_exec($curl);
    if (!$result) {
        die("Connection Failure");
    }
    curl_close($curl);
    return $result;
}


$url = '';
$code = '';
$service = '';
if($_GET['BusStopCode'] != ''){
    $code = $_GET['BusStopCode'];
    $url = 'http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=' . $code;
}

if($_GET['ServiceNo'] == 'a'){
    $code = $_GET['BusStopCode'];
    $url = 'http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=' . $code;
}else{
    $service = $_GET['ServiceNo'];
    $url = 'http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=' . $code . "&ServiceNo=" . $service;
}






// var_dump($url);

$big_list = []; 
$get_data = callAPI('GET', $url, false);
$response = json_decode($get_data, true);

// var_dump($response);
echo json_encode($response);
?>