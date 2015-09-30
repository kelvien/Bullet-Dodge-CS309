<?php 
	$users = $con->query("SELECT userid FROM Users WHERE username = '$username'");
	$userId = $users->fetch_array(MYSQLI_NUM);
	$userFriends = $con->query("SELECT Users.username from Users, userFriends where userFriends.ownerId = '$userId[0]' and userFriends.friendId = Users.userid");
	//$userFriendsName = $userFriends->fetch_array();
	//$user = mysqli_fetch_array($users);
?>

<div id="chat_fixed_bottom">
	<div class="pull-right" id="friends_list">
		<p id="expand_friend_button">Friends <?php echo "(".$userFriends->num_rows.")"; ?></p>
		<?php
		while($row = $userFriends->fetch_array())
		{
		$rows[] = $row;
		}
		if(count($rows) > 0){
			echo "<div style='display: none' id='chat_friends'>";
		foreach($rows as $row){
			echo "<p class='chat_friend_status'>● OFFLINE</p><p class='chat_friend'>".$row[0]."</p>";
		}
			echo "</div>";
		}
		?>
	</div>
</div>

<div id="chat_with_friends_container">

</div>

<script src="https://cdn.socket.io/socket.io-1.3.4.js"></script>
<script type="text/javascript" src="http://proj-309-18.cs.iastate.edu/library/jquery-2.1.1/jQuery-2.1.1.js"></script>
<script type="text/javascript">

$("#expand_friend_button").on("click", function(){
		$("#chat_friends").toggle('fast');
});

$(".chat_friend").on("click", function(){
	if($(".chat_with_friend_title").size() > 0){
		$(".chat_with_friend_title").each(function(i, e){
			if($(e).text() == $(this).text() && $(this).prev().text() == "● ONLINE"){
				$("#chat_with_friends_container").append("<div class='pull-right chat_with_friend'><div class='chat_with_friend_title'><p class='chat_with_friend_toggle'>"+$(this).text()+"</p><p class='chat_with_friend_close'>close</p></div><div class='chat_with_friend_conversation'></div><div class='chat_with_friend_enter'><form action=''><input type='text' placeholder='Enter your message ..' autocomplete='off' style='width:100%;'/></form></div></div>");
			}
		});
	}
	else{
		if($(this).prev().text() == "● ONLINE"){
			$("#chat_with_friends_container").append("<div class='pull-right chat_with_friend'><div class='chat_with_friend_title'><p class='chat_with_friend_toggle'>"+$(this).text()+"</p><p class='chat_with_friend_close'>close</p></div><div class='chat_with_friend_conversation'></div><div class='chat_with_friend_enter'><form action=''><input type='text' placeholder='Enter your message ..' autocomplete='off' style='width:100%;'/></form></div></div>");
		}
	}
});

$(document).on("submit", "form", function(){
	socket.emit("chat message", {to: $(this).parent().prev().prev().children().first().clone().children().remove().end().text().trim(), msg: $(this).find("input").val()});
	$(this).parent().prev().append("<p class='message_from_you'>"+ $(this).find("input").val() +"</p>");
	$(this).find("input").val('');
	$(this).parent().prev().scrollTop($(this).parent().prev()[0].scrollHeight);
	return false;
});

$(document).on("click", ".chat_with_friend_close", function(){
	$(this).parent().parent().remove();
});

var socket = io.connect('http://proj-309-18.cs.iastate.edu:8080');

socket.on('connect', function(){
	socket.emit('register', <?php echo "'".$username."'"; ?>);
});

socket.on('chat message', function(data){
	var from = data.to;
	var msg = data.msg;
	if($(".chat_with_friend_title").size() > 0){
		$(".chat_with_friend_title").each(function(i, e){
			if($(e).children().first().clone().children().remove().end().text().trim() == from){
				if($(e).children().first().find(".chat_with_friend_chat_no").size() > 0 && $(e).children().first().hasClass("chat_with_friend_hidden")){
					var no = parseInt($(e).children().first().find(".chat_with_friend_chat_no").text());
					no += 1;
					$(e).children().first().find(".chat_with_friend_chat_no").text(no);
				}
				else{
					if($(e).children().first().hasClass("chat_with_friend_hidden")){
						$(e).children().first().append("<span class='badge chat_with_friend_chat_no'>1</span>");
					}
				}
				$(e).next().append("<p class='message_from_someone'>"+msg+"</p>");
				$(e).next().scrollTop($(e).next()[0].scrollHeight);
			}
		});
	}
	else{
			$("#chat_with_friends_container").append("<div class='pull-right chat_with_friend'><div class='chat_with_friend_title'><p class='chat_with_friend_toggle chat_with_friend_hidden'>"+from+"  <span class='badge chat_with_friend_chat_no'>1</span></p><p class='chat_with_friend_close'>close</p></div><div class='chat_with_friend_conversation'><p class='message_from_someone'>"+ msg +"</p></div><div class='chat_with_friend_enter'><form action=''><input type='text' placeholder='Enter your message ..' autocomplete='off'/></form></div></div>");
			hideChat(from);
	}
});

$(document).on("click", ".chat_with_friend_toggle", function(){
	if($(this).hasClass("chat_with_friend_hidden")){
		$(this).removeClass("chat_with_friend_hidden");
		$(this).parent().parent().css("height", "205px");
		$(this).parent().parent().find(".chat_with_friend_enter").show();
		$(this).parent().parent().find(".chat_with_friend_conversation").show();
		$(this).parent().parent().find(".chat_with_friend_chat_no").remove();
	}
	else{
		$(this).addClass("chat_with_friend_hidden");
		$(this).parent().parent().css("height", "25px");
		$(this).parent().parent().find(".chat_with_friend_enter").hide();
		$(this).parent().parent().find(".chat_with_friend_conversation").hide();
	}
});

function hideChat(fromWho){
	var from = $(".chat_with_friend_title:contains("+fromWho+")");
	if(from.size() > 0){
		from.parent().css("height", "25px");
		from.parent().find(".chat_with_friend_enter").hide();
		from.parent().find(".chat_with_friend_conversation").hide();
	}
}

socket.on('list online users', function(data){
	var friends = $(".chat_friend");
	friends.each(function(i, e){
	  if($.inArray($(e).text(), data) > -1){
	  	$(e).prev().text("● ONLINE");
	    $(e).prev().css("color", "green");
	  }
	  else{
	  	$(e).prev().text("● OFFLINE");
	  	$(e).prev().css("color", "gray");
	  }
	});
});

</script>