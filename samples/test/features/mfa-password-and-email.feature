Feature: Multi-Factor Authentication with Password and Email

  Background:
	  Given an App
      And a Policy that defines "Authentication"
      And with a Policy Rule that defines "Password + Another Factor"
      And a user named "Mary"
      And she has an account with "active" state in the org

  Scenario: Mary enters a wrong verification code
    Given Mary navigates to the Basic Login View
    When she fills in her username
      And she fills in her correct password
      And she clicks Login
    Then She sees a list of factors
    When She has selected Email from the list of factors
      And She inputs the incorrect code from the email
    Then the sample shows an error message "Invalid code. Try again." on the Sample App

  Scenario: 2FA Login with Email
    Given Mary navigates to the Basic Login View
      And she has inserted her username
      And she has inserted her password
      And her password is correct
    When she clicks Login
    Then she is presented with an option to select Email to verify
    When She selects Email from the list
      And She selects "Receive a Code"
    Then the screen changes to receive an input for a Email code
    When She inputs the correct code from the Email
      And She selects "Verify"
    Then she is redirected to the Root View
      And an application session is created
