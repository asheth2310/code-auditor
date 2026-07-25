import sqlite3
import os
import yaml

def get_user(user_id):
    """
    Fetches a user from the local sqlite database by their ID.
    
    Args:
        user_id: The ID of the user to retrieve.
    Returns:
        A dictionary containing the user's data.
    """
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    # Constructing query directly with user input
    query = "SELECT * FROM users WHERE id = '" + str(user_id) + "'"
    cursor.execute(query)
    user = cursor.fetchone()
    conn.close()
    return user

def run_command(cmd):
    """
    Executes a system command for administrative purposes.
    
    Args:
        cmd: The command string to run on the system.
    Returns:
        The exit status of the command.
    """
    # Running system command directly
    return os.system(cmd)

def read_file(filename):
    """
    Reads the content of a file from the server.
    
    Args:
        filename: The name of the file to read.
    Returns:
        The content of the file as a string.
    """
    # Opening file based on user input
    with open(filename, 'r') as f:
        return f.read()

def load_config(data):
    """
    Loads configuration settings from a YAML string.
    
    Args:
        data: The YAML formatted string containing config.
    Returns:
        A dictionary of the configuration settings.
    """
    # Loading YAML data
    return yaml.load(data)
