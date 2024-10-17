"use strict"



//An object that hold all the functions to add, remove and edit contacts
const contact = {
    errorMessage: document.getElementById("error-message"),
    testContactBtn: document.getElementById("test-contacts-btn"),
    deleteListBtn: document.getElementById("delete-list-btn"),
    contactList: document.getElementById("contact-list"), 
    contactForm: document.getElementById("contact-form"),
    tempNameSave: "",
    tempPhoneSave:"",

    //Funktion som kollar om knappen Radera lista ska visas.
    showDeleteListButton: function(){

        if( countTotalContacts() > 0) {
                this.deleteListBtn.style.display = "inline-block";
            }  else {
                this.deleteListBtn.removeAttribute("style");
  /*               this.testContactBtn.style.display = "inline-block"; */
            }
    },

    addContact: function(e){
        let nameInput = e.target.parentElement.children[0];
        let phoneInput = e.target.parentElement.children[1];
        
        if(inputField.validateInput(nameInput) && inputField.validateInput(phoneInput)){
            const listElement = document.createElement("li");

            const contact = document.createElement("input");
            contact.setAttribute("class","list-text");
            contact.setAttribute("type", "text");
            contact.setAttribute("value", nameInput.value);
            contact.setAttribute("disabled", "");
     
            const phone = document.createElement("input");
            phone.setAttribute("class","list-text");
            phone.setAttribute("type", "text");
            phone.setAttribute("value", phoneInput.value);
            phone.setAttribute("disabled", "");
        
            const editBtn = document.createElement("input");
            editBtn.setAttribute("class","listBtn");
            editBtn.setAttribute("type", "button");
            editBtn.setAttribute("value", "Ändra");
            editBtn.setAttribute("onclick", "contact.editContact(event)");
            
            const deleteBtn = document.createElement("input");
            deleteBtn.setAttribute("type", "button");
            deleteBtn.setAttribute("value", "Ta bort");
            deleteBtn.setAttribute("onclick", "contact.deleteContact(event)");
            deleteBtn.setAttribute("class","listBtn");
        
            listElement.append(contact,phone,editBtn,deleteBtn);
            this.contactList.append(listElement);
            
           this.errorMessage.removeAttribute("style");
           this.contactForm.reset();

            this.showDeleteListButton();
        } else {
            this.errorMessage.style.display = "block";
        }
    },
    deleteContact: function(e){
        e.target.parentElement.remove();
        this.errorMessage.removeAttribute("style");
        this.showDeleteListButton();
    },
    editContact: function(e){
        //save old name and number
        this.tempNameSave = e.target.parentElement.children[0].value;
        this.tempPhoneSave = e.target.parentElement.children[1].value;
        
        //enable the fields to edit
        e.target.parentElement.children[0].disabled = false;
        e.target.parentElement.children[1].disabled = false;
        
        //change the edit button to a save button with functionality
        e.target.value = "Spara";
        e.target.setAttribute("onclick", "contact.saveChanges(event)");

        //Change the remove button to Cancel button with functionality
        e.target.nextElementSibling.value = "Avbryt";
        e.target.nextElementSibling.setAttribute("onclick", "contact.cancelChange(event)");

        //highlight the list items that is being edited
        e.target.parentElement.className = "highlight";
        e.target.className = "listBtn-highlight";
        e.target.nextElementSibling.className = "listBtn-highlight";
        e.target.parentElement.children[0].className = "list-text-highlight";
        e.target.parentElement.children[1].className = "list-text-highlight";
        
        //remove errorMessage from Main input section if showing
        this.errorMessage.removeAttribute("style");

        //Hide all other buttons list items that is not being edited
        let buttons = document.querySelectorAll("input[type=button]");
            buttons.forEach((button) => 
                {
                    if(button != e.target && button != e.target.nextElementSibling){
                        button.setAttribute("disabled", "");
                    }
                });

            buttons.forEach((button) =>{
                if(button.disabled === true){
                    button.style.display = "none";
                }
            })
    },
    saveChanges: function(e){
        const nameField = e.target.parentElement.children[0];
        const phoneField = e.target.parentElement.children[1];

        if(inputField.validateInput(nameField) && inputField.validateInput(phoneField))
            {
                nameField.disabled = true;
                phoneField.disabled = true;
                e.target.value = "Ändra";
                e.target.setAttribute("onclick", "contact.editContact(event)");
                
                //enable and show all other buttons
                let buttons = document.querySelectorAll("input[type=button]");
                buttons.forEach((button) => {
                    button.removeAttribute("disabled");
                    button.removeAttribute("style");
                });

                //add delete button separate as default is not displayed
                this.showDeleteListButton();

                //change cancel button to remove button with functionality
                e.target.nextElementSibling.value = "Ta bort";
                e.target.nextElementSibling.setAttribute("onclick", "contact.deleteContact(event)");

                //remove highlight styles
                e.target.className = "listBtn";
                e.target.nextElementSibling.className = "listBtn";
                e.target.parentElement.removeAttribute("class");
                e.target.parentElement.children[0].className = "list-text";
                e.target.parentElement.children[1].className = "list-text";
            } else {
                inputField.showErrorMessage(e);
            }
            
    },
    cancelChange: function(e){
        //get the name and phone fields
        const nameField = e.target.parentElement.children[0];
        const phoneField = e.target.parentElement.children[1];

        //disable the active field
        nameField.disabled = true;
        phoneField.disabled = true;

        //change name and phone to the unchanged values
        nameField.value = this.tempNameSave;
        phoneField.value = this.tempPhoneSave;

        ///change the cancel button back to remove button with functionality
        e.target.value = "Ta bort";
        e.target.setAttribute("onclick", "contact.deleteContact(event)");

        //change the save button to change button with functionality
        e.target.previousElementSibling.value = "Ändra";
        e.target.previousElementSibling.setAttribute("onclick", "contact.editContact(event)");

        //add back other buttons 
        let buttons = document.querySelectorAll("input[type=button]");
                buttons.forEach((button) => {
                    button.removeAttribute("disabled");
                    button.removeAttribute("style");
                });
        
        //add back delete list button
        this.showDeleteListButton();

        //remove highlighted form elements
        e.target.parentElement.removeAttribute("class");
        nameField.className = "list-text";
        phoneField.className = "list-text";
        e.target.className = "listBtn";
        e.target.previousElementSibling.className = "listBtn";
    },
    //Funktion som tar bort alla kontakter i listan
    deleteList: function(e){
        const button1 = document.getElementById("delete-confirmation-message").children[1];
        const button2 = document.getElementById("delete-confirmation-message").children[2];
        const deleteList = e.target.value === "Ja";
        if(deleteList){
            this.contactList.innerHTML = "";
        } 

        let buttons = document.querySelectorAll("input[type=button]");
        buttons.forEach((button) => 
            {
                if(button != button1 && button != button2){
                    button.removeAttribute("disabled");
                    button.removeAttribute("style");
                }
            });
        
        e.target.parentElement.removeAttribute("style");
        this.errorMessage.removeAttribute("style");
        this.showDeleteListButton();
    },
    //Funktion som visar varning när användaren försöker ta bort hela listan 
    showDeleteListWarning: function(){
        const deleteListWarning = document.getElementById("delete-confirmation-message");
        deleteListWarning.style.display = "block";
        const button1 = document.getElementById("delete-confirmation-message").children[1];
        const button2 = document.getElementById("delete-confirmation-message").children[2];
      
        //Hide all other buttons except in the warning message
        let buttons = document.querySelectorAll("input[type=button]");
        buttons.forEach((button) => 
            {
                if(button != button1 && button != button2){
                    button.setAttribute("disabled", "");
                }
            });

            buttons.forEach((button) =>{
                if(button.disabled === true){
                    button.style.display = "none";
                }
            })
        
    },

    //Funktion som lägger till 16st testkontakter i listan
    addTestContacts: function(e){
        let names = ["Helen Berg","Jonas Berghagen", "Anders Mjölner", "Jonathan Myrstrand", "Emma Andersson", "Katrin Olander", "Göran Larsson", "Bengt-åke Dalberg","Helen Berg","Jonas Berghagen", "Anders Mjölner", "Jonathan Myrstrand", "Emma Andersson", "Katrin Olander", "Göran Larsson", "Bengt-åke Dalberg"];
        let numbers = ["073-18916516-645", "073-69716516-645","073-18985416-645","073-18916516-645", "073-69716516-645","073-18985416-645","073-18916516-645", "073-69716516-645","073-18916516-645", "073-69716516-645","073-18985416-645","073-18916516-645", "073-69716516-645","073-18985416-645","073-18916516-645", "073-69716516-645"];
        for(let i = 0; i < 16 ;i++){

            const listElement = document.createElement("li");

            const contact = document.createElement("input");
            contact.setAttribute("class", "list-text");
            contact.setAttribute("type", "text");
            contact.setAttribute("value", names[i]);
            contact.setAttribute("disabled", "");
     
            const phone = document.createElement("input");
            phone.setAttribute("class", "list-text");
            phone.setAttribute("type", "text");
            phone.setAttribute("value", numbers[i]);
            phone.setAttribute("disabled", "");
        
            const editBtn = document.createElement("input");
            editBtn.setAttribute("type", "button");
            editBtn.setAttribute("value", "Ändra");
            editBtn.setAttribute("onclick", "contact.editContact(event)");
            editBtn.setAttribute("class", "listBtn");
            
            const deleteBtn = document.createElement("input");
            deleteBtn.setAttribute("type", "button");
            deleteBtn.setAttribute("value", "Ta bort");
            deleteBtn.setAttribute("onclick", "contact.deleteContact(event)");
            deleteBtn.setAttribute("class", "listBtn");
            
            listElement.append(contact,phone,editBtn,deleteBtn);
            this.contactList.append(listElement);
            
            this.errorMessage.removeAttribute("style");
            this.contactForm.reset();
            this.showDeleteListButton();

        }    
        if(this.deleteListBtn.style.display === ""){
            this.deleteListBtn.style.display = "inline-block";
        }
    }
};

