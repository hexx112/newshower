#!/usr/bin/env python
import RPi.GPIO as GPIO
import time
import requests

BtnPin = 12    # pin12 --- button
url = 'http://sim.wallaceict.net:3000'
uid = 'looey2005@outlook.com'

def setup():
	GPIO.setmode(GPIO.BOARD)       # Numbers GPIOs by physical location
	GPIO.setup(BtnPin, GPIO.IN, pull_up_down=GPIO.PUD_UP)    # Set BtnPin's mode is input, and pull up to high level(3.3V)

def loop():
	flip = False
	num = 10

	while True:
		before = flip

		if GPIO.input(BtnPin) == GPIO.LOW: # Check whether the button is pressed or not.
			flip = True
		else:
			flip = False

		if flip != before:
			if flip == True:
				num = 500
				print 'We\'re starting your shower'
				requests.post(url+"/hard/start?id="+uid)
			if flip == False:
				print 'Your shower has ended ' + str(num)
  				requests.post(url+"/hard/end?num="+str(num)+"&id="+uid)


		num -= 1
		time.sleep(1)


def destroy():
	GPIO.cleanup()                     # Release resource

if __name__ == '__main__':     # Program start from here
	setup()
	try:
		loop()
	except KeyboardInterrupt:  # When 'Ctrl+C' is pressed, the child program destroy() will be  executed.
		destroy()

