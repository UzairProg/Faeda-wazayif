function setActiveNavItem() {
    // Get the current URL
    var currentURL = window.location.href;
  
    // Select all navigation links
    var navLinks = document.querySelectorAll('.nav-link');
  
    // Loop through each link and check if it matches the current URL
    for (var i = 0; i < navLinks.length; i++) {
      var link = navLinks[i];
  
      // Check if the href attribute of the link matches the current URL
      
      if (link.href === currentURL) {
        // Add the "active" class to the parent <li> element
        link.classList.add('active');
      } 
    }

    var subLinks = document.querySelectorAll('.dropdown-item'); 

    for (var i = 0; i < subLinks.length; i++) {
        var link = subLinks[i];
    
        // Check if the href attribute of the link matches the current URL
        if (link.href === currentURL) {
          // Add the "active" class to the parent <li> element
          return link.classList.add('active');
        } 
      }
  }
  
  // Call the function to set the active navigation item
  setActiveNavItem();