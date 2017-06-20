//Create global variables
var element = document.getElementsByClassName('readMoreBio');
var photo = document.getElementById('headshotSmall');
var player = document.getElementById('playerSmallScreen');
var albumIDs = [];

//Set the default display values (for showHidePhoto and readMore)
window.addEventListener('load', function(){
    element[0].style.display = 'none';
    element[1].style.display = 'none';
    photo.style.display = 'inline';
    player.style.display = 'none';
});

//Swap between photo and Soundcloud player (when in smallest screen size)
function showHidePhoto(){

    event.preventDefault();

    if(photo.style.display == 'none'){
        document.getElementById("showHidePhoto").innerHTML = 'Show music player';
        photo.style.display = 'inline';
        player.style.display = 'none';
    }else{
        document.getElementById("showHidePhoto").innerHTML = 'Show photo';
        photo.style.display = 'none';
        player.style.display = 'inline';
    }
}

//Read more function for the Biography section
function readMoreBio(){

    event.preventDefault();

    if(element[0].style.display == 'none' || element[1].style.display == 'none'){
        document.getElementsByClassName('readMoreLink')[0].innerHTML = 'Read less';
        document.getElementsByClassName('readMoreLink')[1].innerHTML = 'Read less';
        element[0].style.display = 'inline';
        element[1].style.display = 'inline';
    }else{
        document.getElementsByClassName('readMoreLink')[0].innerHTML = 'Read more...';
        document.getElementsByClassName('readMoreLink')[1].innerHTML = 'Read more...';
        element[0].style.display = 'none';
        element[1].style.display = 'none';
    }

}


//Get array with albumIDs from getTracks.php
function getAlbumID(){

    reqwest({
        url: 'php/getTracks.php',
        type: 'json',
        method: 'get',
        contentType: 'application/json',

        error: function (err) { console.log("error"); },
        success: getAlbum
    });

}

//Send back one albumID at the time and retrieve album info
function getAlbum(response){

    for(var i = 0; i < response.length; i++){
        reqwest({
            url: 'php/getTracks.php?albumid=' + response[i],
            type: 'json',
            method: 'get',
            contentType: 'application/json',
            success: showTracks
        });
    }

    //Clear wrapper div to remove "loading" image
    document.getElementById("wrapper").innerHTML = "";

}

//Display the albuminfo and tracklist on page
function showTracks(response){

    var albumInfo = document.createElement("div");
    albumInfo.setAttribute("id", response.id);
    document.getElementById("wrapper").appendChild(albumInfo);

    var albumTitle = document.createElement("div");
    var albumTitleText = document.createTextNode(response.name);
    albumTitle.appendChild(albumTitleText);
    albumTitle.setAttribute("class", "albumTitle");
    albumInfo.appendChild(albumTitle);

    var trackList = document.createElement("ul");
    trackList.setAttribute("class", "tracks");
    albumInfo.appendChild(trackList);


    for(var i = 0; i < response.tracks.total; i++){

        var trackName = document.createTextNode(response.tracks.items[i].name);
        var listItem = document.createElement("li");
        listItem.appendChild(trackName);
        trackList.appendChild(listItem);

    }
}
