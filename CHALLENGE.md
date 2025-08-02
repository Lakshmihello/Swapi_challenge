# Challenge

This code challenge has tasks that will help us gauge a minimum skill level, as well as learn how you think about things. As you read through the tasks and complete them below, please take notes of your process to approach each of these challenges. We may ask you various questions specific to this challenge, so noting issues, thoughts, and steps you took as you complete these will be important.

## Challenge 1 - Get it working

The app no longer works. Find the fix(es) needed to make it load up again.

## Challenge 2 - Get it faster

Once you have the app loading, you may have noticed it is a bit slow on initial load. Find a way to speed up that initial data pull.
Two hints from our test machine:
1. A first front-end optimization got the time from about 8 seconds on average to about 5.5 seconds on average.
2. A second back-end optimization got the time from about 5.5 seconds on average to about 3.5 seconds on average.

## Challenge 3 - Fix the bug

When you load up the app, you'll notice there is a breadcrumb at the top of the page for planets. Click one of the planets and you'll see the breadcrumb updates accordingly. However, a bug has been reported that the breadcrumb doesn't appear when going to the "People" section, then clicking one of people in the list. The details page is missing the breadcrumb. Find out why and fix it.

## Challenge 4 - Keep it stable

Update the application to Node 22 and convert the server from CommonJS to ESM.

## Challenge 5 - Analyze this

Pretend we're a startup and this app is a production application. We have 10 customers where we deploy this app for each of them on EC2 instances, thus we are currently running 10 total EC2 instances. For each instance, the data in the application is that single customer's data, where the swapi api represents their endpoints directly. They are quite happy with the design and speed of the app. However, our startup wants to expand this application to 1000 customers, each will have unique data and endpoints where some customers may have millions of records on these pages. We know that pulling the data completely dynamically whenever the application loads is not feasible, so there will be some sort of storage solution to cache the data. We also know that customers will update this data, so we will need to update the cached data on our side according to what each individual customer needs. Lastly, we think having individual EC2 instances is overly expensive and not easily maintainable, so we need something cheaper and more scalable.

Please analyze the current application and provide ideas and steps that might be required to take our startup to the next level to support these needs! Please analyze architecture needs, but also possible changes we need to make to the application itself to support this scaling round.

## Bonus Challenge - Wookiee!

We will not judge you _at all_ for not performing this challenge. However, it is added for your enjoyment for a much harder coding challenge if you so desire. The swapi api has an optional query param of `format=wookiee` that converts the response to wookiee! The challenge is to append that query param to all api requests and get the app still working. Good luck!