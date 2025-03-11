make: all

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

clean:
	docker-compose down --rmi all --volumes --remove-orphans

all: build up

re: down all

.PHONY: build up down logs clean
