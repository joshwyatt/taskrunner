# taskrunner

Distributed job queue with creator and runners components to be run with docker compose in conjunction with swarm if desired.

This project is pre-alpha. Currently there is the tasks created and how they are run are hard-coded. Abstracting this out will be easy.

## usage

* `$ docker-compose up -d`
* `$ curl -d 'job=<job-name>&num=<number-of-jobs-to-run> <host-machine-ip>/:queue-key'`
* `$ docker exec -it task-runner-redis-1 redis-cli`
* `127.0.0.1> KEYS *`
