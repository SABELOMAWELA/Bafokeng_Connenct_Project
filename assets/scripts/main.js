function checkDeclaredElements(elementName) {
  // Access the variable using bracket notation if already declared
  if (elementName in window) {
    return window[elementName];  // Access and return the existing variable
  } else {
    // Define the variable using querySelector and assign to a new variable
    const element = document.querySelector(elementName);
    // Add the newly created element to the global scope (window)
    window[elementName] = element;
    return element;
  }
}
// const [body,header,main,footer] = ['body','header','main','footer'].map((elementName) => checkDeclaredElements(elementName));

const 
      body = document.querySelector('body'),
      header = body.querySelector('header'),
      main =  body.querySelector('main'),
      footer = body.querySelector('footer'),
      selectElements = document.querySelectorAll('select'),
      htmlParser = new DOMParser(),
      url = (url) => {
        if(url === undefined && typeof url === 'undefined'){
          url = window.location;
        }
        return new URL(url);
      },
      currentHTTP = url().protocol,
      currentURL = url().href,
      currentURLPath = url().pathname,
      currentURLQuery = url().search,
      currentURLPort = url().port,
      domain = url().hostname,
      root = url().origin;

const router = new Router();
const script = new Script();

const pageName = router.getName(currentURLPath);


const [links, buttons, inputs, textareas, 
  selects, labels, fieldsets, canvases, images, 
  progressbars, videos, tables, forms, navs] = ['a', 'button', 'input', 'textarea', 
    'selects', 'labels', 'fieldsets', 'canvases', 'images', 
    'progress', 'video', 'table', 'form', 'nav'].map((element) => main.querySelectorAll(element));

console.log(buttons);

let inputElements = inputs,
    // buttons = main.querySelectorAll('button'),
    pageOffsetTop = 0;

isNull = (element) => {
  return (element === '' || element === undefined || element === null || typeof element === undefined || typeof element === null);
}

getInputById = (text) => {
  const inputs = document.querySelectorAll("input");
  let element = false;
  if(!isNull(inputs)){
    inputs.forEach(input => {
      if(input.id === text){
        element = input;
        return input;
      }
    });
  }
  return element;
}

const stickyHeader = (windowScrollY) => {
  if(pageName === 'auth'){
    header.classList.add('hidden');
    return;
  }
  const numToMinus = Math.floor(header.offsetHeight * 0.5);
  if(header.offsetTop >= (header.offsetHeight - numToMinus) || windowScrollY >= (header.offsetHeight - numToMinus)){
    header.classList.add('header-background');
  }
  else {
    header.classList.remove('header-background');
  }
}


// Regex for email and phone number validation

