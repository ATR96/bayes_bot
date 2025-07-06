from backend.retriever.loader import load_documents

# Load all documents
docs = load_documents("backend/data")

# Basic checks
print(f"Loaded {len(docs)} documents.\n")

# Print sample document preview
for i, doc in enumerate(docs[:2]):
    print(f"Document {i+1}")
    print("-" * 40)
    print(f"\nSource: {doc.metadata.get('source')}")
    print(f"\nType: {doc.metadata.get('type')}")
    print(f"\nContent Preview:\n{doc.page_content[:500]}...\n")
    print("=" * 60)
