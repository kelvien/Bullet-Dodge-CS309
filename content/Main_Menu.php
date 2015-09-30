 <?php
 session_start();
 $username = $_SESSION['uname'];
 ?>
<!--Side menu-->
 <div class="snap-drawers">
    <div class="snap-drawer snap-drawer-left">
    <div class="snap-drawer-menu">
    <!-- <p class="text-center">MENU</p> -->
    </div>
    <div class="snap-drawer-friend_request">
    <?php include ("include/friendRequest.php"); ?>
    </div>
    <div class="snap-drawer-add_friend">
    <p class="text-center">Find a friend</p>
    <input type="text" class="findFriend" placeholder="Enter friend's ID"/>
    <div class="findFriend_list">
    </div>
    </div>
    <div class="snap-drawer-friend_list">
    <?php include("include/chat_part-revised.php"); ?> 
    </div>
    </div>
</div>
<!--  <div class="container">
    <div class="row">
    <div class="col-xs-12"> -->
<div id="menu_content" class="snap-content">
<header id="header">
    <div class="container">
        <div class="logo"><a href="#"><img src="img/assets/main_logo.png" style="width:312px; height: 67px; position: absolute; top: 18px;"/></a></div>
        <nav id="nav">
            <div class="opener-holder">
                <a href="#" class="nav-opener"><span></span></a>
            </div>
            <a href="/" class="btn btn-primary rounded">Log Out</a>
            <div class="nav-drop">
                <ul>
                    <li class="active visible-sm visible-xs"><a href="#">Home</a></li>
                    <li><a href="javascript:toggleSideBar();">Find Friends</a></li>
                </ul>
            </div>
        </nav>
    </div>
</header>
<div class="container">
        <br>
        <br>
        <br>
        <br/>
        <br/>
        <br>
        <!--  Dismissable pop up    -->
        <div class="alert alert-info alert-dismissible" role="alert" align="center">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <?php echo "Welcome ".$username." to Bullet Dodge. Make sure to check out our leaderboards to see the best scores!"; ?> 
        </div>

        <!-- Play Thumbnail -->
        <div class="1st row" style="margin-left: 10px" >
            
            <div class="col-sm-4">
                <div class="thumbnail" >
                <img src="img/assets/control.png" alt="Bullet Dodge">
                <div class="caption text-center">
                    <h3>Play Bullet Dodge</h3>
                    <p>Play Bullet Dodge online against players, with friends, or against the computer.</p>
                    <br>
                    <br>
                <p><a href="#" class="btn btn-primary" role="button" onclick="window.open('single.php','_self')">Single Player</a></p>
                <p><a href="#" class="btn btn-primary" role="button" onclick="window.open('/play.php','_self')">Play with others</a></p>
                <p><a href="#" class="btn btn-primary" role="button" onclick="privateRoom()">Create Private Room</a></p>
                </div>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="thumbnail" >
                <img src="img/assets/man.png" alt="Bullet Dodge">
                <div class="caption text-center">
                    <h3>Check Your Profile</h3>
                    <p>Go to your profile screen where you are able to look at your statistics from previous games, look at and change your profile information including your username and password.</p>
                <p><a href="#" class="btn btn-primary" role="button" onclick="window.open('Profile.php','_self')">Profile</a></p>
                </div>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="thumbnail" >
                <img src="img/assets/Trophy.png" alt="Bullet Dodge">
                <div class="caption text-center">
                    <h3>Check out our Leaderboards</h3>
                    <p>Our leaderboards show the best of the best in bullet dodge.</p>
                <p><a href="#" class="btn btn-primary" role="button" onclick="window.open('Leaderboard.php','_self')">Leaderboard</a></p>
                </div>
                </div>
            </div>
        </div>
    </div>
<!-- </div> -->

</div>
<div id="chat_with_friends_container"></div>
</div>
<script type="text/javascript">
function toggleSideBar(){

    if( snapper.state().state=="right" ){
        snapper.close();
    } else {
        snapper.open('right');
    }

}

function privateRoom()
{
    var id = <?php echo json_encode((string)$username);  ?>;
    var token = <?php echo json_encode(uniqid()); ?>;
    window.open('/play.php?token='+id+token,'_self');
}
</script>

            