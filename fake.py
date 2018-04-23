import names
import random
import os

mail = ['gmail.com', 'zoho.co.uk', 'outlook.co.uk', 'yahoo.net', 'hotmail.co.uk']
nameamount = int(input())

accounts = {

}

def key():
	return ''.join(random.choice('0123456789ABCDEF') for i in range(28)).lower().replace(' ', '')

def makenames(amount):
	tot = []
	for i in range(amount):
		if(bool(random.getrandbits(1))):
			name = (list(names.get_first_name())[0] + names.get_last_name()).lower()
		else:
			name = (names.get_first_name() + names.get_last_name()).lower()
		end = '@' + random.choice(mail)
		if(bool(random.getrandbits(1))):
			num = str(random.randint(0, 2) * '0') +str(random.randint(0, 1000)).replace('0', '')
		else:
			num = ''
		tot.append(name + num + end)
	return tot

if __name__ == '__main__':
	for n, i in enumerate(makenames(nameamount)):
		accounts.update({key(): {
			"password": "158ffff874",
			"email": "<img src=../badge/"+random.choice(os.listdir('pub/badge'))+"></img>" + i,
			"confirmedemail": True,
			"tot": random.randint(0, 200),
			"best": 499,
			"achievements": ["2018/4/17: Created account", "2018/4/17: Super quick shower"],
			"showers": [
				["2018/4/17", random.randint(0, 200)]
			]
		}})

	open('accounts.json', 'w').write(str(accounts).replace('True', 'true').replace("'", '"'))
