from backend.retriever.loader import load_documents
from backend.retriever.vectorstore import build_vectorstore

import warnings
warnings.filterwarnings("ignore", category=UserWarning)

if __name__ == "__main__":
    print("Loading documents...")
    docs = load_documents("backend/data")

    if not docs:
        print("No valid documents found. Exiting.")
        exit()

    print("Building vectorstore...")
    db = build_vectorstore(docs, index_path="faiss_index_test")
    print("Done.")
