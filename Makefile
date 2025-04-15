DOCKER_COMPOSE= docker compose

make: all

build:
	$(DOCKER_COMPOSE) build

up:
	$(DOCKER_COMPOSE) up -d --build

down:
	$(DOCKER_COMPOSE) down

logs:
	$(DOCKER_COMPOSE) logs -f

ps:
	$(DOCKER_COMPOSE) ps

clean:
	$(DOCKER_COMPOSE) down --rmi all --volumes --remove-orphans

fclean: clean
	docker system prune

all: build up

re: clean all

.PHONY: build up down logs clean fclean