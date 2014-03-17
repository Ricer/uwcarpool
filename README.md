UWCarpool Website
----------------------
####Form validation before submit **checker**: version 1
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

for `data-check='notempty minlength6 password'`:

input value      |error message
-----------|---------------
 | cannot be empty
123d  | must be at least 6 characters long
123dasdasd  | Passwords must contain at least one number, one lowercase and one uppercase letter

A complete example:
```html

<form action="/register/submit" method="post" name="registration_form" id="login" data-trigger='checker'>
  <input type="text" name="firstname" id="firstname" placeholder="First Name"  class='input input-default' data-check='notempty'/>
  <input type="text" name="lastname" id="lastname" placeholder="Last Name"  class='input input-default' data-check='notempty'/>
  <input type="text" name="email" id="email" placeholder="Email" class='input input-default' data-check='notempty email'/>
  <input type="password" name="password" id="password" placeholder="Password" class='input input-default' data-check='notempty minlength6 password' data-hash='true' />
  <input type="password" name="confirmpwd" id="confirmpwd" placeholder="Confirm Password" class='input input-default' data-check='confirm' data-target='#password' />
  <input id="loginBtn" type="submit" class="btn btn-primary" value="Sign up" />
</form>
```

