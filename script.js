
document.addEventListener('DOMContentLoaded', function() {
  function closest (element, selector) {
    if (Element.prototype.closest) {
      return element.closest(selector);
    }
    do {
      if (Element.prototype.matches && element.matches(selector)
        || Element.prototype.msMatchesSelector && element.msMatchesSelector(selector)
        || Element.prototype.webkitMatchesSelector && element.webkitMatchesSelector(selector)) {
        return element;
      }
      element = element.parentElement || element.parentNode;
    } while (element !== null && element.nodeType === 1);
    return null;
  }

  // social share popups
  Array.prototype.forEach.call(document.querySelectorAll('.share a'), function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      window.open(this.href, '', 'height = 500, width = 500');
    });
  });

  // In some cases we should preserve focus after page reload
  function saveFocus() {
    var activeElementId = document.activeElement.getAttribute("id");
    sessionStorage.setItem('returnFocusTo', '#' + activeElementId);
  }
  var returnFocusTo = sessionStorage.getItem('returnFocusTo');
  if (returnFocusTo) {
    sessionStorage.removeItem('returnFocusTo');
    var returnFocusToEl = document.querySelector(returnFocusTo);
    returnFocusToEl && returnFocusToEl.focus && returnFocusToEl.focus();
  }

  // show form controls when the textarea receives focus or backbutton is used and value exists
  var commentContainerTextarea = document.querySelector('.comment-container textarea'),
    commentContainerFormControls = document.querySelector('.comment-form-controls, .comment-ccs');

  if (commentContainerTextarea) {
    commentContainerTextarea.addEventListener('focus', function focusCommentContainerTextarea() {
      commentContainerFormControls.style.display = 'block';
      commentContainerTextarea.removeEventListener('focus', focusCommentContainerTextarea);
    });

    if (commentContainerTextarea.value !== '') {
      commentContainerFormControls.style.display = 'block';
    }
  }

  // Expand Request comment form when Add to conversation is clicked
  var showRequestCommentContainerTrigger = document.querySelector('.request-container .comment-container .comment-show-container'),
    requestCommentFields = document.querySelectorAll('.request-container .comment-container .comment-fields'),
    requestCommentSubmit = document.querySelector('.request-container .comment-container .request-submit-comment');

  if (showRequestCommentContainerTrigger) {
    showRequestCommentContainerTrigger.addEventListener('click', function() {
      showRequestCommentContainerTrigger.style.display = 'none';
      Array.prototype.forEach.call(requestCommentFields, function(e) { e.style.display = 'block'; });
      requestCommentSubmit.style.display = 'inline-block';

      if (commentContainerTextarea) {
        commentContainerTextarea.focus();
      }
    });
  }

  // Mark as solved button
  var requestMarkAsSolvedButton = document.querySelector('.request-container .mark-as-solved:not([data-disabled])'),
    requestMarkAsSolvedCheckbox = document.querySelector('.request-container .comment-container input[type=checkbox]'),
    requestCommentSubmitButton = document.querySelector('.request-container .comment-container input[type=submit]');

  if (requestMarkAsSolvedButton) {
    requestMarkAsSolvedButton.addEventListener('click', function () {
      requestMarkAsSolvedCheckbox.setAttribute('checked', true);
      requestCommentSubmitButton.disabled = true;
      this.setAttribute('data-disabled', true);
      // Element.closest is not supported in IE11
      closest(this, 'form').submit();
    });
  }

  // Change Mark as solved text according to whether comment is filled
  var requestCommentTextarea = document.querySelector('.request-container .comment-container textarea');

  if (requestCommentTextarea) {
    requestCommentTextarea.addEventListener('input', function() {
      if (requestCommentTextarea.value === '') {
        if (requestMarkAsSolvedButton) {
          requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute('data-solve-translation');
        }
        requestCommentSubmitButton.disabled = true;
      } else {
        if (requestMarkAsSolvedButton) {
          requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute('data-solve-and-submit-translation');
        }
        requestCommentSubmitButton.disabled = false;
      }
    });
  }

  // Disable submit button if textarea is empty
  if (requestCommentTextarea && requestCommentTextarea.value === '') {
    requestCommentSubmitButton.disabled = true;
  }

  // Submit requests filter form on status or organization change in the request list page
  Array.prototype.forEach.call(document.querySelectorAll('#request-status-select, #request-organization-select'), function(el) {
    el.addEventListener('change', function(e) {
      e.stopPropagation();
      saveFocus();
      closest(this, 'form').submit();
    });
  });

  // Submit requests filter form on search in the request list page
  var quickSearch = document.querySelector('#quick-search');
  quickSearch && quickSearch.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) { // Enter key
      e.stopPropagation();
      saveFocus();
      closest(this, 'form').submit();
    }
  });

  function toggleNavigation(toggle, menu) {
    var isExpanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', !isExpanded);
    toggle.setAttribute('aria-expanded', !isExpanded);
  }

  function closeNavigation(toggle, menu) {
    menu.setAttribute('aria-expanded', false);
    toggle.setAttribute('aria-expanded', false);
    toggle.focus();
  }

  var burgerMenu = document.querySelector('.header .icon-menu');
  var userMenu = document.querySelector('#user-nav');
	if(burgerMenu) {
      burgerMenu.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleNavigation(this, userMenu);
    });

    burgerMenu.addEventListener('keyup', function(e) {
      if (e.keyCode === 13) { // Enter key
        e.stopPropagation();
        toggleNavigation(this, userMenu);
      }
    });

    userMenu.addEventListener('keyup', function(e) {
      if (e.keyCode === 27) { // Escape key
        e.stopPropagation();
        closeNavigation(burgerMenu, this);
      }
    });

    if (userMenu.children.length === 0) {
      burgerMenu.style.display = 'none';
    } 
  }

  // Toggles expanded aria to collapsible elements
  var collapsible = document.querySelectorAll('.collapsible-nav, .collapsible-sidebar');

  Array.prototype.forEach.call(collapsible, function(el) {
    var toggle = el.querySelector('.collapsible-nav-toggle, .collapsible-sidebar-toggle');

    el.addEventListener('click', function(e) {
      toggleNavigation(toggle, this);
    });

    el.addEventListener('keyup', function(e) {
      if (e.keyCode === 27) { // Escape key
        closeNavigation(toggle, this);
      }
    });
  });

  // Submit organization form in the request page
  var requestOrganisationSelect = document.querySelector('#request-organization select');

  if (requestOrganisationSelect) {
    requestOrganisationSelect.addEventListener('change', function() {
      closest(this, 'form').submit();
    });
  }

  // If a section has more than 6 subsections, we collapse the list, and show a trigger to display them all
  const seeAllTrigger = document.querySelector("#see-all-sections-trigger");
  const subsectionsList = document.querySelector(".section-list");

  if (subsectionsList && subsectionsList.children.length > 6) {
    seeAllTrigger.setAttribute("aria-hidden", false);

    seeAllTrigger.addEventListener("click", function(e) {
      subsectionsList.classList.remove("section-list--collapsed");
      seeAllTrigger.parentNode.removeChild(seeAllTrigger);
    });
  }

  // If multibrand search has more than 5 help centers or categories collapse the list
  const multibrandFilterLists = document.querySelectorAll(".multibrand-filter-list");
  Array.prototype.forEach.call(multibrandFilterLists, function(filter) {
    if (filter.children.length > 6) {
      // Display the show more button
      var trigger = filter.querySelector(".see-all-filters");
      trigger.setAttribute("aria-hidden", false);

      // Add event handler for click
      trigger.addEventListener("click", function(e) {
        e.stopPropagation();
        trigger.parentNode.removeChild(trigger);
        filter.classList.remove("multibrand-filter-list--collapsed")
      })
    }
  });
  // Making articles to be visible next to the section sidebar
  Array.prototype.forEach.call(document.querySelectorAll('.section-tree-with-article .article-list a'), function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const id = this.dataset.resourceId;
      const title = document.createElement("p");
      title.innerHTML = this.innerHTML;
      title.classList.add('article-title');
      const existedTitle = document.querySelector('.article-title');
  
      Array.prototype.forEach.call(document.querySelectorAll('.section-tree-with-article .article-list a'), function(element) {
        // deleting all previous article titles
        if(element.dataset.resourceId !== id) {
          element.setAttribute('aria-selected', 'false');
          if(element.nextElementSibling) {
          	element.nextElementSibling.style.display = 'none'; 
          	element.classList.remove('active');
            element.parentNode.classList.remove('article-title-active');
            e.preventDefault();  
          }
        } else {
          if(element.nextElementSibling.style.display === 'block') {
            element.setAttribute('aria-selected', 'false');
            element.nextElementSibling.style.display = 'none'; 
          	element.classList.remove('active');
            element.parentNode.classList.remove('article-title-active');
            e.preventDefault();  
          }
          element.setAttribute('aria-selected', 'true');
          $('html, body').animate({ scrollTop: 0 }, 'slow');
          
          if(element.nextElementSibling) {
              element.classList.add('active');
              element.nextElementSibling.style.display = 'block';
              element.parentNode.appendChild(title);
            element.parentNode.classList.add('article-title-active');
            e.preventDefault();  
            	// setTimeout(() => scrollToTargetAdjusted(element), 250);
            } else {
              element.parentNode.classList.remove('article-title-active');
              e.preventDefault();  
            }
          }
      })
    });
  });
  // Triggers to open first article when page is loaded
  function renderFirstArticle(element, times) {
    let allowed = times || 0;
    function recursion() {
      const articleOpened = element.nextElementSibling.children[0].className === 'article-body';
        if(articleOpened || allowed >= 10 || element.getAttribute('aria-selected') === 'true') {
        return;
    	}
      element.click();
      allowed += 1;
      setTimeout(recursion, 250);
    }
    setTimeout(recursion, 250);
  }
  Array.prototype.forEach.call(document.querySelectorAll('.article-list a'), function(element, index) {
    if(index === 0) {
      setTimeout(renderFirstArticle.bind(null, element, 1), 250);
    }
  })
  // language dropdown formatting
  function formatLangName(name) {
    return name.replace(/ *\([^)]*\) */g, "").trim();
  }
  const languageDropDown = document.querySelector('div.language-selector');
  Array.prototype.forEach.call(languageDropDown.children, function(element, index) {
    if(element.children.length) {
      element.children[0].innerText = formatLangName(element.children[0].innerText);
    } else {
      element.innerText = formatLangName(element.innerText);
    }
  })
  // scrolling to top of opened article
	// if ($(window).width() <= 375 ) {
	// function scrollToTargetAdjusted(element){
	// var headerOffset = 50;
	// var elementPosition = element.getBoundingClientRect().top;
	// const bodyRect = document.querySelector('body').getBoundingClientRect();
	// const offsetPosition = elementPosition - bodyRect.top - headerOffset;
	// window.scrollTo({
	// top: offsetPosition,
	// behavior: "smooth"
	// });
	// }
	// }
});


