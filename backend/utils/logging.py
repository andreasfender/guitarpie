def print_cl(message, bcolor=None):
    if bcolor is not None:
        print(f"{bcolor}{message}{bcolors.ENDC}")
    else:
        print(f"{message}")

class bcolors:
    HEADER = "\033[95m"
    OKBLUE = "\033[94m"
    OKCYAN = "\033[96m"
    OKGREEN = "\033[92m"
    WARNING = "\033[93m"
    LOW = "\033[90m"
    FAIL = "\033[91m"
    ENDC = "\033[0m"
    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"


