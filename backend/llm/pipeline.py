from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from transformers import pipeline as hf_pipeline

# Load FAISS DB + embedder
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
db = FAISS.load_local("backend/vectorstore/faiss_index_test", embedding_model, allow_dangerous_deserialization=True)
retriever = db.as_retriever(search_type="similarity", k=5)

# Load HuggingFace LLM
# generator = hf_pipeline("text-generation", model="tiiuae/falcon-7b-instruct", max_length=300)

# Using a smaller model for faster response times
generator = hf_pipeline("text-generation", model="tiiuae/falcon-rw-1b", max_new_tokens=300, truncation=True)

def generate_response(query: str) -> str:
    try:
        # Retrieve relevant documents
        docs = retriever.invoke(query)
        
        # Truncate context to 2000 characters
        context = "\n".join([doc.page_content for doc in docs])[:2000]  # truncate to char limit

        # If no documents found, return a default message
        if not context:
            return "No relevant documents found in the knowledge base."

        # Create a prompt with the context and query
        prompt = f"Context:\n{context}\n\nQuestion: {query}\nAnswer:"
        # Generate the response
        result = generator(prompt, do_sample=True, temperature=0.7)

        print(f"Retrieved {len(docs)} documents")
        print(f"Prompt: {prompt[:500]}")

        return {
                    "answer": result[0]["generated_text"].split("Answer:")[-1].strip(),
                    "retrieved_chunks": [doc.page_content for doc in docs]
                }

    except Exception as e:
        return f"Error generating response: {str(e)}"

def generate_response_stream(query: str):
    try:
        # Retrieve relevant documents
        docs = retriever.invoke(query)

        # Truncate context to 2000 characters
        context = "\n".join([doc.page_content for doc in docs])[:2000]

        # If no documents found, return a default message
        if not context:
            yield "No relevant documents found in the knowledge base."
            return

        # Create a prompt with the context and query
        prompt = f"Context:\n{context}\n\nQuestion: {query}\nAnswer:"
        # Generate the response
        result = generator(prompt, do_sample=True, temperature=0.7)

        text = result[0]["generated_text"].split("Answer:")[-1].strip()
        for token in text.split():
            yield token + " "

    except Exception as e:
        yield f"Error: {str(e)}"

