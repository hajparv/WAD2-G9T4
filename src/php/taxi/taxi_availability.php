<?php
function callAPI($method, $url, $data,$skip)
{
    if($skip != 0){
        $url = $url . '?$skip=' . $skip;
    }
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
        'accountkey: 5ptxG22hRBS/7/tow7/Mww==',
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


$big_list = [];
$get_data = callAPI('GET', 'http://datamall2.mytransport.sg/ltaodataservice/Taxi-Availability', false, 0);
$response = json_decode($get_data, true);
array_push($big_list,$response);
$num = 500;

while(count($response['value']) != 0){
    $get_data = callAPI('GET', 'http://datamall2.mytransport.sg/ltaodataservice/Taxi-Availability', false, $num);
    $response = json_decode($get_data, true);
    array_push($big_list,$response);
    $num += 500;
}

echo json_encode($big_list);

?>
