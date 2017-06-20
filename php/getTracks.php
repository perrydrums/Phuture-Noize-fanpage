<?php

//First get credentials
$client_id = "f90bba51828e493d8e43f63043459ed9";
$client_secret = "86bcc46ffa7043a397f69c2a3a4db930";

//Credentials must be send like this!
$credentials = $client_id . ":" . $client_secret;
$headers = array("Authorization: Basic " . base64_encode($credentials));

//URL to get OAUTH TOKEN
$url = "https://accounts.spotify.com/api/token";
$data = 'grant_type=client_credentials'; //Only non-user related requests

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
       curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
       curl_setopt($ch, CURLOPT_POST, 1);
       curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
       curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
       $response = json_decode(curl_exec($ch), true);
       curl_close($ch);

//ACCESS TOKEN NEEDED FOR ALL REQUESTS :(
$access_token = $response["access_token"];


//main.js sends albumid, get all info about album with GET[albumid]
if(isset($_GET['albumid'])){

    $albumID = $_GET['albumid'];

    $url = "https://api.spotify.com/v1/albums/" . $albumID . "?access_token=" . $access_token;

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // $album = json_decode(curl_exec($ch), true);

    $album = curl_exec($ch);
    print_r($album);

    curl_close($ch);

}else{ //No albumid received? Send back all album ID's from artist Phuture Noize

    $url = "https://api.spotify.com/v1/artists/7AGSJihqYPhYy5QzMcwcQT/albums?access_token=" . $access_token;

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
           curl_setopt($ch, CURLOPT_POST, 0);
           curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        //    $response = curl_exec($ch);

           $response = json_decode(curl_exec($ch), true);
           curl_close($ch);

        //    print_r($response);

    $albumIDs = array();

    for($i = 0; $i < $response['total']; $i++){

        error_reporting(0); //just some warnings, no biggie (COMMENT IF EDITING TILL error_reporting(E_ALL))

        //NOT albumID 1, Counting this album will show the album twice. Has something to do with the Japanese.
        if($response['items'][$i]['album_type'] == "album" && $i != 1){
            array_push($albumIDs, $response['items'][$i]['id']);
        }

        error_reporting(E_ALL);

    }

    print_r(json_encode($albumIDs));
    $albumIDs = array();

}
