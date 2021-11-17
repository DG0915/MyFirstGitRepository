# Design Approach:
--------------------
Step 1: 
  Generated API key from OMDB open source database and activated it.
  
Step 2:
  Whitelisted Endpoint URL in CSP trusted sites and in Remote site setting.
  
Step 3:
  Created custom object:movieFeedback__C with required fields as mentioned in document.
  
Step 4:
  Created domain in salesforce and created force.com site with Visual force added in it as home page.
  
Step 5:
  Created LWC component to execute logic
  (1) Template file name     : searchMovieLWC.html
  (2) JS controller file name: searchMovieLWC.js
  (3) Configuration file name: searchMovieLWC.js-meta.xml
  (4) styling file name      : searchMovieLWC.css
  
 Step 6:
  Created Aura Dependancy app with LWc component added in it and with appropiate interface.
  
 Step 7:
  Added this Aura Depenadancy App and LWC component in created VF page.
  
  Step 8:
  Site link: https://eazzymoviesearchdemo-developer-edition.ap24.force.com/developers
 
 ==============================================================================

  I have done TTP Callouts from LWC using Fetch API in Client-side controller(JS controller).
  I have used modal-pop up to navigate from one pop up page to other.
  I have imported createRecord method from Standard uiRecordAPI to commit movie information and related data to Salesforce.
  
