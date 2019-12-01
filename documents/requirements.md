# Requirements Document

## Google Keep (Digital Notes)
### Description: 

A web-based platform for note-taking developed by Google. On this web app, the user can write, edit, customize, and share their notes. The user can organize their notes by categorizing and archiving their notes. The notes are linked to the user’s gmail account, so it can be accessed and modified everywhere. It can also be shared to other users using their gmail accounts for cooperative note taking.

### User Stories
**1. Google Authentication Account:** As a user, I would want to create login credentials to be able to utilize the websites functionality.<br/>
**2. User Account Login/Logout:** As a user, I would want to log in using my credentials and log out to keep others from manipulating my account details and notes.<br/>
**3. Homepage:** As a user, I want to visit the homepage where I can login, register, logout, create, delete, tag, archive, pin and share notes (UI). Notes should be displayed on the homepage where it can be organized by alphabetical and recency filters.<br/>
**4. Note Filter:** As a user who wants to find notes that I previously created, I want to process through my list of notes using a filter.<br/>
**5. Add/Delete Note:** As a user who wants to keep memory of information that I can access, I want to make a digital note. The note must include a subject and description. If a previously created note is no longer needed, I want to be able to discard unwanted digital notes.<br/>
**6. Share Note:** As a user who wants to keep memory of information that others and I can access, I want to share my digital note with others’ emails.<br/>
**7. Edit:** As a user who wants to revisit and modify a note, I want to make a change to a note that already exists.  <br/>
**8. Archive:** As a user who is done with a note temporarily, I want to temporarily set that digital note aside from the page. I can restore digital notes that I archived back into the main page.<br/>
**9. Upload Image:** As a user, if necessary, I want to be able to add displaying images in my digital notes for effective note taking. <br/>
**10. Search By Tag:** As a user, I want to be able to identify and locate my notes by adding search tags.<br/>

## User Requirements & Functional Requirements Breakdown
### Google Authentication Account
- **Purpose:** Users want to start using GoogleKeep through a simple authentication process.<br/>
- **Database dependencies:** To authenticate a user, the database needs to register the user associated to his/her email.<br/>
- **Technical Note:** Users need an existing email to create their login. They cannot use a registered email already in GoogleKeep database to create a new login.<br/>
- **Feature Result:** User can use an email to create login credentials to be able to utilize GoogleKeep’s functionality.<br/>

### User Account Login/Logout
- **Purpose:** Users need a login and log out function to keep others from accessing their account details and notes.<br/>
- **Database dependencies:** The database finds a match to the user’s email in the users list. Then, it retrieves and secures notes associated with the user’s ID and their login email. <br/>
- **Technical Note:** GoogleKeep needs to keep the user signed in on the browser unless the logout function is called.<br/>
- **Feature Result:** Users can log into GoogleKeep using their credentials and log out to hide their notes and account data from each other.<br/>

### Homepage
- **Purpose:** Users needs a homepage where they can have readily access to GoogleKeep’s functions.<br/>
- **Database Dependencies:** User inputs are stored as data in different components in the database associated with the registered user.<br/>
- **Technical Note:** Notes and interactive features should be displayed on the homepage.<br/>
- **Feature result:** Users has a homepage where they can login, register, logout, create, delete, tag, archive, pin and share notes (UI).<br/>

### Note Filter
- **Purpose:** Users want to apply a note filter to change the display of notes.<br/>
- **Database dependencies:** List of notes in the database are processed and moved to reflect the logic of the selected filter.<br/>
- **Technical Note:** Notes need to be fully filtered before refreshing in the homepage when a filter is applied.<br/>
- **Feature result:** Users can filter their notes based on alphabetical subject and recently created notes.<br/>

### Add/Delete Note
- **Purpose:** Users need to keep memory of information in a digital note that they can access. <br/>
- **Database Dependencies:** The database stores the created note with the associated user ID and login email. The database removes the note selected by the user to be deleted and dissociates it with the user’s ID and login email.<br/>
- **Technical Note:** The note must include a subject and description. If a previously created note is no longer needed, I want to be able to discard unwanted digital notes.<br/>
- **Feature Result:** The user can successfully create a new note which shows up on the homepage. The user can successfully delete and existing note and it no longer shows up on their homepage.<br/>

### Share note
- **Purpose:** Users want to be able to share digital notes with each other.<br/>
- **Database dependencies:** GoogleKeep parses the user and recipient’s email input and directs to the database. The shared note’s ID is now referenced to both the user and the recipient’s ID.<br/>
- **Technical Note:** If a shared note is deleted, the note is removed for both the sender and recipient.<br/>
- **Feature result:** The user is able to share and view notes with recipients through email.<br/>

### Edit
- **Purpose:** As a user who wants to revisit and modify a note, I want to make a change to a note that already exists.<br/>
- **Database Dependencies:** The database needs to reflect the new changes that the user has made to a note. When a user chooses to edit a note, the database needs to find it in the user’s associated notes and update its contents.<br/>
- **Technical Note:** The note must exist and once I make the changes I want, the database should update the note and store those changes.<br/>
- **Feature Result:** The existing note’s old content is replaced with the edited content that the user wanted and is reflected on the users homepage.<br/>

### Archive
- **Purpose:** User wants to temporarily set a digital note aside from the main page.<br/>
- **Database dependencies:** An event is triggered which references the targeted note’s ID in the database. Using the note’s ID, the system updates the archive state of the note and sends it to the archive sub database.<br/>
- **Technical Note:** Archived notes need to be able to be restored back into the homepage.<br/>
- **Feature result:** The user can view archived notes in another page and restore it back to the homepage by clicking the archive button.<br/>

### Upload Image
- **Purpose:** If necessary, users want to be able to add displaying images in their digital notes for effective note taking.<br/>
- **Database dependencies:** The note’s ID is referenced in which the note is updated with the link to the uploaded image in the database.<br/>
- **Technical Note:** The image must be .png and jpg. An image can be uploaded when a note is being composed.<br/>
- **Feature result:** The user can upload images from a finder and display them on the selected note.<br/>

### Search By Tag
- **Purpose:** Users want to identify and locate their notes by adding search tags.<br/>
- **Database Dependencies:** When a user adds tags, the database needs to find the particular note and store the associated tags with the specific note.<br/>
- **Technical Note:** The tags need to be stored as an element of the note so that the specific note can be filtered using the tags.<br/>
- **Feature Result:** The user can view their notes grouped by the specific tags.<br/>


