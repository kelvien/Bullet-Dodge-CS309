<section class="area" style="padding: 7px 0 47px;">
<div class="container">
    <div class="row">
        <div class="col-xs-12">
        <h1 align="center"><img src="img/assets/main_logo.png"/></h1>
        </div>
        <div class="col-xs-12 col-md-8 col-md-offset-2 col-lg-4 col-lg-offset-4 text-center">
        <br class="spaces" />
        <br class="spaces" />
        <input id="playForFree" type="button" class="btn btn-primary rounded" style="width:100%;" value="Play for Free!">
        <div id="Menu" style="display:none;" align="center" action="login.php" method="post">
            <form id="logIn" action="login.php" method="post">
            <br>
            <p>Already have an account ?</p>
            <input type="text" class="form-control rounded" id="username" name="username" value="" placeholder="Username"> </input>
            <br>
            <input type="password" class="form-control rounded" id="password" name="password" value="" placeholder="Password"> </input>
            <br>
            <!-- <button class="btn btn-default" onclick="">login</button> -->
            <input type="submit" class="btn btn-primary rounded" style="width:100%;" value="Login">
            </form>
            <p class="text-center" style="margin: 10px 0 10px 0;">First time here ?</p>
            <!-- Link to Main Menu if Login is Correct -->
            <button class="btn btn-default rounded" style="width: 100%;" onclick="window.open('/register.php','_self')">Sign Up</button>
            <!-- Link to Create Account -->
            <!-- <button class="btn btn-default" onclick="window.open('/Main_Menu.php','_self')">Main Menu</button> -->
            <!-- Link to Main Menu -->
        </div>
        </div>
    </div>
    <br/>
    <br/>
    <br/>
    <div class="row">
        <div class="col-md-5">
            <ul class="visual-list" style="padding:0;">
                <li>
                    <div class="img-holder">
                        <img src="img/assets/chat.png" width="110" height="100" alt="">
                    </div>
                    <div class="text-holder">
                    <br/>
                        <h3>Find and chat with your friends</h3>
                        <p>Chat while playing with your friends at the same time!</p>
                    </div>
                </li>
                <br/>
                <li>
                    <div class="img-holder">
                        <img src="img/assets/control.png" width="90" alt="">
                    </div>
                    <div class="text-holder">
                    <br/>
                        <h3>Play for free</h3>
                        <p>This game is forever free!</p>
                    </div>
                </li>
                <br/>
                <li>
                    <div class="img-holder">
                        <img src="img/assets/Trophy.png" height="84" alt="">
                    </div>
                    <div class="text-holder">
                    <br/>
                        <h3>Beat the highest score!</h3>
                        <p>Always give yourself a challenge!</p>
                    </div>
                </li>
            </ul>
        </div>
        <div class="col-md-7">
            <div class="slide-holder scroll-effect-init scroll-effect-animate text-center">
                <div class="img-slide scroll-trigger">
                <img src="img/assets/newmac.png" alt="">
                <video loop autoplay style="  z-index: -1;  position: absolute;  left: 20px;  width: 572px;  top: 21px;  height: 275px;">
                  <source src="img/assets/video.webm" type="video/webm">
                Your browser does not support the video tag.
                </video>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
</section>
<footer>
<div class="container">
<div class="row">
<div class="col-xs-12" style="padding: 15px;">
<p style="margin: 0;">&copy; COMS 309 - Group 18 - SooHan Lim - Kelvien Hidayat - Michael Bonpua - Austin Euchner</p>
</div>
</div>
</div>
</footer>
 