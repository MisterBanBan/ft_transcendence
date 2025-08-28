DOCKER_COMPOSE= docker compose

make: all

build: update-env
	mkdir -p ./api/users/database
	mkdir -p ./api/auth/database
	$(DOCKER_COMPOSE) build

up: build
	$(DOCKER_COMPOSE) up -d

down:
	$(DOCKER_COMPOSE) down

logs:
	$(DOCKER_COMPOSE) logs -f

ps:
	$(DOCKER_COMPOSE) ps

clean:
	$(DOCKER_COMPOSE) down --rmi all --volumes --remove-orphans
	rm -rf ./api/users/database/*
	rm -rf ./api/auth/database/*
	find ./uploads/ -type f ! -name 'last_airbender.jpg' -delete

fclean: clean
	docker system prune --all --volumes --force

update-env:
	echo "HOSTNAME=$(shell hostname -s)" > .env

all: build up
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout certs/key.key -out certs/cert.crt -subj "/C=FR/ST=RA/L=Lyon/O=42/CN=localhost"

re: fclean all

.PHONY: build up down logs clean fclean update-env