// the regex validates all the following email address formats:
// username@domain.co.za (standard with country code TLD)
// username@domain.com (standard TLD)
// username@domain.com.za (subdomain with country code TLD)
// username@domain.websites (domain with a non-standard TLD)

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.(?:[a-zA-Z]{2,}|[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.(?:[a-zA-Z]{2,}|[a-zA-Z0-9-]{2,}))$/;
const phoneRegex = /^\(?(\d{3})\)?[-. \s](\d{3})[-. \s](\d{4})$/;

function validatePhoneNumber(inputValue) {
  // Remove whiteSpaces and non-digit characters
  const sanitizedValue = inputValue.replace(/[\s\D]/g, "");

  // Check for valid starting digits (0 or 27) and length of remaining digits is 9
  const isValidStart = /^0\d{9}$/.test(sanitizedValue) || /^27\d{9}$/.test(sanitizedValue);

  return (isValidStart)? sanitizedValue : isValidStart;
}

function formatPhoneInput(input) {
  const value = validatePhoneNumber(input.value); // Remove leading/trailing whitespaces

  // Check if value is empty or doesn't contain numbers
  if (!value || isNaN(value)) {
    return false; // Exit if no numbers present
  }

  // const defaultAlertText = input.parentElement.querySelector(".form-group-alert-text").textContent;
  // if(){
  //   input.parentElement.querySelector(".form-group-alert-text").textContent = "Phone numbers should be 10 numbers only"
  // }

  // Remove any non-numeric characters
  const numbers = value.replace(/\D/g, ""); 

  // Format the phone number (3-3-4 format)
  const formattedNumber = numbers.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1 $2 $3");

  // Update the input field value
  input.value = formattedNumber;
  return true;
}

function formatPhoneNumber(phoneNumbers) {
  const value = validatePhoneNumber(phoneNumbers); 

  // Check if value is empty or doesn't contain numbers
  if (!value || isNaN(value)) {
    // console.log(value);
    return false; // Exit if no numbers present
  }

  // Remove any non-numeric characters
  const numbers = value.replace(/\D/g, ""); 
  const formatter = (/^(\+27|27)\d+$/.text(numbers))? `/^(\d{2})(\d{2})(\d{3})(\d{4})$/, "$1 $2 $3 $4"` : `/^(\d{3})(\d{3})(\d{4})$/, "$1 $2 $3"`;

  // Format the phone number (3 3 4 format) /^(0|\+27|27)\d+$/
  return (/^(\+27|27)\d+$/.text(numbers))? numbers.replace(/^(\d{2})(\d{2})(\d{3})(\d{4})$/, "$1 $2 $3 $4") : numbers.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1 $2 $3");
}

function isCorrectNumbers(value) {
  const sanitizedValue = value.replace(/\s/g, ""); // Remove whitespaces

  // Regular expression to match digits and an optional leading "+"
  // const regex = /^(\+)?(\d+)$/;
  const regex = /^(0|\+27|27)\d+$/;
  let numbers = '';

  if(regex.test(sanitizedValue)){
    numbers = sanitizedValue.replace("+", "");
  }

  numbers = validatePhoneNumber(numbers);
  const formatter = (/^(\+27|27)\d+$/.test(numbers))? `/^(\d{2})(\d{2})(\d{3})(\d{4})$/, "$1$2$3$4"` : `/^(\d{3})(\d{3})(\d{4})$/, "$1$2$3"`;

  return (numbers)? numbers.replace(formatter) : false;
}

function getHTMLContent(pagePath, content, contentType ='') {
  const pageName = pagePath.split("/").pop();

  if(isNull(contentType) || contentType === 'path'){
    // replaceFormContent('reg-card', './reg-bdaygender.html');
    fetch(pagePath).then(data=>data.text()).then(data => {
      // const elementToReplace = (typeof element === 'object')? element : ((document.getElementById(element))? document.getElementById(element) : ((document.querySelector(`.${element}`))? document.querySelector(`.${element}`): document.querySelector(element)));
      // document.getElementById("reg-card").parentElement.innerHTML = data;
      
      // clonedContent = loadHTMLContent(data);
      getHTMLContent(data, 'html')
    });

  }

  if(!isNull(contentType) || contentType === 'json'){}

  if(!isNull(contentType) || contentType === 'html'){
    return pagePath;
  }
  
}



async function replaceFormContent(element, pagePath) {
  // Fetch the content of wow.html
  const pageName = pagePath.split("/").pop();

  try {
    const response = await fetch(pagePath);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to fetch ${pageName}: ${response.status}`);
    }

    // Parse the response as text
    const html = await response.text();

    // Parse the text to a DOM element (assuming the content to be replaced is within)
    const htmlComponent = new DOMParser().parseFromString(html, "text/html");

    // Get the target element (assuming it's in the same document)
    const elementToReplace = (typeof element === 'object')? element : ((document.getElementById(element))? document.getElementById(element) : ((document.querySelector(`.${element}`))? document.querySelector(`.${element}`): document.querySelector(element)));

    // Check if the element exists
    if (!elementToReplace) {
      throw new Error(`Element ${element} is not found`);
    }

    // Replace the content of the element with the fetched HTML
    elementToReplace.parentElement.innerHTML = htmlComponent.querySelector('*').innerHTML; // Select first child's content

    const pageFormElements = formElements();
    pageFormElements.forEach(pageFormElement => {
      // console.log(pageFormElement);
      elementHasEvent(pageFormElement);
    });

  } catch (error) {
    console.error(`Failed to replace content: ${error.message}`);

    // Handle errors further if needed (e.g., display error message to user)
    return false; // Or another value to indicate failure
  }
}

function removeEmptyArray(arr) {
  return arr.filter(item => {
    // Check if item is not a truthy value (including empty arrays and NodeLists)
    if (!item) {
      return false;
    }

    // Handle NodeLists specifically (if needed)
    if (item instanceof NodeList) {
      // Check if the NodeList has any child nodes
      return item.length > 0
    }

    // For other objects (arrays, etc.), check for truthiness
    return true;
  });
}

function nodeListToArray(nodeLists) {
  let nodeList, makeNodeList;
  // Handle NodeLists specifically (if needed)
  if (nodeLists instanceof NodeList) {
    // makeNodeList = [].slice.call(nodeLists);
    if(nodeLists.length > 0){
      makeNodeList = [].slice.call(nodeLists);
    }
  }

  let arrayFromNodeList = []

  const NewNodeList = (makeNodeList.length > 0)? makeNodeList : nodeLists;

  if(!Array.isArray(NewNodeList )) {
    nodeList = [].slice.call(NewNodeList);
    arrayFromNodeList = nodeList;
  }
  else {
    arrayFromNodeList = NewNodeList;
  }

  return arrayFromNodeList;
}

function formElements(){
  const forminput = main.querySelectorAll('input');
  const formselect = main.querySelectorAll('select');
  const formtextarea = main.querySelectorAll('textarea');
  const formbutton = main.querySelectorAll('button');
  
  let formelements = removeEmptyArray([forminput, formselect, formtextarea, formbutton]);
  let thisFromElement,
  thisFromElements = [];

  formelements.forEach(pageFormElement => {

    if(!Array.isArray(pageFormElement)){
      if(pageFormElement instanceof NodeList){
        thisFromElement = nodeListToArray(pageFormElement);
      }
      else if(Array.isArray(pageFormElement)){
        thisFromElement = pageFormElements;
      }
      else {
        thisFromElement.push(nodeListToArray(pageFormElement));
      }
    }

    if(thisFromElement.length > 0){
      for (let index = 0; index < thisFromElement.length; index++) {
        thisFromElements.push(thisFromElement[index]);
      }
    }
    // thisFromElements.push(thisFromElement);
    
  });

  return thisFromElements;
}

selectElements.forEach(selectElement => {
    selectElement.addEventListener('change', () => {
        if (selectElement.value !== '') {
          selectElement.classList.add('has-selection');
        } else {
          selectElement.classList.remove('has-selection');
        }
      });
});

function PhoneNumbersAlert(number) {
  return (number)? `Phone numbers should be ${number} numbers only` : "";
}

function getAuthFormInput(elementSelector) {
  const elementt = (typeof element === 'object')? element : ((document.getElementById("auth-card"))? document.getElementById("auth-card") : ((document.querySelector(`.${element}`))? document.querySelector(`.${element}`): document.querySelector(element)));
  // console.log(elementt)

  let INPUT = '';
  if(INPUT !== 'object'){
    // console.log(document.getElementById(`${elementSelector}`));
    // console.log((document.querySelector(`input.${elementSelector}`)));
    // console.log(document.querySelector(`auth-card ${elementSelector}`));
  }
//  return INPUT;

  // inputElements = document.querySelectorAll('input');
  // buttons = main.querySelectorAll('button');
}

function inputEvent(htmlInput) {
  let inputValue = htmlInput.value;

  if(htmlInput.id === "identifier"){
    const phoneDigits = /^(0|\+27|27)\d+$/.test(inputValue), // Phone number syntax validation
          emailChars = /^(?=.*@).+$/.test(inputValue) && !inputValue.startsWith("@"),
          nicename = inputValue.startsWith("@");
    
    if(phoneDigits){
      const isDigitsOnly = phoneDigits && inputValue.length >= 4,
      noSpacesValue = inputValue.replace(/\s/g, ""),  // Remove whitespaces
      notCorrectPhoneNumber = isDigitsOnly && !isCorrectNumbers(noSpacesValue),
      isCorrectPhoneNumber = isDigitsOnly && isCorrectNumbers(noSpacesValue);

      if(notCorrectPhoneNumber){
        formatPhoneInput(htmlInput);
        // console.log(notCorrectPhoneNumber + " | " + isDigitsOnly + " / " + isCorrectNumbers(noSpacesValue) + " | " + noSpacesValue);
        htmlInput.parentElement.querySelector(".form-group-alert-text").textContent = (/^(0)\d+$/.test(inputValue))? PhoneNumbersAlert(10) : ((/^(\+27|27)\d+$/.test(inputValue))? PhoneNumbersAlert(11) : "You’ll need to confirm that this email or phone belongs to you");
      }

      if(isCorrectPhoneNumber){
        formatPhoneInput(htmlInput);
        // htmlInput.parentElement.querySelector(".form-group-alert-text").textContent = "You’ll need to confirm that this email or phone belongs to you";
        htmlInput.parentElement.querySelector(".form-group-alert-text").textContent = "You’ll need to confirm that this phone number belongs to you";
        // console.log(2 + " - " +notCorrectPhoneNumber + " | " + isDigitsOnly + " / " + isCorrectNumbers(noSpacesValue) + " | " + noSpacesValue);
      }

      if ((!isCorrectPhoneNumber && htmlInput.value === '') || (!isCorrectPhoneNumber && !notCorrectPhoneNumber && htmlInput.value.length >= 4)) {
        htmlInput.parentElement.querySelector(".form-group-alert-text").textContent = "You’ll need to confirm that this email or phone belongs to you";
        // console.log(3 + " - " +notCorrectPhoneNumber + " | " + isDigitsOnly + " / " + isCorrectNumbers(noSpacesValue) + " | " + noSpacesValue);
      }
    }

    if(emailChars){
      if(htmlInput.value !== ''){
        htmlInput.parentElement.querySelector(".form-group-alert-text").textContent = "You’ll need to confirm that this email belongs to you";
        // console.log("Email: " + emailChars + " | startsWith@ " + inputValue.startsWith("@") + " / isValidEmail" + emailRegex.test(inputValue));
      }
      else {
        htmlInput.parentElement.querySelector(".form-group-alert-text").textContent = "You’ll need to confirm that this email or phone belongs to you";
      }
    }

  }

  if(htmlInput.id === "passwd"){
    console.log('Passwd Input: ' + inputValue);
    if(htmlInput.value !== ''){
      // htmlInput.parentElement.querySelector(".form-group-alert-text").textContent = "You’ll need to confirm that this email belongs to you";
      // console.log("Email: " + emailChars + " | startsWith@ " + inputValue.startsWith("@") + " / isValidEmail" + emailRegex.test(inputValue));
    }
    else {
      // htmlInput.parentElement.querySelector(".form-group-alert-text").textContent = "Please enter your password";
    }
  }

}

function focusEvent(htmlInput){
  // htmlInput.classList.add('has-value');
  htmlInput.classList.remove('has-value');
}

function blurEvent(htmlInput){
  let inputValue = htmlInput.value;

  if (inputValue === '') {
    htmlInput.classList.remove('has-value');
  }
  else {
    htmlInput.classList.add('has-value');
  }

  if(htmlInput.id === "identifier"){
    if(validatePhoneNumber(htmlInput.value)){
      formatPhoneInput(htmlInput);
      htmlInput.parentElement.querySelector(".form-group-alert-text").textContent = "You’ll need to confirm that this email or phone belongs to you";
    }

    // else if(!validatePhoneNumber(htmlInputvalue) && htmlInput.value === '') {
    //   htmlInput.parentElement.querySelector(".form-group-alert-text").textContent = "Phone numbers should be 10 numbers only"
    // }
  }

  if(htmlInput.id === "passwd"){
    // console.log("Passwd Blur: " + inputValue);
  }

  if(htmlInput.id === "month"){
    if (inputValue === '') {
      htmlInput.classList.remove('has-value');
    }
    else {
      htmlInput.classList.add('has-value');
    }
  }

}

function buttonClickEvent(htmlButton) {
  const form = ((htmlButton.parentElement.nodeName && htmlButton.parentElement.tagName).toLowerCase() === "form")? htmlButton.parentElement : (((htmlButton.parentElement.parentElement.nodeName && htmlButton.parentElement.parentElement.tagName && htmlButton.parentElement.parentElement.localName).toLowerCase() === "form")? htmlButton.parentElement.parentElement : null);
  const warningIcon = '<svg aria-hidden="true" class="form-group-alert-icon" fill="currentColor" focusable="false" width="16px" height="16px" viewBox="0 0 24 24" xmlns="https://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>';
      
      
  if(htmlButton.id === "id-verifier"){
    const identifierInput = (!isNull(form))? form.querySelector("input#identifier") : getInputById("identifier");
    
    if(isNull(identifierInput.value)){
      // console.log("is empty " + identifierInput.textContent);

      identifierInput.parentElement.querySelector(".form-group-alert-text").innerHTML = warningIcon + " Enter an email or phone number";
      // identifierInput.textContent= warningIcon + " Enter an email or phone number"
      return;
    }
    
    const inputValue = identifierInput.value;
    
    // Check for email format
    if (emailRegex.test(inputValue)) {
      // console.log("Email" + " | " + inputValue + " | " + emailRegex.test(inputValue));
      if(emailRegex.test(inputValue)){

        replaceFormContent('auth-card', './content/components/auth/auth-passwd.html');

      }
    }

    // Check for only digits and phone number format
    // if( /^(0|\+27|27)\d{9}$/)
    if (/^\d+$/.test(inputValue) && phoneRegex.test(formatPhoneNumber(inputValue))) {
      // console.log("Phone" + " | " + inputValue + " | " + phoneRegex.test(inputValue));
    }
  }

  if(htmlButton.id === "passwd-verifier"){
    const identifierInput = (!isNull(form))? form.querySelector("input#passwd") : getInputById("passwd");
    
    if(isNull(identifierInput.value)){
      // console.log("is empty " + identifierInput.textContent);

      identifierInput.parentElement.querySelector(".form-group-alert-text").innerHTML = warningIcon + " Enter password";
      return;
    }
    
    const inputValue = identifierInput.value;
    console.log(inputValue + " | " + getAuthFormInput('passwd'));
  }

  if(htmlButton.id === "signup"){
    // console.log("signup")
    replaceFormContent('auth-card', './content/components/auth/reg-name.html');
  }

  if(htmlButton.id === "reg-names"){
    // console.log("reg-names")
    replaceFormContent('reg-card', './content/components/auth/reg-bdaygender.html');

    // console.log(body.querySelectorAll('input'));
  }

  if(htmlButton.id === "reg-bdaygender"){
    // const p = getHTMLContent("./content/components/auth/auth-passwd.html");
    
  }
}

const attachedListeners = {};

function addEventListenerWithTracking(htmlElement, eventName, listenerFunction) {
  htmlElement.addEventListener(eventName, listenerFunction);
  attachedListeners[htmlElement.id + eventName] = listenerFunction; // Track using element ID and event name
  
  if(htmlElement.id === 'passwd' || htmlElement.id === 'passwd-verifier'){
    // console.log(htmlElement, listenerFunction);
    elementHasEvent(htmlElement);
  }
}

function getEventListenersForElement(htmlElement, eventName = '') {
  const listeners = [];
  const eventNAME = htmlElement.id + eventName;
  for (const key in attachedListeners) {
    if (key.startsWith(eventNAME)) { // Check if key starts with element ID
      listeners.push(attachedListeners[key]);
    }
  }
  return listeners;
}

function elementHasEvent(htmlElement) {
  // const htmlElement = document.getElementById('myInput');
  const attachedInputListeners = getEventListenersForElement(htmlElement);
  const isElement = htmlElement.localName.toLowerCase() && htmlElement.nodeName.toLowerCase() && htmlElement.tagName.toLowerCase(),
  makeElementName = (isElement)? `${isElement.charAt(0).toUpperCase()}${isElement.slice(1)} element` : '';
  
  // Check if there are any event listeners attached
  if (Object.keys(attachedInputListeners).length > 0) {
    // console.log(`${makeElementName} has event listeners attached.`);
  } else {
    
    if(isElement === 'input'){
      const newInputEvent = () => inputEvent(htmlElement),
      newFocusEvent = () => focusEvent(htmlElement),
      newBlurEvent = () => blurEvent(htmlElement);

      addEventListenerWithTracking(htmlElement, 'input', newInputEvent);
      addEventListenerWithTracking(htmlElement, 'focus', newFocusEvent);
      addEventListenerWithTracking(htmlElement, 'blur', newBlurEvent);
    }

    if(isElement === 'button'){
      const newClickEvent = () => buttonClickEvent(htmlElement);

      addEventListenerWithTracking(htmlElement, 'click', newClickEvent);
    }

    if(isElement){
      const attachedListeners = getEventListenersForElement(htmlElement);

      if (Object.keys(attachedListeners).length <= 0) {
        console.log(`${makeElementName} does not have any event listeners attached.`);
      }
    }

  }
}



function pageInput(htmlInput) {
  elementHasEvent(htmlInput);
}

function pageInputs(htmlInputElements){
  htmlInputElements.forEach(htmlInput => {
    // pageInput(htmlInput);
    elementHasEvent(htmlInput);
  });
}

// inputElements = document.querySelectorAll('input');
// buttons = main.querySelectorAll('button');

pageInputs(inputElements);

function buttonEvents(button){
  button.addEventListener('click', () => {
    buttonClickEvent(button);
  });
}

function buttonsEvents(buttons){
  buttons.forEach(button => {
    // buttonEvents(button);
    elementHasEvent(button);
  });
}

buttonsEvents(buttons);

WindowLoadScroll = () => {
  pageOffsetTop = window.scrollY;
  
  stickyHeader(pageOffsetTop);
}

window.onload = () => {
  WindowLoadScroll()
}
window.onscroll = () => {
  WindowLoadScroll();
}

window.onresize = () => {

  // console.log(window.visualViewport)
  // console.log(window.innerHeight + " " + window.screen.height)
}


