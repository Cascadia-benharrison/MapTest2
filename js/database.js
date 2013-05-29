var song,songList; 
var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
// wait until the device is ready
document.addEventListener("deviceready", onDeviceReady, false);
// Cordova is ready
//
function onDeviceReady() {
	console.log("device ready");
	var db = window.openDatabase("StateTuning", "1.0", "StateTuning", 200000);
	db.transaction(setUpDB, errorCB, successCB);

	$('.likeButton').click(function () {
		song = $(this).parent().data('song');
		//state = $('#state').data('state');

		db.transaction(likeSongDB, errorCB, successCB);
		$.ajax({
			url: "http://216.186.69.45/services/like_tune/" + song,
			type: 'PUT',
			success: function (response) {
				console.log('PUT Completed');
			}
		})
		 if (deviceType == 'Android') {
			 $(this).attr("src",'/android_asset/www/images/redHeart.png');
		}
		else {
			$(this).attr("src",'images/redHeart.png');
		}
		
	});
}


        function setUpDB(tx) {
            tx.executeSql('DROP TABLE IF EXISTS StateTuning'); // for testing purposes. remove from final product!
            tx.executeSql('CREATE TABLE IF NOT EXISTS StateTuning (id INTEGER primary key, state, song)'); //Creating the table of it doesn't exist
        }


        //
        function likeSongDB(tx) {
            console.log('INSERT INTO StateTuning (state, song) VALUES ("' + state + '", "' + song + '")');
            tx.executeSql('INSERT INTO StateTuning (state, song) VALUES ("' + state + '", "' + song + '")'); //Inserting two records for testing

        }
        // Query all of the database
        //
        function queryDB(tx) {
            tx.executeSql('SELECT * FROM StateTuning', [], querySuccess, errorCB); // Quering the data
        }

        // Query the success callback
        //
        function querySuccess(tx, results) {
            var len = results.rows.length;
            console.log("StateTuning table: " + len + " rows found.");
            for (var i = 0; i < len; i++) {
                console.log("Row = " + i + " ID = " + results.rows.item(i).id + " State =  " + results.rows.item(i).state + " Song = " + results.rows.item(i).song);
            }
        }

        // Transaction error callback
        //
        function errorCB(err) {
            console.log("Error processing SQL: " + err.code);
        }

        // Transaction success callback
        //
        function successCB() {
            var db = window.openDatabase("StateTuning", "1.0", "StateTuning", 200000);
            db.transaction(queryDB, errorCB);
        }


        //============================================================================================================
function updateState()
	{
	console.log("starting Update State");
	$.ajax({
            type: 'GET',
            url: 'http://216.186.69.45/services/state_list/' + state,
			dataType: 'json',
			success: updateTitle
	});

		
		
	$.ajax({
		type: 'GET',
		url: 'http://216.186.69.45/services/state_tunes/' + state,
		dataType: 'json',
		success: replacepage
     });


}

function updateTitle(data){
	console.log(state);
	$("#statename").html(data.state[0].name);
}

function replacepage(data){
		//creates list of songs with the likes
		
        var theWholeThing;
        $.each(data, function(index, tune) {
            theWholeThing += '<li id="song"><a href="#" class="btn large" onclick="playAudio("http://216.186.69.45/assets/' + tune.content + '")><img src="images/play.png"></a><a href="#" class="btn large" onclick="pauseAudio()"><img src="images/pause.png"></a>' + tune.content + ' likes = ' + tune.likes + '</li>';
        });
        // for (i = 0; i < tunes.length; i++)
        // {
        //     theWholeThing += '<li id="song" data-song="5"><a href="#" class="btn large" onclick="playAudio("http://216.186.69.45/assets/' + data.tunes[i].content + '")><img src="images/play.png"></a><a href="#" class="btn large" onclick="pauseAudio()"><img src="images/pause.png"></a>' + data.tunes[i].content + ' likes = ' + data.tunes[i].likes + '</li>';
				    //         //"<li id=\"song\" data-song=\"5\"><a href=\"#\" class=\"btn large\" onclick=\"playAudio('" + songurl + "');\"><img src=\"images/play.png\"></a><a href=\"#\" class=\"btn large\" onclick=\"pauseAudio();\"><img src=\"images/pause.png\"></a>" + song.name + "</li>"
        // }
        var string = JSON.stringify(data);
        console.log(string);
       $('#statesongs').html(theWholeThing);


        //picture
        if (deviceType == 'Android') {
             var thepath = $.get('images/' + state + '-small.png');
        }
        else {
            var thepath = "images/" + state + "-small.png";
        }
        $("#statepic").attr("src", thepath);
		
}