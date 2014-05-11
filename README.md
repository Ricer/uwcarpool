UWCarpool Website
----------------------
###TODO:
GEOCODE Locations
facebook integration

###Form validation before submit **checker**: version 2
In **forms.js**, There is an easier way to validate your form input before submiting a form.
To use it, include the following in your head tag.
```html
<script src='/js/forms.js'></script>
```
include `data-trigger='checker'` to your form tag. You must also include what kind of validation to check for each input by specifiying `data-check` attribute in your input tag.
for example:
```html
<input type='password' data-check='notempty minlength6 password' />
```
the "checker" will check each input that have a `data-check` attribute before the form submit, and will stop the submission and display an error message for every input that is not valid. If more than one rule is applied to an input, the checker will check the value of the input following the order that you specified the rules.

####for example, when data-check='notempty minlength6 password':

input value      |error message
-----------|---------------
 | cannot be empty
123d  | must be at least 6 characters long
123dasdasd  | Passwords must contain at least one number, one lowercase and one uppercase letter

###A complete example:
```html
<form action="/register/submit" method="post" data-trigger='checker'>
  <input type="text" name="firstname" id="firstname" placeholder="First Name" data-check='notempty'/>
  <input type="text" name="lastname" id="lastname" placeholder="Last Name" data-check='notempty'/>
  <input type="text" name="email" id="email" placeholder="Email" data-check='notempty email'/>
  <input type="password" name="password" id="password" placeholder="Password" data-check='notempty minlength6 password' data-hash='p' />
  <input type="password" name="confirmpwd" id="confirmpwd" placeholder="Confirm Password" data-check='confirm' data-target='#password' />
  <input id="loginBtn" type="submit" class="btn btn-primary" value="Sign up" />
</form>
```

####data-check='confirm'
this validator needs an extra parameter `data-target="<jQuery Selector>"` to specify the element to compare, see above example.


####data-check='minlength/num/'
check the minimun length of a input value. the /num/ must be a int number immediately follow "minlength"


####data-hash='x'
create a hidden field with name='x' when submit. the hidden field will store the hash value of the current input & the current input will have no value when submitting. (use for passwords)

###current validators:

name     |error message
-----------|------------
notempty| Cannot be empty
minlength`x`  |  must be at least `x` characters long
numeric   | Must be all number
email   | Must be a valid email
password  | Passwords must contain at least one number, one lowercase and one uppercase letter
confirm   | Your password and confirmation do not match




