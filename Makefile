DOCKER_COMPOSE= docker-compose

make: all

build:
	$(DOCKER_COMPOSE) build

up:
	$(DOCKER_COMPOSE) up -d

down:
	$(DOCKER_COMPOSE) down

logs:
	$(DOCKER_COMPOSE) logs -f

clean:
	$(DOCKER_COMPOSE) down --rmi all --volumes --remove-orphans

fclean: clean
	docker system prune

all: build up

re: down all

.PHONY: build up down logs clean fclean