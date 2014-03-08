function formhash(form, password) {
    // Create a new element input, this will be our hashed password field. 
    var p = document.createElement("input");
 
    // Add the new element to our form. 
    form.appendChild(p);
    p.name = "p";
    p.type = "hidden";
    p.value = hex_sha512(password.value);
 
    // Make sure the plaintext password doesn't get sent. 
    password.value = "";
 
    // Finally submit the form. 
    form.submit();
}

function fieldError(fieldElem,errorStr){
    $(fieldElem).tooltip({
        placement:$(fieldElem).is(":last-child")&&$(fieldElem).parent().is(".inputGroup.horizontal")?'right':'left',
        trigger:'manual',
        title:errorStr,
        container:'body'
    }).tooltip('show').addClass('has-tooltip')
    $(fieldElem).one('blur',function(){
        $(fieldElem).tooltip('destroy').removeClass('has-tooltip')
    });
}
$(window).resize(function(){
    $('.has-tooltip').tooltip('show')
})
function regformhash(form, firstname,lastname, email, password, conf) {
     // Check each field has a value
    var errorElem;

    // Check password and confirmation are the same
    if (  conf.value == ''      ){fieldError(conf,"Cannot be empty");errorElem=conf;}
    if (password.value != conf.value) {
        fieldError(conf,'Your password and confirmation do not match');
        errorElem=conf;
    }

    if (  password.value == ''  ){fieldError(password,"Cannot be empty");errorElem=password;}
    // Check that the password is sufficiently long (min 6 chars)
    // The check is duplicated below, but this is included to give more
    // specific guidance to the user
    if (password.value.length < 6) {
        fieldError(password,'Passwords must be at least 6 characters long');
        errorElem=password;
    }
    // At least one number, one lowercase and one uppercase letter 
    // At least six characters 
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/; 
    if (!re.test(password.value)) {
        fieldError(password,'Passwords must contain at least one number, one lowercase and one uppercase letter');
        errorElem=password;
    }


    if (  email.value == ''     ){fieldError(email,"Cannot be empty");errorElem=email;}
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email.value)) {
        fieldError(email,'Not a valid email');
        errorElem=email;
    }

    if (  lastname.value == ''  ){fieldError(lastname,"Cannot be empty");errorElem=lastname;}
    if(!re.test(lastname.value)) { 
        fieldError(lastname,"Last Name must contain only letters, numbers and underscores"); 
        errorElem=lastname;
    }
    if (  firstname.value == '' ){fieldError(firstname,"Cannot be empty");errorElem=firstname;}
    re = /^\w+$/; 
    if(!re.test(firstname.value)) { 
        fieldError(firstname,"First Name must contain only letters, numbers and underscores"); 
        errorElem=firstname; 
    }

    if(errorElem){
        $(errorElem).focus();
        return false
    }
 
    // Create a new element input, this will be our hashed password field. 
    var p = document.createElement("input");
 
    // Add the new element to our form. 
    form.appendChild(p);
    p.name = "p";
    p.type = "hidden";
    p.value = hex_sha512(password.value);
 
    // Make sure the plaintext password doesn't get sent. 
    password.value = "";
    conf.value = "";
 
    // Finally submit the form. 
    form.submit();
    return true;
}