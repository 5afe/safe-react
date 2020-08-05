Feature: Not connected to a wallet on the welcome screen
    Background: 
        Given I am not connected to a wallet
        When I am on the welcome screen
    
    Scenario: Users should see not connected to wallet content
        Then I should see the connect button
        And I should see not connected wallet in the wallet dropdown
