"use strict"


//An object that hold functions related to add, remove and edit contacts
const contact = {
    errorMessage: document.getElementById("error-message"),
    testContactBtn: document.getElementById("test-contacts-btn"),
    deleteListBtn: document.getElementById("delete-list-btn"),
    contactList: document.getElementById("contact-list"), 
    contactForm: document.getElementById("contact-form"),
    mainNameField: document.getElementById("name"),
    mainPhoneField: document.getElementById("phone"),
    tempNameSave: "",
    tempPhoneSave:"",

    //Function that checks if any contacts in the list and if so show the delete list button
    showDeleteListButton: function(){

        if( countTotalContacts() > 0) {
                this.deleteListBtn.style.display = "inline-block";
            }  else {
                this.deleteListBtn.removeAttribute("style");
            }
    },

    //Function that create a contact and add it to the contact list
    addContact: function(e){
        let nameInput = e.target.parentElement.children[0];
        let phoneInput = e.target.parentElement.children[1];
        
        if(this.validateInput(nameInput) && this.validateInput(phoneInput)){
            const listElement = document.createElement("li");

            const contact = document.createElement("input");
            setAttributes(contact,{
                "class" : "list-text", 
                "type": "text", 
                "value": nameInput.value, 
                "disabled": ""
            })
            const phone = document.createElement("input");
            setAttributes(phone,{
                "class" : "list-text", 
                "type": "text", 
                "value": phoneInput.value, 
                "disabled": ""
            })
            const editBtn = document.createElement("input");
            setAttributes(editBtn,{
                "class" : "listBtn", 
                "type": "button", 
                "value": "Ändra", 
                "onclick": "contact.editContact(event)"
            })

            const deleteBtn = document.createElement("input");
            setAttributes(deleteBtn,{
                "class" : "listBtn", 
                "type": "button", 
                "value": "Ta bort", 
                "onclick": "contact.deleteContact(event)"
            })
        
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

        //disable the main input fields
        EnableDisableField(this.mainNameField);
        EnableDisableField(this.mainPhoneField);

        //Hide all other buttons list items that is not being edited
        let buttons = document.querySelectorAll("input[type=button]");
            buttons.forEach((button) => 
                {
                    if(button != e.target && button != e.target.nextElementSibling){
                        button.style.display = "none";
                    }
                });

    },
    saveChanges: function(e){
        const nameField = e.target.parentElement.children[0];
        const phoneField = e.target.parentElement.children[1];

        if(this.validateInput(nameField) && this.validateInput(phoneField))
            {
                nameField.disabled = true;
                phoneField.disabled = true;

                //Change save button to edit with functionality
                e.target.value = "Ändra";
                e.target.setAttribute("onclick", "contact.editContact(event)");
                
                //enable and show all other buttons
                let buttons = document.querySelectorAll("input[type=button]");
                buttons.forEach((button) => {
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

                //enable the main input fields
                EnableDisableField(this.mainNameField);
                EnableDisableField(this.mainPhoneField);
            } else {
                this.showErrorMessage(e);
            }
    },
    //Function that cancel the edited contact fields and return the previous name and phone number
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

        //enable the main input fields
        EnableDisableField(this.mainNameField);
        EnableDisableField(this.mainPhoneField);
    },
    //Function that removes all contacts
    deleteList: function(e){
        const button1 = document.getElementById("delete-confirmation-message").children[1];
        const button2 = document.getElementById("delete-confirmation-message").children[2];
        const deleteList = e.target.value === "Ta bort";
        if(deleteList){
            this.contactList.innerHTML = "";
        } 

        //Show all hidden buttons
        let buttons = document.querySelectorAll("input[type=button]");
        buttons.forEach((button) => 
            {
                if(button != button1 && button != button2){
                    button.removeAttribute("style");
                }
            });
        
        //remove the error message
        e.target.parentElement.removeAttribute("style");
        this.errorMessage.removeAttribute("style");
        
        //Hide delete list button
        this.showDeleteListButton();

        //Enable the main input fields
        EnableDisableField(this.mainNameField);
        EnableDisableField(this.mainPhoneField);

    },
    //Function that show a popup warning when the user tries to delete the whole list
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
                    button.style.display = "none";
                }
            });

        //disable the main input fields
        EnableDisableField(this.mainNameField);
        EnableDisableField(this.mainPhoneField);

    },

    //Funktion som lägger till 16st testkontakter i listan
    addTestContacts: function(e){
        let names = ["Helen Berg","Jonas Berghagen", "Anders Mjölner", "Jonathan Myrstrand", "Emma Andersson", "Katrin Olander", "Göran Larsson", "Bengt-åke Dalberg","Helen Berg","Jonas Berghagen", "Anders Mjölner", "Jonathan Myrstrand", "Emma Andersson", "Katrin Olander", "Göran Larsson", "Bengt-åke Dalberg"];
        let numbers = ["073-18916516-645", "073-69716516-645","073-18985416-645","073-18916516-645", "073-69716516-645","073-18985416-645","073-18916516-645", "073-69716516-645","073-18916516-645", "073-69716516-645","073-18985416-645","073-18916516-645", "073-69716516-645","073-18985416-645","073-18916516-645", "073-69716516-645"];
        for(let i = 0; i < 16 ;i++){

            const listElement = document.createElement("li");

            const contact = document.createElement("input");
            setAttributes(contact,{
                "class" : "list-text", 
                "type": "text", 
                "value": names[i], 
                "disabled": ""
            })
            const phone = document.createElement("input");
            setAttributes(phone,{
                "class" : "list-text", 
                "type": "text", 
                "value": numbers[i], 
                "disabled": ""
            })
            const editBtn = document.createElement("input");
            setAttributes(editBtn,{
                "class" : "listBtn", 
                "type": "button", 
                "value": "Ändra", 
                "onclick": "contact.editContact(event)"
            })

            const deleteBtn = document.createElement("input");
            setAttributes(deleteBtn,{
                "class" : "listBtn", 
                "type": "button", 
                "value": "Ta bort", 
                "onclick": "contact.deleteContact(event)"
            })
            
            listElement.append(contact,phone,editBtn,deleteBtn);
            this.contactList.append(listElement);
            
            //Remove error message if showing
            this.errorMessage.removeAttribute("style");
            //Clear form values
            this.contactForm.reset();
        }    

        this.showDeleteListButton();
    },
    //Function that check if a text field is empty
    validateInput: function(input){
        if(input.value.trim() === "" || input.value.trim() === null) return false;
        else return true;
    }, 

     //Function that changes the appearance of a text field when active
     activeField: function(field, string){
        field.className = "list-text-highlight";
        field.removeAttribute("placeholder");
        field.setAttribute("placeholder", string);
        field.removeEventListener("click", this.activeField);
    },

    //Show an error message in the empty field if user tried to save an empty contact
    showErrorMessage: function(e){
        const nameField = e.target.parentElement.children[0];
        const phoneField = e.target.parentElement.children[1];
    
        if(!contact.validateInput(nameField)){
            showErrorMessage2(nameField, "Namn");
        }
        if(!contact.validateInput(phoneField)){
            showErrorMessage2(phoneField, "Telefon");
        }
    }
};

const showErrorMessage2 = (field,placeholder) => {
    field.className = "list-field-error-message";
    field.placeholder = "Detta fält får ej vara tomt";
    field.addEventListener("click", () => {
        contact.activeField(field,placeholder);
    });
}

//Function that calculate total contacts in the list, show on screen and return total count
const countTotalContacts = function(){
    const totalContactField = document.getElementById("contact-count");
    const contactList = document.getElementById("contact-list");
    const contactCount = contactList.children.length;

    totalContactField.innerText = `Antal kontakter: ${contactCount}`;
    return contactCount;
}

//A function that set multiple attributes to the same element.
const setAttributes = function(element, attributes){
    for(const [key, value] of Object.entries(attributes)){
        element.setAttribute(key,value);
    }
}

//Function that enable a field that is disabled and vice versa
const EnableDisableField = (field) => {
    if(field.disabled === true){
        field.removeAttribute("disabled");
    } else {
        field.setAttribute("disabled", "");
    }
}