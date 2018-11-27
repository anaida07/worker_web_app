AWS_PROFILE:=team0workermgmt
APP_VERSION:=latest

build:
	docker build -t worker-web-app .
run:
	docker run -p8081:8081 -v ${PWD}:/usr/src/app worker_web_app:latest
ecr_push:
	make build
	eval `aws ecr get-login --no-include-email --region us-east-1 --profile $(AWS_PROFILE)`
	docker tag worker-web-app:latest 574574226067.dkr.ecr.us-east-1.amazonaws.com/worker-web-app:$(APP_VERSION)
	docker push 574574226067.dkr.ecr.us-east-1.amazonaws.com/worker-web-app:$(APP_VERSION)
 