//An object that hold the funtction for the text fields, validateInput, showErrormessage and when field is in focus.
const inputField = {
    //funktion som kollar om ett fält är tomt och returnerar sant och falskt
    validateInput: function(input){
        if(input.value.trim() === "" || input.value.trim() === null) return false;
        else return true;
    }, 
    /*funktion som tar emot ett event och kollar om sibling-elementen nameField och 
    PhoneField innehåller text. Om inte visas ett felmeddelande i det fältet som saknar text*/
    showErrorMessage: function(e){
        const nameField = e.target.parentElement.children[0];
        const phoneField = e.target.parentElement.children[1];

        if(!this.validateInput(nameField)){
            nameField.className = "list-field-error-message";
            nameField.placeholder = "Detta fält får ej vara tomt";
            nameField.addEventListener("click", () => {
                this.activeField(nameField,"Namn");
            });
        }
        if(!this.validateInput(phoneField)){
            phoneField.className = "list-field-error-message";
            phoneField.placeholder = "Detta fält får ej vara tomt";
            phoneField.addEventListener("click", () => {
                this.activeField(phoneField, "Telefon")
            });
        }
    },

    //Funktion som tar emot ett element och ändrar dess utseende till att se upplyst ut
    //Skall användas för
    activeField: function(field, string){
        field.className = "list-text-highlight";
        field.removeAttribute("placeholder");
        field.setAttribute("placeholder", string);
        field.removeEventListener("click", this.activeField);

    }
}

//Function that calculate total contacts in the list and print it in total contact div.
const countTotalContacts = function(){
    const totalContactField = document.getElementById("contact-count");
    const contactList = document.getElementById("contact-list");
    const contactCount = contactList.children.length;

    totalContactField.innerText = `Antal kontakter: ${contactCount}`;
    return contactCount;
}

/* const noContactsMessage = function(){
    if(countTotalContacts > 0)
}

 */