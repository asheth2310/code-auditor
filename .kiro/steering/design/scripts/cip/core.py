import os
import csv

def _load_csv(filepath):
    # Validate the filepath to prevent path traversal
    base_directory = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    requested_path = os.path.abspath(filepath)

    if not requested_path.startswith(base_directory):
        raise ValueError("Invalid file path.")

    with open(requested_path, 'r', encoding='utf-8') as f:
        return list(csv.DictReader(f))