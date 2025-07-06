import sys
import shutil
import subprocess
from pathlib import Path

# Endpoint to check cache size
def get_cache_size_mb():
    cache_path = Path.home() / ".cache" / "huggingface"
    if cache_path.exists():
        return round(shutil.disk_usage(cache_path).used / 1024**2, 2)
    return 0

# This function clears the HuggingFace cache
def clear_huggingface_cache():
    try:
        print("Clearing HuggingFace cache...")
        subprocess.run([sys.executable, "-m", "huggingface_cli", "cache", "delete", "--yes"], check=True)
        print("HuggingFace cache cleared.")
    except Exception as e:
        print(f"Cache cleanup failed: {e}")