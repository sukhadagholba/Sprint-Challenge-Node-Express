# Review Questions

## What is Node.js?
Answer: Node js is a runtime environment (program that runs applications or orther programs) to execute Javascript outside the browser.


## What is Express?
Answer: Express is a popular framework that sits on top of node.js and adds extra functionality like middleware supoort and routing.  


## Mention two parts of Express that you learned about this week.
Answer: Routing and middleware. 

## What is Middleware?
Answer: Middleware is software that adds additional functionality to our application, additional features that are not provided by the application. 

## What is a Resource?
Answer: In node.js everything is a resource and each resource is accessible via a unique URL.

## What can the API return to help clients know if a request was successful?
Answer: A response message specifing the request was successful.  

## How can we partition our application into sub-applications?
Answer: using express Router. 

## What is express.json() and why do we need it?
Answer: It is a built-in middleware function in Express that parses incoming requests with JSON payloads. It uis based on body-parser. It sets Content-Type to text/plain if Accept header doesn't contain application/json.
