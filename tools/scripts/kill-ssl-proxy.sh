#!/usr/bin/bash

if [[ $(lsof -t -i:4200 -i:4201) ]]; then
	kill -9 $(lsof -t -i:4200 -i:4201)
fi