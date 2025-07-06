from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter

def build_vectorstore(documents, index_path="backend/vectorstore/faiss_index"):
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=400)
    split_docs = splitter.split_documents(documents)

    embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    db = FAISS.from_documents(split_docs, embedding=embedding_model)
    db.save_local(index_path)

    print(f"Vectorstore saved to {index_path}")
    return db
