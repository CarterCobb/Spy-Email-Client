# Spy Email Client

> :bangbang: This project is in development. It satisfies all the technical requirements but is undergoing bug fixes.

Create an email client application that can both send and receive an email message using an email service of your choice (Gmail is a popular and easy-to-use option).  The email client that you build will allow users to both encrypt and/or sign the email, prior to sending. Your email client should also be capable of receiving, decrypting, reading, and displaying newly incoming encrypted and/or signed email. If an incoming email has been encrypted your client will need to decrypt it.  If an incoming email has been signed, your client application should attempt to verify the signature, and display this to the user.

## Requirements

- The email client must support both sending and receiving of emails with the following limitations:
  - Attachments do not need to be supported.
  - No CC or BCC line needs to be supported.
- Symmetric encryption mentioned in the requirements below should be accomplished using AES. (Note: A unique symmetric key should be used for each and every email)
- Store public and private keys in files on disk or in some other format of your choosing.  They do not need to be generated by your application - you can use a tool.
- The client should be able to load the private key file for the current user of the application.
- The client should be able to load public key files for other users that are stored on disk using the email address as a case insensitive key.
- When sending email:
  - The user should be able to choose to encrypt the email contents, sign the email contents, or both.
  - If the user selection includes encryption, the email content should be encrypted using AES symmetric encryption, and then the symmetric key used for encryption should itself be encrypted using each intended recipient's public key.  Both the encrypted email content and the encrypted symmetric key should be included in the sent email content.
  - If the user chooses to sign the email, then your application should hash the email content and then encrypt the resulting signature using the sender's private key.
  - Develop a scheme for the email body that can flow through an existing email server and within the SMTP protocol (base64 encoding should probably be part of this scheme).  Somehow indicate to your receiving email client that the message has been encrypted and/or signed (your email client should also be able to handle regular plain text, unsigned emails). JSON as an organizing data-transport scheme will probably be your friend here.
- When receiving an email:
  - The email client should check to see if the incoming email has been encrypted and/or signed.
  - If the incoming email has been encrypted then the client should use the recipient's private key to decrypt the symmetric key and then use the now-decrypted symmetric key to decrypt the email content before displaying it.
  - If the incoming email has been signed then the client should use the sender's public key to validate the signature and then, in some way, indicate if the signature is valid.
  - Be sure that displaying the email content does not include any of your meta information, only the original message as intended.
- At no time should a user's private key be sent or exposed in any way.
- The user should also be able to send a simple non-encrypted, non-signed plaintext email via your email application
- You should have a simple, easy-to-use UI of some kind (a console application is just fine). Think about the big pieces of functionality, and how they all fit together, the user should have options via the UI to:
  - Send an email, with encryption and/or signing, or simply plain text
  - Retrieve a list of email messages from your inbox, display some basic header, message info
  - Choose to view a specific message
  - Display the decrypted content of the particular chosen email
  - Be sure that any user can act as both a sender and receiver of email. Be prepared to demonstrate two totally separate users conducting an encrypted conversation, using only your email application

## Project Tech-Stack

For this project the following items were used to develop out a program to satisfy the above requirements:

- React.js (Frontend)
  - JavaScript
- Node.js (Backend)
  - Express.js
  - Express-Session
  - Nodemailer
  - SMTP/IMAP
  - JavaScript

## API Docs

There are extensive API docs found [here](https://github.com/CarterCobb/Spy-Email-Client/tree/master/docs) for all of the backend functionality.

## Pre Run

- Create a `.env` file in the root of the directory and add the following variable(s):
  - `SESSION_SECRET=<some random and long string>`

## Run

This project uses Gmail as its SMTP client. All email accounts must be Gmail.

To encure gmail compatability & automatically generate an AES key pair for the system:

- Login using the `/v1/login` route with the following:
  - `{ "username": "<your gmail email>", "password": "<gmail app password>" }`
- If you need help creating a Gmail App Password, see [here](https://support.google.com/mail/answer/185833?hl=en-GB)

### Frontend

Please note: _the frontend is in development and is unstable_.

In the root directory:

- `cd client`
- `npm i`
- `npm run start`

### Backend

In the root directory:

- `npm i`
- `nodemon`

## Additional Details

This was built as an assignment for a college class at [Neumont College of Computer Science](https://www.neumont.edu/). Please do not use any part of this project in any way that would be considered plagiarism.
