$("#playForFree").on("click", function(){
    $("div#Menu").toggle("slow");
    $("#playForFree").hide();
    $(".spaces").hide();
});


var snapper = new Snap({
  element: document.getElementById('menu_content'),
  disable: 'left',
  tapToClose: true
});

$(".findFriend").keyup(function(){
	data = { search: $(".findFriend").val() };
	$.ajax({
        type     : "POST",
        url      : "include/friendFinder.php",
        data	 : data,
        success  : function(data) {
            if(data == "nothing"){
            	$(".findFriend_list").empty();
            }
            else{

            		//console.log(data);
            	
				$(".findFriend_list").empty();

				var rec = JSON.parse(data);

				if(rec.length == 0){
					$(".findFriend_list").append("<p class='text-center'>No matching username</p>");
				}

				for(var key in rec){
					$(".findFriend_list").append("<p class='find_friend_status'>"+getSign(rec[key])+"</p><p class='find_friend'>"+key+"</p>");
				}

            }
        }
    });
});

function getSign(person){
	switch(person.status){
		case "pending": return "<span class='label label-primary'><span class='fa fa-clock-o'></span> Pending</span>";
			break;
		case "free": return "<a class='label_button' data-receiver='"+person.userid+"' data-type='request'><span class='label label-success'><span class='fa fa-user-plus'></span> Add</span></a>";
			break;
		default: return "<span class='label label-danger'><span class='fa fa-warning'></span> Error</span>";
	}
}

$(document).on("click", ".label_button", function(){
	var exec = $(this);
	var data = { receiver: exec.attr("data-receiver"), type: exec.attr("data-type") };
	$.ajax({
		type     : "POST",
        url      : "include/userAction.php",
        data	 : data,
        success  : function(data) {
        	if(data == "success"){
        		switch(exec.attr("data-type")){
        			case "accept":
        				$(".snap-drawer-friend_request").load("/include/friendRequest.php");
        				$(".snap-drawer-friend_list").load("/include/chat_part-revised.php");
        				break;
        			case "request":
        				exec.css("pointer-events", "none");
        				exec.css("cursor", "default");
        				exec.children().first().removeClass("label-success").addClass("label-primary");
        				exec.children().first().text(" Pending");
        				exec.children().first().prepend("<span class='fa fa-clock-o'></span>");
        				break;
        			default:
        				break;
        		}
        	}
        }
	});
});