<?php
include_once 'DBSecure.php';
function sec_session_start() {
    $session_name = 'sec_session_id';   // Set a custom session name
    $secure = SECURE;
    // This stops JavaScript being able to access the session id.
    $httponly = true;
    // Forces sessions to only use cookies.
    if (ini_set('session.use_only_cookies', 1) === FALSE) {
        header("Location: ../error.php?err=Could not initiate a safe session (ini_set)");
        exit();
    }
    // Gets current cookies params.
    $cookieParams = session_get_cookie_params();
    session_set_cookie_params($cookieParams["lifetime"],
        $cookieParams["path"], 
        $cookieParams["domain"], 
        $secure,
        $httponly);
    // Sets the session name to the one set above.
    session_name($session_name);
    session_start();            // Start the PHP session 
    session_regenerate_id();    // regenerated the session, delete the old one. 
}
function login($email, $password, $mysqli) {
    // Using prepared statements means that SQL injection is not possible. 
    if ($stmt = $mysqli->prepare("SELECT id, firstname,lastname, password, salt, type
        FROM members
       WHERE email = ?
        LIMIT 1")) {
        $stmt->bind_param('s', $email);  // Bind "$email" to parameter.
        $stmt->execute();    // Execute the prepared query.
        $stmt->store_result();
 
        // get variables from result.
        $stmt->bind_result($user_id, $firstname, $lastname, $db_password, $salt, $type);
        $stmt->fetch();
 
        // hash the password with the unique salt.
        $password = hash('sha512', $password . $salt);
        if ($stmt->num_rows == 1) {
            // If the user exists we check if the account is locked
            // from too many login attempts 
 
            if (checkbrute($user_id, $mysqli) == true) {
                // Account is locked 
                // Send an email to user saying their account is locked
                return false;
            } else {
                // Check if the password in the database matches
                // the password the user submitted.
                if ($db_password == $password) {
                    // Password is correct!
                    // Get the user-agent string of the user.
                    $user_browser = $_SERVER['HTTP_USER_AGENT'];
                    // XSS protection as we might print this value
                    $user_id = preg_replace("/[^0-9]+/", "", $user_id);
                    $_SESSION['user_id'] = $user_id;
                    // XSS protection as we might print this value
                    $firstname = preg_replace("/[^a-zA-Z0-9_\-]+/", 
                                                                "", 
                                                                $firstname);
                    $_SESSION['firstname'] = $firstname;
                    $lastname = preg_replace("/[^a-zA-Z0-9_\-]+/", 
                                                                "", 
                                                                $lastname);
                    $_SESSION['lastname'] = $lastname;
                    $_SESSION['login_string'] = hash('sha512', 
                              $password . $user_browser);
					
					$_SESSION['user_type'] = $type;
                    // Login successful.
                    return true;
                } else {
                    // Password is not correct
                    // We record this attempt in the database
                    $now = time();
                    $mysqli->query("INSERT INTO login_attempts(user_id, time)
                                    VALUES ('$user_id', '$now')");
                    return false;
                }
            }
        } else {
            // No user exists.
            return false;
        }
    }
}
function checkbrute($user_id, $mysqli) {
    // Get timestamp of current time 
    $now = time();
 
    // All login attempts are counted from the past 2 hours. 
    $valid_attempts = $now - (2 * 60 * 60);
 
    if ($stmt = $mysqli->prepare("SELECT time 
                             FROM login_attempts <code><pre>
                             WHERE user_id = ? 
                            AND time > '$valid_attempts'")) {
        $stmt->bind_param('i', $user_id);
 
        // Execute the prepared query. 
        $stmt->execute();
        $stmt->store_result();
 
        // If there have been more than 5 failed logins 
        if ($stmt->num_rows > 5) {
            return true;
        } else {
            return false;
        }
    }
}
function login_check($mysqli) {
    // Check if all session variables are set 
    if (isset($_SESSION['user_id'], 
                        $_SESSION['firstname'], 
                        $_SESSION['lastname'], 
                        $_SESSION['login_string'])) {
 
        $user_id = $_SESSION['user_id'];
        $login_string = $_SESSION['login_string'];
        $lastname = $_SESSION['lastname'];
        $firstname = $_SESSION['firstname'];
 
        // Get the user-agent string of the user.
        $user_browser = $_SERVER['HTTP_USER_AGENT'];
 
        if ($stmt = $mysqli->prepare("SELECT password 
                                      FROM members 
                                      WHERE id = ? LIMIT 1")) {
            // Bind "$user_id" to parameter. 
            $stmt->bind_param('i', $user_id);
            $stmt->execute();   // Execute the prepared query.
            $stmt->store_result();
 
            if ($stmt->num_rows == 1) {
                // If the user exists get variables from result.
                $stmt->bind_result($password);
                $stmt->fetch();
                $login_check = hash('sha512', $password . $user_browser);
 
                if ($login_check == $login_string) {
                    // Logged In!!!! 
                    return true;
                } else {
                    // Not logged in 
                    return false;
                }
            } else {
                // Not logged in 
                return false;
            }
        } else {
            // Not logged in 
            return false;
        }
    } else {
        // Not logged in 
        return false;
    }
}

function esc_url($url) {
 
    if ('' == $url) {
        return $url;
    }
 
    $url = preg_replace('|[^a-z0-9-~+_.?#=!&;,/:%@$\|*\'()\\x80-\\xff]|i', '', $url);
 
    $strip = array('%0d', '%0a', '%0D', '%0A');
    $url = (string) $url;
 
    $count = 1;
    while ($count) {
        $url = str_replace($strip, '', $url, $count);
    }
 
    $url = str_replace(';//', '://', $url);
 
    $url = htmlentities($url);
 
    $url = str_replace('&amp;', '&#038;', $url);
    $url = str_replace("'", '&#039;', $url);
 
    if ($url[0] !== '/') {
        // We're only interested in relative links from $_SERVER['PHP_SELF']
        return '';
    } else {
        return $url;
    }
}

function getHeader($cssUrl=""){

    $logged=login_check($GLOBALS['mysqli']);

?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, target-densityDpi=device-dpi" />
    <title>UWCarpool♥</title>
    <link rel="shortcut icon" href="images/favicon.ico">

    <!-- Loading CSS -->
    <link href="/css/bootstrap.css" rel="stylesheet">
    <link rel="stylesheet" href="/css/picker/default.css" id="theme_base">
    <link rel="stylesheet" href="/css/picker/default.date.css" id="theme_date">
    <link rel="stylesheet" href="/css/picker/default.time.css" id="theme_time">

    <link rel="stylesheet" href="/css/font-awesome.min.css">
    <link rel="stylesheet" href="<?php echo $cssUrl?>">


    <!-- HTML5 shim, for IE6-8 support of HTML5 elements. All other JS at the end of file. -->
    <!--[if lt IE 9]>
      <script src="js/html5shiv.js"></script>
      <script src="js/respond.min.js"></script>
    <![endif]-->
    <script src="/js/lib/jquery-1.8.3.min.js"></script>
    <script src="/js/lib/bootstrap.min.js"></script>
    <script src="/js/lib/moment.min.js"></script>
    <script src="/js/lib/legacy.js"></script>
    <script src="/js/lib/picker.js"></script>
    <script src="/js/lib/picker.date.js"></script>
    <script src="/js/lib/picker.time.js"></script>
    
    <!-- <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDg86pw-zJk0BMtetO5U5-OkETrl9Tfx6A&sensor=true"></script> -->
    <script src="/js/lib/react/react-with-addons.min.js"></script>
    <script src="/js/lib/react/JSXTransformer.js"></script>
    
  </head>
  <body>
      <div class='main'>
        <nav class="navbar topbar navbar-default navbar-fixed-top affix" role="navigation">
          <div class="container">
            <div class="navbar-header">
              <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
              <a class="navbar-brand" href="http://www.uwcarpool.com/"><span>UWCarpool </span><i class="fa fa-heart"></i></a>
            </div>

            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul class="nav navbar-nav navbar-right">

                <li><a href="/"><span>Home</span></a></li>
                
                <?php if ($logged == true) : ?>
                  <li><a onclick="$('.profile').toggleClass('show')"><?php echo $_SESSION['firstname']?></a>
                    <div class="profile">
                      <div class='info'>
                      <p class="name"><?php echo $_SESSION['firstname']?> <?php echo $_SESSION['lastname']?></p>
                      <span class="makeoffer">Make a request <i class="fa fa-angle-right"></i></span>
                      </div>
                      <div class='buttons'>
                        <a href="/dashboard"><i class="fa fa-tachometer"></i>Dashboard</a>
                        <a href="/settings"><i class="fa fa-cog"></i>Settings</a>
                        <a href="/logout.php"><i class="fa fa-power-off"></i>Logout</a>
                      </div>
                    </div>
                  </li>
                <?php else:?>
                  <li><a href="login">Login</a></li>
                <?php endif; ?>
              </ul>
            </div>
          </div>
        </nav>



<?php
}

