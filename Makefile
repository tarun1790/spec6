.PHONY: dev build start lint test clean docker-build docker-up

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

lint:
	npm run lint

docker-build:
	docker build -t specflow-ai:latest .

docker-up:
	docker compose up -d

clean:
	rm -rf .next node_modules out
