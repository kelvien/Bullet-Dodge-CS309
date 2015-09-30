<div class="container">
    <div class="row">
        <div class="col-xs-12">
        <h1 align="center"><img src="img/assets/main_logo.png"/></h1>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12">
            <h1 align="center">Registration</h1> 
        </div>
     </div>

    <div class="col-xs-12 col-md-10 col-md-offset-1 col-lg-6 col-lg-offset-3">
        <form id="signUp" action="/registerUser.php" method="post">
            <input type="text" class="form-control rounded" id="username" name="username" placeholder="Username"> </input>
           	<br>
            <input type="password" class="form-control rounded" id="password" name="password" placeholder="Password"> </input>
            <br>
            <input type="password" class="form-control rounded" id="matchpassword" name="matchpassword" placeholder="Re-enter password"> </input>
            <br>
            <input type="text" class="form-control rounded" id="firstnm" name="firstnm" placeholder="First Name"> </input>
            <br>
            <input type="text" class="form-control rounded" id="lastnm" name="lastnm" placeholder="Last Name"> </input>
            <br>
            <input type="submit" class="btn btn-primary rounded" style="width:100%;" name="submit">
        </form>
    </div>
</div>