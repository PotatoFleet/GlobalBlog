
with open('./all.txt', 'r') as file:
	packages = [line for line in file if "@" not in line]
	with open('./requirements.txt', 'w') as rfile:
		rfile.write("".join(packages))
