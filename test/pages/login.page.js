// login.page.js
"use strict";
var Page = require('./Page')
class LoginPage extends Page {
    get username()  { return browser.element('#username'); }
    get password()  { return browser.element('#password'); }
    get form()      { return browser.element('#login-submit'); }
    
    open() {
        super.open('#login');
    }
    
    submit() {
        this.form.submitForm();
    }
    
}
module.exports = new LoginPage();