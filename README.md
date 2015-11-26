# Chapter 1 Review Project

Since I'm so interested in having a work queue for long term problems, I think I should set that up to work with a swarm. If I wanted, I could even take a break from redis and go back to swarm after I build this out.

I need a job queue.

I think I can create a queue of jobs in redis and then spin up a node program to basically just hang out and wait for new jobs on the queue to show up. Then probably I could multi-container that thing and see what happens.

MVP is just to be able to build and consume the queue with multiple workers. Refactor is to make the queue handle its health.

Also, if I'm going to be using a class should I just use es6 here? MVP yo.
Down the line think of the jobs as just being json that a worker can consume.
